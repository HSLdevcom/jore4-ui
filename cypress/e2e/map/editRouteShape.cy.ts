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
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import {
  Map,
  MapFooter,
  MapPage,
  RouteEditor,
  RouteStopsOverlay,
  RouteStopsOverlayRow,
  RoutesAndLinesPage,
  SearchResultsPage,
  StopDetailsPage,
  ValidityPeriodForm,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds } from '../utils';

describe('Edit route geometry', { tags: [Tag.Routes, Tag.Map] }, () => {
  let dbResources: SupportedResources;

  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getClonedBaseStopRegistryData();

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
    cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
      ...baseStopRegistryData,
    });

    cy.setupTests();
    cy.mockLogin();
  });

  it('Should have functional "Open details page" menu item on stop list', () => {
    cy.visit('/routes');

    cy.section('Open route on map', () => {
      RoutesAndLinesPage.searchContainer.getSearchInput().type('901{enter}');
      SearchResultsPage.getRoutesResultsButton().click();
      SearchResultsPage.getShowRouteOnMapButton().click();
      RouteStopsOverlay.getRouteStopListHeader(
        '901',
        RouteDirectionEnum.Outbound,
      ).shouldBeVisible();
    });

    cy.section(
      'Should open the details page in the same tab, when not editing',
      () => {
        RouteStopsOverlay.getNthRouteStopsOverlayRow(0).within(() =>
          RouteStopsOverlayRow.getMenuButton().click(),
        );
        RouteStopsOverlayRow.getOpenDetailsPageLink().click();
        StopDetailsPage.page().shouldBeVisible();
        StopDetailsPage.titleRow.label().shouldHaveText('E2E001');
      },
    );

    cy.section(
      'Should go back to the route on the map, on back navigation',
      () => {
        cy.go(-1);
        RouteStopsOverlay.getRouteStopListHeader(
          '901',
          RouteDirectionEnum.Outbound,
        ).shouldBeVisible();
      },
    );

    cy.section('Start editing the route', () => {
      MapFooter.editRoute();
      MapPage.map.getLoader().should('exist');
      MapPage.map.getLoader().should('not.exist');
    });

    cy.section('Should now open the stop details onto a new tab', () => {
      // Replace window.open with a stub
      cy.window().then((win) => cy.stub(win, 'open'));

      RouteStopsOverlay.getNthRouteStopsOverlayRow(0).within(() => {
        RouteStopsOverlayRow.getMenuButton().click();
      });
      RouteStopsOverlayRow.getOpenDetailsPageLink()
        .click()
        .then(() => {
          cy.window().its('open').should('be.called');
        });

      // Assert we are still on the map
      RouteStopsOverlay.getRouteStopListHeader(
        '901',
        RouteDirectionEnum.Outbound,
      ).shouldBeVisible();
    });
  });

  it(
    "Should edit a route's shape",
    { tags: [Tag.Smoke, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      cy.visit('/routes');
      RoutesAndLinesPage.searchContainer.getSearchInput().type('901{enter}');

      SearchResultsPage.getRoutesResultsButton().click();

      SearchResultsPage.getShowRouteOnMapButton().click();

      Map.zoomIn(3);

      RouteStopsOverlay.getRouteStopListHeader(
        '901',
        RouteDirectionEnum.Outbound,
      ).shouldBeVisible();

      RouteStopsOverlay.stopsShouldBeIncludedInRoute([
        'E2E001',
        'E2E002',
        'E2E003',
        'E2E004',
        'E2E005',
      ]);

      MapFooter.editRoute();
      MapPage.map.getLoader().should('exist');
      MapPage.map.getLoader().should('not.exist');

      MapPage.map.moveRouteEditorHandleByCoordinates({
        start: { longitude: 24.93737988831691, latitude: 60.16655610103186 },
        destination: {
          longitude: 24.935474587220085,
          latitude: 60.16555861384899,
        },
      });

      MapPage.map.getLoader().should('exist');
      MapPage.map.getLoader().should('not.exist');

      MapPage.map.moveRouteEditorHandleByCoordinates({
        start: { longitude: 24.935684070587428, latitude: 60.16653128828523 },
        destination: {
          longitude: 24.93470648154286,
          latitude: 60.16602014153341,
        },
      });

      MapPage.map.getLoader().should('exist');
      MapPage.map.getLoader().should('not.exist');

      MapFooter.save();

      RouteEditor.checkRouteSubmitSuccessToast();

      RouteStopsOverlay.getRouteStopListHeader(
        '901',
        RouteDirectionEnum.Outbound,
      ).shouldBeVisible();

      RouteStopsOverlay.stopsShouldBeIncludedInRoute([
        'E2E001',
        'E2E003',
        'E2E004',
        'E2E005',
      ]);
      RouteStopsOverlay.stopsShouldNotBeIncludedInRoute(['E2E002']);
    },
  );

  it(
    'Should edit route shape correctly when creating new route with template',
    { tags: Tag.Network, scrollBehavior: 'bottom' },
    () => {
      // Location where all test stops and routes are visible.
      const mapLocation = { lng: 24.929689228090112, lat: 60.16495016651525 };

      Map.visit({
        zoom: 16,
        lat: mapLocation.lat,
        lng: mapLocation.lng,
      });

      MapFooter.createRoute();
      MapPage.routePropertiesForm.useTemplateRoute({ label: '901' });

      MapPage.routePropertiesForm.fillRouteProperties({
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

      MapPage.routePropertiesForm.changeValidityForm.setPriority(
        Priority.Standard,
      );

      ValidityPeriodForm.setStartDate('2022-08-11');
      ValidityPeriodForm.setEndDate('2032-08-11');
      MapPage.editRouteModal.save();
      MapPage.map.getLoader().should('exist');
      MapPage.map.getLoader().should('not.exist');

      // Wait until the template route's geometry has been map-matched and the
      // stops are populated. Otherwise the first handle move can run before the
      // snapping line is ready and end up being a no-op.
      RouteStopsOverlay.stopsShouldBeIncludedInRoute([
        'E2E001',
        'E2E002',
        'E2E003',
        'E2E004',
        'E2E005',
      ]);

      // Move the two handles so that E2E002 should not be included in the route.
      MapPage.map.moveRouteEditorHandleByCoordinates({
        start: { longitude: 24.93737988831691, latitude: 60.16655610103186 },
        destination: {
          longitude: 24.935474587220085,
          latitude: 60.16555861384899,
        },
      });

      MapPage.map.getLoader().should('exist');
      MapPage.map.getLoader().should('not.exist');

      MapPage.map.moveRouteEditorHandleByCoordinates({
        start: { longitude: 24.935684070587428, latitude: 60.16653128828523 },
        destination: {
          longitude: 24.93470648154286,
          latitude: 60.16602014153341,
        },
      });

      MapPage.map.getLoader().should('exist');
      MapPage.map.getLoader().should('not.exist');

      // Wait until the unwanted stops have actually disapeared from the listing.
      RouteStopsOverlay.stopsShouldNotBeIncludedInRoute(['E2E002', 'E2E007']);
      MapFooter.save();

      RouteEditor.gqlRouteShouldBeCreatedSuccessfully();

      RouteEditor.checkRouteSubmitSuccessToast();

      RouteStopsOverlay.getRouteStopListHeader(
        '902',
        RouteDirectionEnum.Outbound,
      ).shouldBeVisible();

      // Verify that the edited route shape excludes the second stop
      // and that the stop count is correct
      RouteStopsOverlay.assertRouteStopCount(4);
      RouteStopsOverlay.stopsShouldBeIncludedInRoute([
        'E2E001',
        'E2E003',
        'E2E004',
        'E2E005',
      ]);
      RouteStopsOverlay.stopsShouldNotBeIncludedInRoute(['E2E002']);
    },
  );
});
