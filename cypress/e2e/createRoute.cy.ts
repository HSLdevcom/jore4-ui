import {
  buildLine,
  buildStop,
  LineInsertInput,
  Priority,
  ReusableComponentsVehicleModeEnum,
  ReusableComponentsVehicleSubmodeEnum,
  RouteDirectionEnum,
  StopInsertInput,
  VehicleSubmodeOnInfraLinkInsertInput,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Map, RouteEditor } from '../pageObjects';
import { FilterPanel } from '../pageObjects/FilterPanel';
import { ModalMap } from '../pageObjects/ModalMap';
import { RouteStopsOverlay } from '../pageObjects/RouteStopsOverlay';
import { insertToDbHelper, removeFromDbHelper } from '../utils';
import { deleteRoutesByLabel } from './utils';

const testRouteLabels = {
  label1: 'T-reitti 1',
  label2: 'T-reitti 2',
  label3: 'T-reitti 3',
  label4: 'Indefinite end time route',
};

// These infralink IDs exist in the 'infraLinks.sql' test data file.
// These form a straight line on Eerikinkatu in Helsinki.
// Coordinates are partial since they are needed only for the stop creation.

const testInfraLinks = {
  1: {
    id: '73bc2df9-f5af-4c38-a1dd-5ed1f71c90a8',
    coordinates: [24.92492146851626, 60.1634759878872, 0],
  },
  2: {
    id: 'ea69415a-9c54-4327-8836-f38b36d8fa99',
    coordinates: [24.92904198486008, 60.16490775039894, 0],
  },
  3: {
    id: '13de61c2-3fc9-4255-955f-0a2350c389e1',
    coordinates: [24.932072417514647, 60.166003223527824, 0],
  },
};

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '1 Test line 1' }),
    line_id: '88f8f9fe-058b-49a2-ac8d-42d13488c7fb',
  },
  {
    ...buildLine({ label: '1 Test line 2' }),
    line_id: 'c0e4e702-60b6-4b90-9313-e463814a9422',
  },
  {
    ...buildLine({ label: '1 Test line 3' }),
    line_id: '71e19f0a-6eb3-40f2-9818-fb8ea5be135e',
  },
  {
    ...buildLine({ label: '1 Line with indefinite end time' }),
    line_id: 'ecbd895b-a720-4211-849f-ca380465c838',
  },
];

const stops: StopInsertInput[] = [
  {
    ...buildStop({
      label: 'Test stop 1',
      located_on_infrastructure_link_id: testInfraLinks[1].id,
    }),
    validity_start: DateTime.fromISO('2020-03-20T22:00:00+00:00'),
    scheduled_stop_point_id: '3f23a4c5-f527-4395-bd9f-bbc398f837df',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[1].coordinates,
    },
  },
  {
    ...buildStop({
      label: 'Test stop 2',
      located_on_infrastructure_link_id: testInfraLinks[2].id,
    }),
    validity_start: DateTime.fromISO('2020-03-20T22:00:00+00:00'),
    scheduled_stop_point_id: '431a6791-f1f5-45d4-8c9d-9e154a2531e0',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
  {
    ...buildStop({
      label: 'Test stop 3',
      located_on_infrastructure_link_id: testInfraLinks[3].id,
    }),
    validity_start: DateTime.fromISO('2020-03-20T22:00:00+00:00'),
    scheduled_stop_point_id: '6c09b8d9-5952-4ee3-92b9-a7b4847517d3',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[3].coordinates,
    },
  },
];

const vehicleSubmodeOnInfrastructureLink: VehicleSubmodeOnInfraLinkInsertInput[] =
  [
    {
      infrastructure_link_id: testInfraLinks[1].id,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: testInfraLinks[2].id,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: testInfraLinks[3].id,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
  ];

const dbResources = {
  vehicleSubmodeOnInfrastructureLink,
  lines,
  stops,
};

const stopTestIds = {
  testStop1: `Map::Stops::stopMarker::${stops[0].label}_Standard`,
  testStop2: `Map::Stops::stopMarker::${stops[1].label}_Standard`,
  testStop3: `Map::Stops::stopMarker::${stops[2].label}_Standard`,
};

const clearDatabase = () => {
  deleteRoutesByLabel(Object.values(testRouteLabels));
  removeFromDbHelper(dbResources);
};

describe('Route creation', () => {
  let modalMap: ModalMap;
  let map: Map;
  let routeStopsOverlay: RouteStopsOverlay;
  let routeEditor: RouteEditor;

  before(() => {
    cy.fixture('infraLinks/infraLinks.sql').then((infraLinksQuery) => {
      cy.task('executeRawDbQuery', { query: infraLinksQuery });
    });
  });

  beforeEach(() => {
    modalMap = new ModalMap();
    const mapFilterPanel = new FilterPanel();

    clearDatabase();
    insertToDbHelper(dbResources);

    map = new Map();
    routeStopsOverlay = new RouteStopsOverlay();
    routeEditor = new RouteEditor();
    cy.setupTests();
    cy.mockLogin();

    // Location where all test stops and routes are visible.
    const mapLocation = { lng: 24.929689228090112, lat: 60.16495016651525 };

    map.visit({
      zoom: 15,
      lat: mapLocation.lat,
      lng: mapLocation.lng,
    });

    mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    map.waitForMapToLoad();
  });

  afterEach(() => {
    clearDatabase();
  });

  it(
    'Should create new route',
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      const routeName = 'Testireitti 1';

      modalMap.createRoute({
        routeFormInfo: {
          finnishName: routeName,
          label: testRouteLabels.label1,
          direction: RouteDirectionEnum.Outbound,
          line: String(lines[0].label),
          validityStartISODate: '2022-01-01',
          validityEndISODate: '2025-12-01',
          priority: Priority.Standard,
        },
        routePoints: [
          {
            rightOffset: -10,
            downOffset: 25,
            mapMarkerTestId: stopTestIds.testStop1,
          },
          {
            rightOffset: 35,
            downOffset: -20,
            mapMarkerTestId: stopTestIds.testStop3,
          },
        ],
      });

      routeEditor.gqlRouteShouldBeCreatedSuccessfully();

      routeEditor.checkRouteSubmitSuccess();

      routeStopsOverlay.routeShouldExist(routeName);
    },
  );

  it(
    'Should create a new route and leave out one stop',
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      const routeName = 'Testireitti 2';
      const omittedStopsLabels = [stops[1].label];
      modalMap.createRoute({
        routeFormInfo: {
          finnishName: routeName,
          label: testRouteLabels.label2,
          direction: RouteDirectionEnum.Inbound,
          line: String(lines[1].label),
          validityStartISODate: '2022-01-01',
          validityEndISODate: '2025-12-01',
          priority: Priority.Standard,
        },
        routePoints: [
          {
            rightOffset: -10,
            downOffset: 25,
            mapMarkerTestId: stopTestIds.testStop1,
          },
          {
            rightOffset: 35,
            downOffset: -20,
            mapMarkerTestId: stopTestIds.testStop3,
          },
        ],
        omittedStops: omittedStopsLabels,
      });

      routeEditor.gqlRouteShouldBeCreatedSuccessfully();

      routeEditor.checkRouteSubmitSuccess();

      routeStopsOverlay.routeShouldExist(routeName);

      routeStopsOverlay.stopsShouldNotBeIncludedInRoute(omittedStopsLabels);
    },
  );

  it(
    'Should not let the user create a route with only one stop',
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      const routeName = 'Testireitti 3';
      const omittedStopsLabels = [stops[1].label, stops[2].label];
      modalMap.createRoute({
        routeFormInfo: {
          finnishName: routeName,
          label: testRouteLabels.label3,
          direction: RouteDirectionEnum.Outbound,
          line: String(lines[2].label),
          validityStartISODate: '2022-01-01',
          validityEndISODate: '2025-12-01',
          priority: Priority.Standard,
        },
        routePoints: [
          {
            rightOffset: -10,
            downOffset: 25,
            mapMarkerTestId: stopTestIds.testStop1,
          },
          {
            rightOffset: 35,
            downOffset: -20,
            mapMarkerTestId: stopTestIds.testStop3,
          },
        ],
        omittedStops: omittedStopsLabels,
      });

      routeEditor.checkRouteSubmitFailure();
    },
  );

  it(
    'Should create new route with an indefinite validity end date',
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      const routeName = 'Testireitti 4';

      modalMap.createRoute({
        routeFormInfo: {
          finnishName: routeName,
          label: testRouteLabels.label4,
          direction: RouteDirectionEnum.Outbound,
          line: String(lines[3].label),
          validityStartISODate: '2022-01-01',
          priority: Priority.Standard,
        },
        routePoints: [
          {
            rightOffset: -10,
            downOffset: 30,
            mapMarkerTestId: stopTestIds.testStop1,
          },
          {
            rightOffset: 35,
            downOffset: -10,
            mapMarkerTestId: stopTestIds.testStop3,
          },
        ],
      });

      routeEditor.gqlRouteShouldBeCreatedSuccessfully();

      routeEditor.checkRouteSubmitSuccess();

      routeStopsOverlay.routeShouldExist(routeName);
    },
  );
});
