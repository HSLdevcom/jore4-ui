import { Priority, RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import {
  baseDbResources,
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { Tag } from '../enums';
import {
  Map,
  MapFooter,
  MapModal,
  RouteEditor,
  RoutesAndLinesPage,
  SearchResultsPage,
} from '../pageObjects';
import { RouteStopsOverlay } from '../pageObjects/RouteStopsOverlay';
import { UUID } from '../types';
import {
  SupportedResources,
  insertToDbHelper,
  removeFromDbHelper,
} from '../utils';
import { deleteRoutesByLabel } from './utils';

describe('Edit route geometry', () => {
  let map: Map;
  let routeStopsOverlay: RouteStopsOverlay;
  let routeEditor: RouteEditor;
  let searchResultsPage: SearchResultsPage;
  let routesAndLinesPage: RoutesAndLinesPage;
  let mapModal: MapModal;
  let mapFooter: MapFooter;

  let dbResources: SupportedResources;

  before(() => {
    cy.task<UUID[]>(
      'getInfrastructureLinkIdsByExternalIds',
      testInfraLinkExternalIds,
    ).then((infraLinkIds) => {
      const stops = buildStopsOnInfraLinks(infraLinkIds);

      const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

      dbResources = {
        ...baseDbResources,
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  beforeEach(() => {
    deleteRoutesByLabel(['902']);
    removeFromDbHelper(dbResources);

    insertToDbHelper(dbResources);

    map = new Map();
    routeStopsOverlay = new RouteStopsOverlay();
    routeEditor = new RouteEditor();
    searchResultsPage = new SearchResultsPage();
    routesAndLinesPage = new RoutesAndLinesPage();
    mapModal = new MapModal();
    mapFooter = new MapFooter();

    cy.setupTests();
    cy.mockLogin();
  });

  afterEach(() => {
    deleteRoutesByLabel(['902']);
    removeFromDbHelper(dbResources);
  });

  it(
    "Should edit a route's shape",
    { tags: [Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      cy.visit('/routes');
      routesAndLinesPage.searchContainer
        .getSearchInput()
        .type(`${'901'}{enter}`);

      searchResultsPage.getRoutesResultsButton().click();

      searchResultsPage.getShowRouteOnMapButton().click();

      map.waitForLoadToComplete();

      map.zoomIn(3);

      routeStopsOverlay.routeShouldBeSelected('901');

      routeStopsOverlay.stopsShouldBeIncludedInRoute([
        'E2E001',
        'E2E002',
        'E2E004',
        'E2E005',
        'E2E006',
      ]);

      // Route is edited so that the second stop is not included
      routeEditor.editOneRoutePoint({
        handleIndex: 2,
        deltaX: -50,
        deltaY: 200,
      });
      mapFooter.save();

      routeEditor.checkRouteSubmitSuccessToast();

      routeStopsOverlay.routeShouldBeSelected('901');

      routeStopsOverlay.stopsShouldBeIncludedInRoute([
        'E2E001',
        'E2E004',
        'E2E005',
        'E2E006',
      ]);
      routeStopsOverlay.stopsShouldNotBeIncludedInRoute(['E2E002']);
    },
  );

  it(
    'Should edit route shape correctly when creating new route with template',
    { tags: [Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      // Location where all test stops and routes are visible.
      const mapLocation = { lng: 24.929689228090112, lat: 60.16495016651525 };

      map.visit({
        zoom: 16,
        lat: mapLocation.lat,
        lng: mapLocation.lng,
      });

      mapModal.createRoute({
        routeFormInfo: {
          finnishName: 'Template route',
          label: '902',
          direction: RouteDirectionEnum.Outbound,
          line: '901',
          templateRoute: {
            templateRouteSelectorInfo: {
              priority: Priority.Standard,
              label: '901',
            },
            // Route is edited so that the second stop is not included
            moveRouteEditHandleInfo: {
              handleIndex: 2,
              deltaX: -50,
              deltaY: 200,
            },
          },
          validityStartISODate: '2022-08-11',
          validityEndISODate: '2032-08-11',
          priority: Priority.Standard,
        },
      });

      routeEditor.gqlRouteShouldBeCreatedSuccessfully();

      routeEditor.checkRouteSubmitSuccessToast();

      routeStopsOverlay.routeShouldBeSelected('902');

      // Verify that the edited route shape excludes the second stop
      // and that the stop count is correct
      routeStopsOverlay.assertRouteStopCount(4);
      routeStopsOverlay.stopsShouldBeIncludedInRoute([
        'E2E001',
        'E2E004',
        'E2E005',
        'E2E006',
      ]);
      routeStopsOverlay.stopsShouldNotBeIncludedInRoute(['E2E003']);
    },
  );
});
