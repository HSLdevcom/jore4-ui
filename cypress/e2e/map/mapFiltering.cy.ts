import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  StopRegistryGeoJsonType,
} from '@hsl/jore4-test-db-manager';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
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

describe('Stop area details', () => {
  const map = new Map();
  const mapFilterPanel = new FilterPanel();
  const observationDateFilters = new MapObservationDateFiltersOverlay();
  const mapItemFilters = new MapItemTypeFiltersOverlay();

  let stopAreaId: string;
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
    }).then((data) => {
      stopAreaId = data.stopPlaceIdsByName.X0003;

      cy.setupTests();
      cy.mockLogin();

      map.visit({
        zoom: 14,
        lat: testStopArea.StopArea.geometry.coordinates[1],
        lng: testStopArea.StopArea.geometry.coordinates[0],
      });
    });
  });

  describe('Filter map entities', () => {
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

    it('should filter stops', () => {
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
      map.getStopAreaById(stopAreaId).shouldBeVisible();

      // Set stop areas to be hidden
      observationDateFilters.getToggleShowFiltersButton().click();
      mapItemFilters.setFilters({ [KnownMapItemTypeFilters.StopArea]: false });
      map.getStopAreaById(stopAreaId).should('not.exist');
    });
  });
});
