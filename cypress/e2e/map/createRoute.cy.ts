import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteTypeOfLineEnum,
  StopAreaInput,
  StopInsertInput,
  StopRegistryGeoJsonInput,
  StopRegistryGeoJsonType,
  StopRegistryTransportModeType,
  minimalQuayKeyValues,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  stopCoordinatesByLabel,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { Tag } from '../../enums';
import {
  LineChangeHistory,
  LineDetailsPage,
  MapFooter,
  MapPage,
  RouteStopsOverlay,
  RouteStopsOverlayRow,
  StopsNeedingUpdateModal,
  Toast,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper, mapAt } from '../../utils';
import { InsertedStopRegistryIds } from '../utils';

const baseDbResources = getClonedBaseDbResources();

function constructStopRegistryEntriesForBaseDbResourceStopPoints(
  stopPoints: ReadonlyArray<StopInsertInput> = [],
) {
  return stopPoints.map<StopAreaInput>(
    ({ label, measured_location: location }) => {
      const geometry: StopRegistryGeoJsonInput = {
        coordinates: location.coordinates.slice(0, 2),
        type: StopRegistryGeoJsonType.Point,
      };

      return {
        organisations: null,
        StopArea: {
          name: { value: label, lang: 'fin' },
          privateCode: { value: `A-${label}`, type: 'HSL/TEST' },
          geometry,
          transportMode: StopRegistryTransportModeType.Bus,
          quays: [
            {
              privateCode: { value: label, type: 'HSL/TEST' },
              publicCode: label,
              geometry,
              keyValues: minimalQuayKeyValues.slice(),
            },
          ],
        },
      };
    },
  );
}

const rootOpts: Cypress.SuiteConfigOverrides = {
  tags: [Tag.Routes, Tag.Map],
  scrollBehavior: 'bottom',
};

function expectVisibleOptionsToMatchLineIds(
  options: JQuery<HTMLElement>,
  lineIds: string[],
) {
  const visibleOptionIds = [...options]
    .map((option) => option.getAttribute('data-testid'))
    .map((testId) => testId?.split('::option::')[1]);

  expect(lineIds).to.include.members(visibleOptionIds);
}

function assertLineOptionsMatchVehicleMode(
  vehicleMode: ReusableComponentsVehicleModeEnum,
) {
  const lineIds = baseDbResources.lines
    .filter((line) => line.primary_vehicle_mode === vehicleMode)
    .map((line) => line.line_id as string);

  cy.getByTestId('RoutePropertiesFormComponent::chooseLineDropdown').click();

  cy.get('[role="option"]').should(($options) => {
    expectVisibleOptionsToMatchLineIds($options, lineIds);
  });

  cy.getByTestId('RoutePropertiesFormComponent::chooseLineDropdown').click();
}

describe('Route creation', rootOpts, () => {
  let dbResources: SupportedResources;

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
        // Change the 901 line to be a Trunk Line
        lines: mapAt(baseDbResources.lines, 0, (line) => ({
          ...line,
          type_of_line: RouteTypeOfLineEnum.ExpressBusService,
        })),
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  beforeEach(() => {
    cy.task('resetDbs');

    insertToDbHelper(dbResources);
    cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
      stopPlaces: constructStopRegistryEntriesForBaseDbResourceStopPoints(
        dbResources.stops,
      ),
    });

    cy.setupTests();
    cy.mockLogin();
  });

  it(
    'Should create a new bus route',
    {
      tags: [Tag.Smoke, Tag.Network],
    },
    () => {
      const versionComment = 'E2E create route reason';

      MapPage.map.visit(mapLocation);
      MapPage.map.waitForLoadToComplete();

      MapFooter.createRoute();
      assertLineOptionsMatchVehicleMode(ReusableComponentsVehicleModeEnum.Bus);

      MapPage.routePropertiesForm.fillRouteProperties({
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
        versionComment,
        validityStartISODate: '2025-01-01',
        validityEndISODate: '2030-12-01',
      });

      MapPage.editRouteModal.save();
      MapPage.map.getLoader().should('exist');

      // Create a geometry for route that includes dataset stops E2E001,
      // (exclude E2E002) E2E003, E2E004 and E2E005
      // Wait until loading has finished before starting to click on the map
      MapPage.map.getLoader().should('not.exist');
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E001[0],
        stopCoordinatesByLabel.E2E001[1],
      );
      MapPage.map.clickAtCoordinates(24.93559846081388, 60.16562893059165);
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E003[0],
        stopCoordinatesByLabel.E2E003[1],
      );
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E004[0],
        stopCoordinatesByLabel.E2E004[1],
      );
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E005[0],
        stopCoordinatesByLabel.E2E005[1],
      );
      // Click the last added node again to finish the route
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E005[0],
        stopCoordinatesByLabel.E2E005[1],
      );

      MapFooter.save();

      StopsNeedingUpdateModal.getModal().shouldBeVisible();
      ['E2E001', 'E2E003', 'E2E004', 'E2E005']
        .map(StopsNeedingUpdateModal.getStopLink)
        .forEach((link) => link.shouldBeVisible());
      StopsNeedingUpdateModal.getConfirmButton().click();

      MapPage.map.getLoader().should('exist');
      MapPage.map.getLoader().should('not.exist');

      Toast.expectSuccessToast('Reitti tallennettu');

      // Check from routeStopsOverlay that everything is correct
      RouteStopsOverlay.getHeader()
        .should('contain', '901Y 56')
        .and('contain', 'Test route');
      RouteStopsOverlay.getRouteStopListHeader(
        '901Y',
        RouteDirectionEnum.Outbound,
      ).shouldBeVisible();
      RouteStopsOverlay.getRouteStopsOverlayRows().should('have.length', 4);
      RouteStopsOverlay.getNthRouteStopsOverlayRow(0).shouldHaveText(
        'E2E001 E2E001',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(1).shouldHaveText(
        'E2E003 E2E003',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(2).shouldHaveText(
        'E2E004 E2E004',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(3).shouldHaveText(
        'E2E005 E2E005',
      );

      LineDetailsPage.visit(baseDbResources.lines[0].line_id);
      LineDetailsPage.getChangeHistoryLink().click();
      LineChangeHistory.changeHistoryTable.sectionHeader
        .getVersionComment()
        .should('be.visible')
        .and('contain', versionComment);
    },
  );

  it(
    'Should create a new tram route',
    {
      tags: [Tag.Network],
    },
    () => {
      const versionComment = 'E2E create tram route reason';

      MapPage.map.visit(mapLocation);
      MapPage.map.waitForLoadToComplete();

      MapFooter.createRoute(ReusableComponentsVehicleModeEnum.Tram);
      assertLineOptionsMatchVehicleMode(ReusableComponentsVehicleModeEnum.Tram);

      MapPage.routePropertiesForm.fillRouteProperties({
        finnishName: 'Test tram route',
        label: '1112Y',
        variant: '56',
        line: '8543',
        direction: RouteDirectionEnum.Outbound,
        origin: {
          finnishName: 'Test tram origin FIN',
          finnishShortName: 'Test tram origin FIN shortName',
          swedishName: 'Test tram origin SWE',
          swedishShortName: 'Test tram origin SWE shortName',
        },
        destination: {
          finnishName: 'Test tram destination FIN',
          finnishShortName: 'Test tram destination FIN shortName',
          swedishName: 'Test tram destination SWE',
          swedishShortName: 'Test tram destination SWE shortName',
        },
        priority: Priority.Standard,
        versionComment,
        validityStartISODate: '2025-01-01',
        validityEndISODate: '2030-12-01',
      });

      MapPage.editRouteModal.save();
      MapPage.map.getLoader().should('exist');
    },
  );

  it('should cancel creating a new route', () => {
    MapPage.map.visit(mapLocation);
    MapPage.map.waitForLoadToComplete();

    MapFooter.createRoute();
    MapPage.routePropertiesForm.fillRouteProperties({
      finnishName: 'Test route',
      label: '901Y',
      variant: '56',
      versionComment: 'E2E cancel create route reason',
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
      validityStartISODate: '2025-01-01',
      validityEndISODate: '2030-12-01',
    });

    MapPage.editRouteModal.save();
    MapFooter.getMapFooter().should('not.exist');

    MapFooter.cancelAddMode();
    MapFooter.getMapFooter().shouldBeVisible();
  });

  it(
    'Should create a new route and leave out one stop',
    { tags: [Tag.Network] },
    () => {
      MapPage.map.visit(mapLocation);

      MapPage.map.waitForLoadToComplete();
      MapFooter.createRoute();
      MapPage.routePropertiesForm.fillRouteProperties({
        finnishName: 'Test route',
        label: '901X',
        versionComment: 'E2E create route with removed stop reason',
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
        validityStartISODate: '2025-01-01',
        validityEndISODate: '2030-12-01',
      });

      MapPage.editRouteModal.save();
      MapPage.map.getLoader().should('exist');

      // Create a geometry for route that includes dataset stops E2E001 - E2E004
      // Wait until loading has finished before starting to click on the map
      MapPage.map.getLoader().should('not.exist');
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E001[0],
        stopCoordinatesByLabel.E2E001[1],
      );
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E002[0],
        stopCoordinatesByLabel.E2E002[1],
      );
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E004[0],
        stopCoordinatesByLabel.E2E004[1],
      );
      // Click the last added node again to finish the route
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E004[0],
        stopCoordinatesByLabel.E2E004[1],
      );

      RouteStopsOverlay.getRouteStopsOverlayRows().should('have.length', 4);
      RouteStopsOverlay.getNthRouteStopsOverlayRow(0).shouldHaveText(
        'E2E001 E2E001',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(1).shouldHaveText(
        'E2E002 E2E002',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(2).shouldHaveText(
        'E2E003 E2E003',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(3).shouldHaveText(
        'E2E004 E2E004',
      );

      // Remove one stop (E2E003) from the journey pattern
      RouteStopsOverlay.getNthRouteStopsOverlayRow(2).within(() =>
        RouteStopsOverlayRow.getMenuButton().click(),
      );
      RouteStopsOverlayRow.getToggleStopInJourneyPatternButton()
        .contains('Poista reitin käytöstä')
        .click();

      MapFooter.save();

      StopsNeedingUpdateModal.getModal().shouldBeVisible();
      ['E2E001', 'E2E002', 'E2E004']
        .map(StopsNeedingUpdateModal.getStopLink)
        .forEach((link) => link.shouldBeVisible());
      StopsNeedingUpdateModal.getStopLink('E2E003').should('not.exist');
      StopsNeedingUpdateModal.getConfirmButton().click();

      Toast.expectSuccessToast('Reitti tallennettu');

      RouteStopsOverlay.getHeader()
        .should('contain', '901X')
        .and('contain', 'Test route');
      RouteStopsOverlay.getRouteStopsOverlayRows().should('have.length', 3);
      RouteStopsOverlay.getNthRouteStopsOverlayRow(0).shouldHaveText(
        'E2E001 E2E001',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(1).shouldHaveText(
        'E2E002 E2E002',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(2).shouldHaveText(
        'E2E004 E2E004',
      );
    },
  );

  it(
    'Should not let the user create a route with only one stop',
    { tags: [Tag.Network] },
    () => {
      MapPage.map.visit(mapLocation);

      MapPage.map.waitForLoadToComplete();

      MapFooter.createRoute();
      MapPage.routePropertiesForm.fillRouteProperties({
        finnishName: 'Erronous route',
        label: '901F',
        versionComment: 'E2E invalid single-stop route reason',
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

      MapPage.editRouteModal.save();
      MapPage.map.getLoader().should('exist');

      // Create a geometry for route that includes dataset stops E2E001 and E2E002
      // Wait until loading has finished before starting to click on the map
      MapPage.map.getLoader().should('not.exist');
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E001[0],
        stopCoordinatesByLabel.E2E001[1],
      );
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E002[0],
        stopCoordinatesByLabel.E2E002[1],
      );
      // Click the last added node again to finish the route
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E002[0],
        stopCoordinatesByLabel.E2E002[1],
      );

      RouteStopsOverlay.getRouteStopsOverlayRows().should('have.length', 2);
      RouteStopsOverlay.getNthRouteStopsOverlayRow(0).shouldHaveText(
        'E2E001 E2E001',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(1).shouldHaveText(
        'E2E002 E2E002',
      );

      // Remove the other stop from the journey pattern
      RouteStopsOverlay.getNthRouteStopsOverlayRow(1).within(() =>
        RouteStopsOverlayRow.getMenuButton().click(),
      );
      RouteStopsOverlayRow.getToggleStopInJourneyPatternButton()
        .contains('Poista reitin käytöstä')
        .click();

      MapFooter.save();
      Toast.expectDangerToast(
        'Tallennus epäonnistui: Reitillä on oltava ainakin kaksi pysäkkiä.',
      );
    },
  );

  it(
    'Should create new route with an indefinite validity end date',
    { tags: [Tag.Network] },
    () => {
      MapPage.map.visit(mapLocation);

      MapPage.map.waitForLoadToComplete();

      MapFooter.createRoute();
      MapPage.routePropertiesForm.fillRouteProperties({
        finnishName: 'Indefinite end time route',
        label: '901I',
        versionComment: 'E2E indefinite route reason',
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

      MapPage.editRouteModal.save();
      MapPage.map.getLoader().should('exist');

      // Create a geometry for route that includes dataset stops E2E001
      // and E2E002
      // Wait until loading has finished before starting to click on the map
      MapPage.map.getLoader().should('not.exist');
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E001[0],
        stopCoordinatesByLabel.E2E001[1],
      );
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E002[0],
        stopCoordinatesByLabel.E2E002[1],
      );
      // Click the last added node again to finish the route
      MapPage.map.clickAtCoordinates(
        stopCoordinatesByLabel.E2E002[0],
        stopCoordinatesByLabel.E2E002[1],
      );

      MapFooter.save();

      StopsNeedingUpdateModal.getConfirmButton().click();

      MapPage.map.getLoader().should('exist');
      MapPage.map.getLoader().should('not.exist');

      Toast.expectSuccessToast('Reitti tallennettu');
    },
  );

  it(
    'Should create a new route using an existing route as a template',
    { tags: [Tag.Network] },
    () => {
      MapPage.map.visit(mapLocation);

      MapPage.map.waitForLoadToComplete();

      MapFooter.createRoute();
      MapPage.routePropertiesForm.fillRouteProperties({
        finnishName: 'Based on template test route',
        label: '901T',
        versionComment: 'E2E template route reason',
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
      MapPage.routePropertiesForm.getUseTemplateRouteButton().click();
      MapPage.routePropertiesForm.templateRouteSelector.fillForm({
        priority: Priority.Standard,
        label: '901',
      });

      MapPage.editRouteModal.save();
      MapFooter.save();

      StopsNeedingUpdateModal.getConfirmButton().click();

      MapPage.map.getLoader().should('exist');
      MapPage.map.getLoader().should('not.exist');

      RouteStopsOverlay.getHeader()
        .should('contain', '901T')
        .and('contain', 'Based on template test route');
      RouteStopsOverlay.getRouteStopsOverlayRows().should('have.length', 5);
      RouteStopsOverlay.getNthRouteStopsOverlayRow(0).shouldHaveText(
        'E2E001 E2E001',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(1).shouldHaveText(
        'E2E002 E2E002',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(2).shouldHaveText(
        'E2E003 E2E003',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(3).shouldHaveText(
        'E2E004 E2E004',
      );
      RouteStopsOverlay.getNthRouteStopsOverlayRow(4).shouldHaveText(
        'E2E005 E2E005',
      );
    },
  );
});
