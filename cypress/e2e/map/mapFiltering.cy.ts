import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  StopRegistryGeoJsonType,
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
  FilterPanel,
  KnownMapItemTypeFilters,
  Map,
  MapItemTypeFiltersOverlay,
  MapObservationDateFiltersOverlay,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds } from '../utils';

describe('Stop area details', { tags: [Tag.StopAreas] }, () => {
  const map = new Map();
  const mapFilterPanel = new FilterPanel();
  const observationDateFilters = new MapObservationDateFiltersOverlay();
  const mapItemFilters = new MapItemTypeFiltersOverlay();

  let dbResources: SupportedResources;

  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getClonedBaseStopRegistryData();

  const testStopArea = {
    StopArea: {
      geometry: {
        coordinates: [24.938927, 60.165433],
        type: StopRegistryGeoJsonType.Point,
      },
    },
  };

  before(() => {
    cy.task<UUID[]>(
      'getInfrastructureLinkIdsByExternalIds',
      testInfraLinkExternalIds,
    )
      .then((infraLinkIds) => {
        const stops = buildStopsOnInfraLinks(infraLinkIds);

        const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

        dbResources = {
          ...baseDbResources,
          stops,
          infraLinksAlongRoute,
        };
      })
      .then(() => {
        // Readonly tests, initialize the DB only once
        cy.task('resetDbs');

        insertToDbHelper(dbResources);

        cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
          ...baseStopRegistryData,
        });
      });
  });

  beforeEach(() => {
    cy.setupTests();
    cy.mockLogin();

    map.visit({
      zoom: 14,
      lat: testStopArea.StopArea.geometry.coordinates[1],
      lng: testStopArea.StopArea.geometry.coordinates[0],
    });
  });

  describe('Filter map entities', { tags: [Tag.Map] }, () => {
    function assertStopsAreVisible() {
      map
        .getStopByStopLabelAndPriority('E2E001', Priority.Standard)
        .shouldBeVisible();
      map
        .getStopByStopLabelAndPriority('E2E009', Priority.Standard)
        .shouldBeVisible();
    }

    function assertStopsAreNotOnMap() {
      map
        .getStopByStopLabelAndPriority('E2E001', Priority.Standard)
        .should('not.exist');
      map
        .getStopByStopLabelAndPriority('E2E009', Priority.Standard)
        .should('not.exist');
    }

    it('should filter stops', { tags: [Tag.Smoke] }, () => {
      // Wait for map to load
      map.waitForLoadToComplete();

      // Make sure stops are visible
      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);
      assertStopsAreVisible();

      // Set stops to be hidden
      observationDateFilters.getToggleShowFiltersButton().click();
      mapItemFilters.setFilters({ [KnownMapItemTypeFilters.Stop]: false });
      assertStopsAreNotOnMap();

      // Set stops to be shown again
      mapItemFilters.setFilters({ [KnownMapItemTypeFilters.Stop]: true });
      assertStopsAreVisible();

      // Stops should be hidden if observation date does not match
      observationDateFilters.observationDateControl.setObservationDate(
        '2000-01-01',
      );
      assertStopsAreNotOnMap();

      // But should come back if we disable observation date filtering
      // and enable future items.
      mapItemFilters.setFilters({
        [KnownMapItemTypeFilters.ShowHighestPriorityCurrentStops]: false,
        [KnownMapItemTypeFilters.ShowFutureStops]: true,
      });
      assertStopsAreVisible();

      // Should hide if future stops are not shown
      mapItemFilters.setFilters({
        [KnownMapItemTypeFilters.ShowFutureStops]: false,
      });
      assertStopsAreNotOnMap();

      // Should hide if future stops are show but standard versions are disabled
      mapItemFilters.setFilters({
        [KnownMapItemTypeFilters.ShowFutureStops]: true,
        [KnownMapItemTypeFilters.ShowStandardStops]: false,
      });
      assertStopsAreNotOnMap();
    });

    it('should filter stop areas', () => {
      // Wait for map to load
      map.waitForLoadToComplete();

      // Make sure stop area is visible
      map.getStopAreaById('X0003').shouldBeVisible();

      // Set stop areas to be hidden
      observationDateFilters.getToggleShowFiltersButton().click();
      mapItemFilters.setFilters({ [KnownMapItemTypeFilters.StopArea]: false });
      map.getStopAreaById('X0003').should('not.exist');
    });

    it('should filter terminals', () => {
      // Wait for map to load
      map.waitForLoadToComplete();

      // Hide stop areas, no effect on the tests, but they do cover up the
      // member stops. Also stops should be visible
      observationDateFilters.getToggleShowFiltersButton().click();
      mapItemFilters.setFilters({ [KnownMapItemTypeFilters.StopArea]: false });
      observationDateFilters.getToggleShowFiltersButton().click();
      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);
      map.waitForLoadToComplete();

      // Make sure terminal is visible
      map.getTerminalById('T2').shouldBeVisible();

      // All stops should also be visible
      assertStopsAreVisible();

      // But clicking the terminal infobox open, only members should be shown.
      map.getTerminalById('T2').click();
      map.waitForLoadToComplete();
      assertStopsAreNotOnMap();
      map.getMemberStop('E2E008').shouldBeVisible();
      map.getMemberStop('E2E010').shouldBeVisible();

      // Set terminals to be hidden
      observationDateFilters.getToggleShowFiltersButton().click();
      mapItemFilters.setFilters({ [KnownMapItemTypeFilters.Terminal]: false });
      map.getTerminalById('T2').should('not.exist');
    });
  });
});
