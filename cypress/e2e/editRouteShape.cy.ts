import { Priority, RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
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

  const baseDbResources = getClonedBaseDbResources();

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
      routesAndLinesPage.searchContainer.getSearchInput().type('901{enter}');

      searchResultsPage.getRoutesResultsButton().click();

      searchResultsPage.getShowRouteOnMapButton().click();
      map.waitForLoadToComplete();

      map.zoomIn(3);

      routeStopsOverlay
        .getRouteStopListHeader('901', RouteDirectionEnum.Outbound)
        .shouldBeVisible();

      routeStopsOverlay.stopsShouldBeIncludedInRoute([
        'E2E001',
        'E2E002',
        'E2E003',
        'E2E004',
        'E2E005',
      ]);

      // Route is edited so that the second stop is not included
      mapFooter.editRoute();
      // Force click because element might be covered by some other element, like a stop circle
      routeEditor.getRouteDashedLine().click({ force: true });

      // Move the two handles so that E2E002 should not be included in the route.
      routeEditor.moveRouteEditHandle({
        handleIndex: 2,
        deltaX: -50,
        deltaY: 200,
      });
      mapModal.map.getLoader().should('exist');
      mapModal.map.getLoader().should('not.exist');

      routeEditor.moveRouteEditHandle({
        handleIndex: 3,
        deltaX: -50,
        deltaY: 200,
        position: 'topRight',
      });
      mapModal.map.getLoader().should('exist');
      mapModal.map.getLoader().should('not.exist');

      mapFooter.save();

      routeEditor.checkRouteSubmitSuccessToast();

      routeStopsOverlay
        .getRouteStopListHeader('901', RouteDirectionEnum.Outbound)
        .shouldBeVisible();

      routeStopsOverlay.stopsShouldBeIncludedInRoute([
        'E2E001',
        'E2E003',
        'E2E004',
        'E2E005',
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

      mapFooter.getCreateRouteButton().click();
      mapModal.routePropertiesForm.fillRouteProperties({
        finnishName: 'Template route',
        label: '902',
        line: '901',
        direction: RouteDirectionEnum.Outbound,
        origin: {
          finnishName: 'Template origin FIN',
          finnishShortName: 'Template origin FIN shortName',
          swedishName: 'Template origin SWE',
          swedishShortName: 'Template origin SWE shortName',
        },
        destination: {
          finnishName: 'Template destination FIN',
          finnishShortName: 'Template destination FIN shortName',
          swedishName: 'Template destination SWE',
          swedishShortName: 'Template destination SWE shortName',
        },
      });

      mapModal.routePropertiesForm.getUseTemplateRouteButton().click();
      mapModal.routePropertiesForm.templateRouteSelector.fillForm({
        label: '901',
      });

      mapModal.routePropertiesForm.changeValidityForm.setPriority(
        Priority.Standard,
      );

      mapModal.routePropertiesForm.changeValidityForm.setStartDate(
        '2022-08-11',
      );
      mapModal.routePropertiesForm.changeValidityForm.setEndDate('2032-08-11');
      mapModal.editRouteModal.save();
      mapModal.map.getLoader().should('exist');
      mapModal.map.getLoader().should('not.exist');

      // Force click because element might be covered by some other element, like a stop circle
      // TODO: Research the force click. Im not sure if the reason above is the actual reason.
      routeEditor.getRouteDashedLine().click({ force: true });

      // Move the two handles so that E2E002 should not be included in the route.
      routeEditor.moveRouteEditHandle({
        handleIndex: 2,
        deltaX: -50,
        deltaY: 200,
      });
      mapModal.map.getLoader().should('exist');
      mapModal.map.getLoader().should('not.exist');

      routeEditor.moveRouteEditHandle({
        handleIndex: 3,
        deltaX: -50,
        deltaY: 200,
      });
      mapModal.map.getLoader().should('exist');
      mapModal.map.getLoader().should('not.exist');

      mapFooter.save();

      routeEditor.gqlRouteShouldBeCreatedSuccessfully();

      routeEditor.checkRouteSubmitSuccessToast();

      routeStopsOverlay
        .getRouteStopListHeader('902', RouteDirectionEnum.Outbound)
        .shouldBeVisible();

      // Verify that the edited route shape excludes the second stop
      // and that the stop count is correct
      routeStopsOverlay.assertRouteStopCount(4);
      routeStopsOverlay.stopsShouldBeIncludedInRoute([
        'E2E001',
        'E2E003',
        'E2E004',
        'E2E005',
      ]);
      routeStopsOverlay.stopsShouldNotBeIncludedInRoute(['E2E002']);
    },
  );
});
