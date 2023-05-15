import {
  GetInfrastructureLinksByExternalIdsResult,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  Priority,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteInsertInput,
  StopInsertInput,
  buildLine,
  buildRoute,
  buildStop,
  buildStopsInJourneyPattern,
  extractInfrastructureLinkIdsFromResponse,
  mapToGetInfrastructureLinksByExternalIdsQuery,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import { ModalMap, RouteEditor } from '../pageObjects';
import { FilterPanel } from '../pageObjects/FilterPanel';
import { RouteStopsOverlay } from '../pageObjects/RouteStopsOverlay';
import { UUID } from '../types';
import {
  SupportedResources,
  insertToDbHelper,
  removeFromDbHelper,
} from '../utils';
import { deleteRoutesByLabel } from './utils';

const testRouteLabels = {
  label1: 'T-reitti 1',
  label2: 'T-reitti 2',
  label3: 'T-reitti 3',
  label4: 'Indefinite end time route',
  label5: 'Template route',
};

// These infralink IDs exist in the 'infraLinks.sql' test data file.
// These form a straight line on Eerikinkatu in Helsinki.
// Coordinates are partial since they are needed only for the stop creation.

const testInfraLinks = [
  {
    externalId: '445156',
    coordinates: [24.926699622176628, 60.164181083308065, 10.0969999999943],
  },
  {
    externalId: '442424',
    coordinates: [24.92904198486008, 60.16490775039894, 0],
  },
  {
    externalId: '442325',
    coordinates: [24.932072417514647, 60.166003223527824, 0],
  },
];

const stopLabels = ['Test stop 1', 'Test stop 2', 'Test stop 3'];

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

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    validity_start: DateTime.fromISO('2020-03-20T22:00:00+00:00'),
    scheduled_stop_point_id: '3f23a4c5-f527-4395-bd9f-bbc398f837df',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[0].coordinates,
    },
  },
  {
    ...buildStop({
      label: stopLabels[1],
      located_on_infrastructure_link_id: infrastructureLinkIds[1],
    }),
    validity_start: DateTime.fromISO('2020-03-20T22:00:00+00:00'),
    scheduled_stop_point_id: '431a6791-f1f5-45d4-8c9d-9e154a2531e0',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[1].coordinates,
    },
  },
  {
    ...buildStop({
      label: stopLabels[2],
      located_on_infrastructure_link_id: infrastructureLinkIds[2],
    }),
    validity_start: DateTime.fromISO('2020-03-20T22:00:00+00:00'),
    scheduled_stop_point_id: '6c09b8d9-5952-4ee3-92b9-a7b4847517d3',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: testRouteLabels.label1 }),
    route_id: '7961d12f-26cc-4e0f-b6a7-845bc334df63',
    on_line_id: lines[0].line_id,
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2032-08-11T13:08:43.315+03:00'),
  },
];

const buildInfraLinksAlongRoute = (
  infrastructureLinkIds: UUID[],
): InfraLinkAlongRouteInsertInput[] => [
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[0],
    infrastructure_link_sequence: 0,
    is_traversal_forwards: false,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[1],
    infrastructure_link_sequence: 1,
    is_traversal_forwards: false,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[2],
    infrastructure_link_sequence: 2,
    is_traversal_forwards: false,
  },
];

const journeyPatterns: JourneyPatternInsertInput[] = [
  {
    journey_pattern_id: '6cae356b-20f4-4e04-a969-097999b351f0',
    on_route_id: routes[0].route_id,
  },
];

const stopsInJourneyPattern = buildStopsInJourneyPattern(
  stopLabels,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  journeyPatterns[0].journey_pattern_id!,
);

const stopTestIds = {
  testStop1: `Map::Stops::stopMarker::${stopLabels[0]}_Standard`,
  testStop2: `Map::Stops::stopMarker::${stopLabels[1]}_Standard`,
  testStop3: `Map::Stops::stopMarker::${stopLabels[2]}_Standard`,
};

describe('Route creation', () => {
  let modalMap: ModalMap;
  let routeStopsOverlay: RouteStopsOverlay;
  let routeEditor: RouteEditor;
  const baseDbResources = {
    lines,
    routes,
    journeyPatterns,
    stopsInJourneyPattern,
  };
  let dbResources: SupportedResources;

  before(() => {
    cy.task<GetInfrastructureLinksByExternalIdsResult>(
      'hasuraAPI',
      mapToGetInfrastructureLinksByExternalIdsQuery(
        testInfraLinks.map((infralink) => infralink.externalId),
      ),
    ).then((res) => {
      const infraLinkIds = extractInfrastructureLinkIdsFromResponse(res);

      const stops = buildStopsOnInfrastrucureLinks(infraLinkIds);
      const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);
      dbResources = {
        ...baseDbResources,
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  beforeEach(() => {
    modalMap = new ModalMap();
    const mapFilterPanel = new FilterPanel();

    deleteRoutesByLabel(Object.values(testRouteLabels));
    removeFromDbHelper(dbResources);

    insertToDbHelper(dbResources);

    routeStopsOverlay = new RouteStopsOverlay();
    routeEditor = new RouteEditor();
    cy.setupTests();
    cy.mockLogin();

    // Location where all test stops and routes are visible.
    const mapLocation = { lng: 24.929689228090112, lat: 60.16495016651525 };

    modalMap.map.visit({
      zoom: 15,
      lat: mapLocation.lat,
      lng: mapLocation.lng,
    });

    mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    modalMap.map.waitForLoadToComplete();
  });

  afterEach(() => {
    deleteRoutesByLabel(Object.values(testRouteLabels));
    removeFromDbHelper(dbResources);
  });

  it(
    'Should create a new route',
    {
      tags: [Tag.Smoke, Tag.Routes, Tag.Network],
      scrollBehavior: 'bottom',
    },
    () => {
      const routeName = 'Testireitti 1';

      modalMap.createRoute({
        routeFormInfo: {
          finnishName: routeName,
          label: testRouteLabels.label1,
          variant: '56',
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

      routeEditor.checkRouteSubmitSuccessToast();

      routeStopsOverlay.routeShouldBeSelected(routeName);
    },
  );

  it(
    'Should create a new route and leave out one stop',
    { tags: [Tag.Map, Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      const routeName = 'Testireitti 2';
      const omittedStopsLabels = [stopLabels[1]];
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

      routeEditor.checkRouteSubmitSuccessToast();

      routeStopsOverlay.routeShouldBeSelected(routeName);

      routeStopsOverlay.stopsShouldNotBeIncludedInRoute(omittedStopsLabels);
    },
  );

  it(
    'Should not let the user create a route with only one stop',
    { tags: [Tag.Map, Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      const routeName = 'Testireitti 3';
      const omittedStopsLabels = [stopLabels[1], stopLabels[2]];
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

      routeEditor.checkRouteSubmitFailureToast();
    },
  );

  it(
    'Should create new route with an indefinite validity end date',
    { tags: [Tag.Map, Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
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

      routeEditor.checkRouteSubmitSuccessToast();

      routeStopsOverlay.routeShouldBeSelected(routeName);
    },
  );

  it(
    'Should create a new route using an existing route as a template',
    { tags: [Tag.Map, Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      modalMap.createRoute({
        routeFormInfo: {
          finnishName: 'Reitin pohjalta luotu reitti',
          label: testRouteLabels.label5,
          direction: RouteDirectionEnum.Outbound,
          line: String(lines[0].label),
          templateRoute: {
            templateRouteSelectorInfo: {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              priority: routes[0].priority!,
              label: routes[0].label,
            },
          },
          validityStartISODate: String(routes[0].validity_start),
          validityEndISODate: String(routes[0].validity_end),
          priority: Priority.Standard,
        },
      });

      routeEditor.gqlRouteShouldBeCreatedSuccessfully();

      routeEditor.checkRouteSubmitSuccessToast();

      routeStopsOverlay.routeShouldBeSelected(testRouteLabels.label5);

      // Verify that the stops from the template route are included in the new route
      // and that the stop count is correct
      routeStopsOverlay.stopsShouldBeIncludedInRoute(stopLabels);
      routeStopsOverlay.assertRouteStopCount(3);
    },
  );
});
