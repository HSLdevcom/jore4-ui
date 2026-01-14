import {
  Priority,
  RouteDirectionEnum,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { Tag } from '../../enums';
import {
  Map,
  MapFooter,
  MapPage,
  RouteEditor,
  RoutesAndLinesPage,
  SearchResultsPage,
} from '../../pageObjects';
import { RouteStopsOverlay } from '../../pageObjects/RouteStopsOverlay';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';

describe('Edit route geometry', () => {
  let map: Map;
  let routeStopsOverlay: RouteStopsOverlay;
  let routeEditor: RouteEditor;
  let searchResultsPage: SearchResultsPage;
  let routesAndLinesPage: RoutesAndLinesPage;
  let mapPage: MapPage;
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
    cy.task('resetDbs');
    insertToDbHelper(dbResources);

    map = new Map();
    routeStopsOverlay = new RouteStopsOverlay();
    routeEditor = new RouteEditor();
    searchResultsPage = new SearchResultsPage();
    routesAndLinesPage = new RoutesAndLinesPage();
    mapPage = new MapPage();
    mapFooter = new MapFooter();

    cy.setupTests();
    cy.mockLogin();
  });

  it(
    "Should edit a route's shape",
    { tags: [Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      cy.visit('/routes');
      routesAndLinesPage.searchContainer.getSearchInput().type('901{enter}');

      searchResultsPage.getRoutesResultsButton().click();

      searchResultsPage.getShowRouteOnMapButton().click();

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

      mapFooter.editRoute();
      mapPage.map.getLoader().should('exist');
      mapPage.map.getLoader().should('not.exist');

      mapPage.map.moveRouteEditorHandleByCoordinates({
        start: { longitude: 24.93737988831691, latitude: 60.16655610103186 },
        destination: {
          longitude: 24.935474587220085,
          latitude: 60.16555861384899,
        },
      });

      mapPage.map.getLoader().should('exist');
      mapPage.map.getLoader().should('not.exist');

      mapPage.map.moveRouteEditorHandleByCoordinates({
        start: { longitude: 24.935684070587428, latitude: 60.16653128828523 },
        destination: {
          longitude: 24.93470648154286,
          latitude: 60.16602014153341,
        },
      });

      mapPage.map.getLoader().should('exist');
      mapPage.map.getLoader().should('not.exist');

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
      mapPage.routePropertiesForm.fillRouteProperties({
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

      mapPage.routePropertiesForm
        .getUseTemplateRouteButton()
        .scrollIntoViewAndClick();
      mapPage.routePropertiesForm.templateRouteSelector.fillForm({
        label: '901',
      });

      mapPage.routePropertiesForm.changeValidityForm.setPriority(
        Priority.Standard,
      );

      mapPage.routePropertiesForm.changeValidityForm.validityPeriodForm.setStartDate(
        '2022-08-11',
      );
      mapPage.routePropertiesForm.changeValidityForm.validityPeriodForm.setEndDate(
        '2032-08-11',
      );
      mapPage.editRouteModal.save();
      mapPage.map.getLoader().should('exist');
      mapPage.map.getLoader().should('not.exist');

      // Move the two handles so that E2E002 should not be included in the route.
      mapPage.map.moveRouteEditorHandleByCoordinates({
        start: { longitude: 24.93737988831691, latitude: 60.16655610103186 },
        destination: {
          longitude: 24.935474587220085,
          latitude: 60.16555861384899,
        },
      });

      mapPage.map.getLoader().should('exist');
      mapPage.map.getLoader().should('not.exist');

      mapPage.map.moveRouteEditorHandleByCoordinates({
        start: { longitude: 24.935684070587428, latitude: 60.16653128828523 },
        destination: {
          longitude: 24.93470648154286,
          latitude: 60.16602014153341,
        },
      });

      mapPage.map.getLoader().should('exist');
      mapPage.map.getLoader().should('not.exist');

      // Wait until the unwanted stops have actually disapeared from the listing.
      routeStopsOverlay.stopsShouldNotBeIncludedInRoute(['E2E002', 'E2E007']);
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
