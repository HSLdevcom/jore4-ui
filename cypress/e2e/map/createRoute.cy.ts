import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { Tag } from '../../enums';
import { MapFooter, MapModal, Toast } from '../../pageObjects';
import { FilterPanel } from '../../pageObjects/FilterPanel';
import { RouteStopsOverlay } from '../../pageObjects/RouteStopsOverlay';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { mapViewport } from '../utils';

describe('Route creation', mapViewport, () => {
  let mapModal: MapModal;
  let routeStopsOverlay: RouteStopsOverlay;
  let mapFooter: MapFooter;
  let filterPanel: FilterPanel;
  let toast: Toast;
  let dbResources: SupportedResources;

  const baseDbResources = getClonedBaseDbResources();
  // Location where all test stops and routes are visible.
  const mapLocation = {
    lng: 24.929689228090112,
    lat: 60.16495016651525,
    zoom: 15,
  };

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

    mapModal = new MapModal();

    insertToDbHelper(dbResources);

    routeStopsOverlay = new RouteStopsOverlay();
    mapFooter = new MapFooter();
    filterPanel = new FilterPanel();
    toast = new Toast();
    cy.setupTests();
    cy.mockLogin();
  });

  it(
    'Should create a new route',
    {
      tags: [Tag.Smoke, Tag.Routes, Tag.Network],
      scrollBehavior: 'bottom',
    },
    () => {
      mapModal.map.visit(mapLocation);

      filterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);
      mapModal.map.waitForLoadToComplete();

      mapFooter.getCreateRouteButton().click();
      mapModal.routePropertiesForm.fillRouteProperties({
        finnishName: 'Test route',
        label: '901Y',
        variant: '56',
        line: '901',
        direction: RouteDirectionEnum.Outbound,
        origin: {
          finnishName: 'Test origin FIN',
          finnishShortName: 'Test origin FIN shortName',
          swedishName: 'Test origin SWE',
          swedishShortName: 'Test origin SWE shortName',
        },
        destination: {
          finnishName: 'Test destination FIN',
          finnishShortName: 'Test destination FIN shortName',
          swedishName: 'Test destination SWE',
          swedishShortName: 'Test destination SWE shortName',
        },
        priority: Priority.Standard,
        validityStartISODate: '2022-01-01',
        validityEndISODate: '2025-12-01',
      });

      mapModal.editRouteModal.save();

      // Create a geometry for route that includes dataset stops E2E001,
      // (exclude E2E002) E2E003, E2E004 and E2E005
      mapModal.map.clickAtPosition(1395, 488);
      mapModal.map.clickAtPosition(1362, 462);
      mapModal.map.clickAtPosition(1240, 477);
      mapModal.map.clickAtPosition(1179, 452);
      mapModal.map.clickAtPosition(1080, 516);
      mapModal.map.clickAtPosition(1095, 592);
      mapModal.map.clickAtPosition(991, 657);
      // Click the last added node again to finish the route
      mapModal.map.clickAtPosition(991, 657);

      mapModal.map.getLoader().should('exist');
      mapModal.map.getLoader().should('not.exist');

      mapFooter.save();
      toast.expectSuccessToast('Reitti tallennettu');

      // Check from routeStopsOverlay that everything is correct
      routeStopsOverlay
        .getHeader()
        .should('contain', '901Y 56')
        .and('contain', 'Test route');
      routeStopsOverlay
        .getRouteStopListHeader('901Y', RouteDirectionEnum.Outbound)
        .shouldBeVisible();
      routeStopsOverlay.getRouteStopsOverlayRows().should('have.length', 4);
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(0)
        .shouldHaveText('E2E001 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(1)
        .shouldHaveText('E2E003 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(2)
        .shouldHaveText('E2E004 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(3)
        .shouldHaveText('E2E005 -');
    },
  );

  it(
    'Should create a new route and leave out one stop',
    { tags: [Tag.Map, Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      const { routeStopsOverlayRow } = routeStopsOverlay;
      mapModal.map.visit(mapLocation);

      filterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);
      mapModal.map.waitForLoadToComplete();

      mapFooter.getCreateRouteButton().click();
      mapModal.routePropertiesForm.fillRouteProperties({
        finnishName: 'Test route',
        label: '901X',
        line: '901',
        direction: RouteDirectionEnum.Outbound,
        origin: {
          finnishName: 'Test origin FIN',
          finnishShortName: 'Test origin FIN shortName',
          swedishName: 'Test origin SWE',
          swedishShortName: 'Test origin SWE shortName',
        },
        destination: {
          finnishName: 'Test destination FIN',
          finnishShortName: 'Test destination FIN shortName',
          swedishName: 'Test destination SWE',
          swedishShortName: 'Test destination SWE shortName',
        },
        priority: Priority.Standard,
        validityStartISODate: '2022-01-01',
        validityEndISODate: '2025-12-01',
      });

      mapModal.editRouteModal.save();

      // Create a geometry for route that includes dataset stops E2E001 - E2E004
      mapModal.map.clickAtPosition(1395, 488);
      mapModal.map.clickAtPosition(1290, 369);
      mapModal.map.clickAtPosition(1097, 575);
      // Click the last added node again to finish the route
      mapModal.map.clickAtPosition(1097, 575);

      routeStopsOverlay.getRouteStopsOverlayRows().should('have.length', 4);
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(0)
        .shouldHaveText('E2E001 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(1)
        .shouldHaveText('E2E002 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(2)
        .shouldHaveText('E2E003 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(3)
        .shouldHaveText('E2E004 -');

      // Remove one stop from the journey pattern
      routeStopsOverlay.getNthRouteStopsOverlayRow(2).within(() => {
        routeStopsOverlayRow.getMenuButton().click();
        routeStopsOverlayRow
          .getToggleStopInJourneyPatternButton()
          .contains('Poista reitin käytöstä')
          .click();
      });

      mapFooter.save();
      toast.expectSuccessToast('Reitti tallennettu');

      routeStopsOverlay
        .getHeader()
        .should('contain', '901X')
        .and('contain', 'Test route');
      routeStopsOverlay.getRouteStopsOverlayRows().should('have.length', 3);
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(0)
        .shouldHaveText('E2E001 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(1)
        .shouldHaveText('E2E002 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(2)
        .shouldHaveText('E2E004 -');
    },
  );

  it(
    'Should not let the user create a route with only one stop',
    { tags: [Tag.Map, Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      const { routeStopsOverlayRow } = routeStopsOverlay;
      mapModal.map.visit(mapLocation);

      filterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);
      mapModal.map.waitForLoadToComplete();

      mapFooter.getCreateRouteButton().click();
      mapModal.routePropertiesForm.fillRouteProperties({
        finnishName: 'Erronous route',
        label: '901F',
        line: '901',
        direction: RouteDirectionEnum.Outbound,
        origin: {
          finnishName: 'Test origin FIN',
          finnishShortName: 'Test origin FIN shortName',
          swedishName: 'Test origin SWE',
          swedishShortName: 'Test origin SWE shortName',
        },
        destination: {
          finnishName: 'Test destination FIN',
          finnishShortName: 'Test destination FIN shortName',
          swedishName: 'Test destination SWE',
          swedishShortName: 'Test destination SWE shortName',
        },
        priority: Priority.Standard,
        validityStartISODate: '2022-01-01',
        validityEndISODate: '2025-12-01',
      });

      mapModal.editRouteModal.save();

      // Create a geometry for route that includes dataset stops E2E001 and E2E002
      mapModal.map.clickAtPosition(1395, 488);
      mapModal.map.clickAtPosition(1290, 369);
      // Click the last added node again to finish the route
      mapModal.map.clickAtPosition(1290, 369);

      routeStopsOverlay.getRouteStopsOverlayRows().should('have.length', 2);
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(0)
        .shouldHaveText('E2E001 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(1)
        .shouldHaveText('E2E002 -');

      // Remove the other stop from the journey pattern
      routeStopsOverlay.getNthRouteStopsOverlayRow(1).within(() => {
        routeStopsOverlayRow.getMenuButton().click();
        routeStopsOverlayRow
          .getToggleStopInJourneyPatternButton()
          .contains('Poista reitin käytöstä')
          .click();
      });

      mapFooter.save();
      toast.expectDangerToast(
        'Tallennus epäonnistui: Reitillä on oltava ainakin kaksi pysäkkiä.',
      );
    },
  );

  it(
    'Should create new route with an indefinite validity end date',
    { tags: [Tag.Map, Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      mapModal.map.visit(mapLocation);

      filterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);
      mapModal.map.waitForLoadToComplete();

      mapFooter.getCreateRouteButton().click();
      mapModal.routePropertiesForm.fillRouteProperties({
        finnishName: 'Indefinite end time route',
        label: '901I',
        line: '901',
        direction: RouteDirectionEnum.Outbound,
        origin: {
          finnishName: 'Test origin FIN',
          finnishShortName: 'Test origin FIN shortName',
          swedishName: 'Test origin SWE',
          swedishShortName: 'Test origin SWE shortName',
        },
        destination: {
          finnishName: 'Test destination FIN',
          finnishShortName: 'Test destination FIN shortName',
          swedishName: 'Test destination SWE',
          swedishShortName: 'Test destination SWE shortName',
        },
        priority: Priority.Standard,
        validityStartISODate: '2022-01-01',
        validityEndISODate: undefined, // == indefinite
      });

      mapModal.editRouteModal.save();

      // Create a geometry for route that includes dataset stops E2E001
      // and E2E002
      mapModal.map.clickAtPosition(1395, 488);
      mapModal.map.clickAtPosition(1290, 369);
      // Click the last added node again to finish the route
      mapModal.map.clickAtPosition(1290, 369);

      mapModal.map.getLoader().should('exist');
      mapModal.map.getLoader().should('not.exist');

      mapFooter.save();
      toast.expectSuccessToast('Reitti tallennettu');
    },
  );

  it(
    'Should create a new route using an existing route as a template',
    { tags: [Tag.Map, Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      mapModal.map.visit(mapLocation);

      filterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);
      mapModal.map.waitForLoadToComplete();

      mapFooter.getCreateRouteButton().click();
      mapModal.routePropertiesForm.fillRouteProperties({
        finnishName: 'Based on template test route',
        label: '901T',
        line: '901',
        direction: RouteDirectionEnum.Outbound,
        origin: {
          finnishName: 'Test origin FIN',
          finnishShortName: 'Test origin FIN shortName',
          swedishName: 'Test origin SWE',
          swedishShortName: 'Test origin SWE shortName',
        },
        destination: {
          finnishName: 'Test destination FIN',
          finnishShortName: 'Test destination FIN shortName',
          swedishName: 'Test destination SWE',
          swedishShortName: 'Test destination SWE shortName',
        },
        priority: Priority.Standard,
        validityStartISODate: '2022-01-01',
        validityEndISODate: '2025-12-01',
      });

      // Use standard route 901 from dataset as template
      mapModal.routePropertiesForm.getUseTemplateRouteButton().click();
      mapModal.routePropertiesForm.templateRouteSelector.fillForm({
        priority: Priority.Standard,
        label: '901',
      });

      mapModal.editRouteModal.save();

      mapModal.map.getLoader().should('exist');
      mapModal.map.getLoader().should('not.exist');

      mapFooter.save();

      routeStopsOverlay
        .getHeader()
        .should('contain', '901T')
        .and('contain', 'Based on template test route');
      routeStopsOverlay.getRouteStopsOverlayRows().should('have.length', 5);
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(0)
        .shouldHaveText('E2E001 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(1)
        .shouldHaveText('E2E002 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(2)
        .shouldHaveText('E2E003 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(3)
        .shouldHaveText('E2E004 -');
      routeStopsOverlay
        .getNthRouteStopsOverlayRow(4)
        .shouldHaveText('E2E005 -');
    },
  );
});
