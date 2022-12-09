import {
  buildLine,
  buildRoute,
  buildStop,
  buildStopsInJourneyPattern,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  Priority,
  ReusableComponentsVehicleSubmodeEnum,
  RouteDirectionEnum,
  RouteInsertInput,
  StopInsertInput,
  VehicleSubmodeOnInfraLinkInsertInput,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import {
  Map,
  MapFooter,
  ModalMap,
  RouteEditor,
  RoutesAndLinesPage,
  SearchResultsPage,
} from '../pageObjects';
import { RouteStopsOverlay } from '../pageObjects/RouteStopsOverlay';
import { insertToDbHelper, removeFromDbHelper } from '../utils';
import { deleteRoutesByLabel } from './utils';

const testRouteLabels = {
  label1: 'T-reitti 1',
};

// These need to be deleted separately with deleteRoutesByLabel
const testCreatedRouteLabels = {
  templateRoute: 'T-reitti 2',
};

// These infralink IDs exist in the 'infraLinks.sql' test data file.
// These form a straight line on Eerikinkatu in Helsinki.
// Coordinates are partial since they are needed only for the stop creation.

const testInfraLinks = [
  {
    id: '73bc2df9-f5af-4c38-a1dd-5ed1f71c90a8',
    coordinates: [24.926699622176628, 60.164181083308065, 10.0969999999943],
  },
  {
    id: 'ea69415a-9c54-4327-8836-f38b36d8fa99',
    coordinates: [24.92904198486008, 60.16490775039894, 0],
  },
  {
    id: '13de61c2-3fc9-4255-955f-0a2350c389e1',
    coordinates: [24.932072417514647, 60.166003223527824, 0],
  },
];

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: 'Test line 1' }),
    line_id: '08d1fa6b-440c-421e-ad4d-0778d65afe60',
  },
];

const stops: StopInsertInput[] = [
  {
    ...buildStop({
      label: 'E2E001',
      located_on_infrastructure_link_id: testInfraLinks[0].id,
    }),
    scheduled_stop_point_id: 'bfa722af-4605-4792-b01a-9184c2133368',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[0].coordinates,
    },
  },
  {
    ...buildStop({
      label: 'E2E002',
      located_on_infrastructure_link_id: testInfraLinks[1].id,
    }),
    scheduled_stop_point_id: '779e9352-ae03-42f6-bd1e-2519887cdaa3',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[1].coordinates,
    },
  },
  {
    ...buildStop({
      label: 'E2E003',
      located_on_infrastructure_link_id: testInfraLinks[2].id,
    }),
    scheduled_stop_point_id: '5d25c9ef-f48e-4d10-8cbf-deec0d274d7f',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: testRouteLabels.label1 }),
    route_id: '994a7d79-4991-423b-9c1a-0ca621a6d9ed',
    on_line_id: lines[0].line_id,
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2032-08-11T13:08:43.315+03:00'),
  },
];

const infraLinksAlongRoute: InfraLinkAlongRouteInsertInput[] = [
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: testInfraLinks[0].id,
    infrastructure_link_sequence: 0,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: testInfraLinks[1].id,
    infrastructure_link_sequence: 1,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: testInfraLinks[2].id,
    infrastructure_link_sequence: 2,
    is_traversal_forwards: true,
  },
];

const vehicleSubmodeOnInfrastructureLink: VehicleSubmodeOnInfraLinkInsertInput[] =
  [
    {
      infrastructure_link_id: testInfraLinks[0].id,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: testInfraLinks[1].id,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: testInfraLinks[2].id,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
  ];

const journeyPatterns: JourneyPatternInsertInput[] = [
  {
    journey_pattern_id: '6cae356b-20f4-4e04-a969-097999b351f0',
    on_route_id: routes[0].route_id,
  },
];

const stopsInJourneyPattern = buildStopsInJourneyPattern(
  stops.map((item) => item.label),
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  journeyPatterns[0].journey_pattern_id!,
);

const dbResources = {
  vehicleSubmodeOnInfrastructureLink,
  lines,
  stops,
  routes,
  infraLinksAlongRoute,
  journeyPatterns,
  stopsInJourneyPattern,
};

const clearDatabase = () => {
  deleteRoutesByLabel(Object.values(testCreatedRouteLabels));
  removeFromDbHelper(dbResources);
};

describe('Edit route geometry', () => {
  let map: Map;
  let routeStopsOverlay: RouteStopsOverlay;
  let routeEditor: RouteEditor;
  let searchResultsPage: SearchResultsPage;
  let routesAndLinesPage: RoutesAndLinesPage;
  let modalMap: ModalMap;
  let mapFooter: MapFooter;

  before(() => {
    cy.fixture('infraLinks/infraLinks.sql').then((infraLinksQuery) => {
      cy.task('executeRawDbQuery', { query: infraLinksQuery });
    });
  });

  beforeEach(() => {
    clearDatabase();
    insertToDbHelper(dbResources);

    map = new Map();
    routeStopsOverlay = new RouteStopsOverlay();
    routeEditor = new RouteEditor();
    searchResultsPage = new SearchResultsPage();
    routesAndLinesPage = new RoutesAndLinesPage();
    modalMap = new ModalMap();
    mapFooter = new MapFooter();

    cy.setupTests();
    cy.mockLogin();
  });

  afterEach(() => {
    clearDatabase();
  });

  it("Should edit a route's shape", { scrollBehavior: 'bottom' }, () => {
    cy.visit('/routes');
    routesAndLinesPage
      .getRoutesAndLinesSearchInput()
      .type(`${routes[0].label}{enter}`);

    searchResultsPage.getRoutesResultsButton().click();

    searchResultsPage.getShowRouteOnMapButton().click();

    map.waitForLoadToComplete();

    map.zoomIn(2);

    routeStopsOverlay.routeShouldBeSelected(routes[0].label);

    routeStopsOverlay.stopsShouldBeIncludedInRoute(
      stops.map((item) => item.label),
    );

    // Route is edited so that the second stop is not included
    routeEditor.editOneRoutePoint({
      handleIndex: 2,
      deltaX: 10,
      deltaY: -90,
    });

    mapFooter.save();

    routeEditor.checkRouteSubmitSuccessToast();

    routeStopsOverlay.routeShouldBeSelected(routes[0].label);

    routeStopsOverlay.stopsShouldNotBeIncludedInRoute([stops[1].label]);
  });

  it(
    'Should edit route shape correctly when creating new route with template',
    { scrollBehavior: 'bottom' },
    () => {
      // Location where all test stops and routes are visible.
      const mapLocation = { lng: 24.929689228090112, lat: 60.16495016651525 };

      map.visit({
        zoom: 16,
        lat: mapLocation.lat,
        lng: mapLocation.lng,
      });

      modalMap.createRoute({
        routeFormInfo: {
          finnishName: 'Reitin pohjalta luotu reitti',
          label: testCreatedRouteLabels.templateRoute,
          direction: RouteDirectionEnum.Outbound,
          line: String(lines[0].label),
          templateRoute: {
            templateRouteSelectorInfo: {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              priority: routes[0].priority!,
              label: routes[0].label,
            },
            // Route is edited so that the second stop is not included
            moveRouteEditHandleInfo: {
              handleIndex: 2,
              deltaX: 10,
              deltaY: -170,
            },
          },
          validityStartISODate: String(routes[0].validity_start),
          validityEndISODate: String(routes[0].validity_end),
          priority: Priority.Standard,
        },
      });

      routeEditor.gqlRouteShouldBeCreatedSuccessfully();

      routeEditor.checkRouteSubmitSuccessToast();

      routeStopsOverlay.routeShouldBeSelected(
        testCreatedRouteLabels.templateRoute,
      );

      routeStopsOverlay.stopsShouldBeIncludedInRoute([
        stops[0].label,
        stops[2].label,
      ]);

      routeStopsOverlay.stopsShouldNotBeIncludedInRoute([stops[1].label]);
    },
  );
});
