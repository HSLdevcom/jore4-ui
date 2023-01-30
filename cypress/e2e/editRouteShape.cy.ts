import {
  buildLine,
  buildRoute,
  buildStop,
  buildStopsInJourneyPattern,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  ReusableComponentsVehicleSubmodeEnum,
  RouteInsertInput,
  StopInsertInput,
  VehicleSubmodeOnInfraLinkInsertInput,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import {
  Map,
  MoveRouteEditHandleInfo,
  RouteEditor,
  RoutesAndLinesPage,
  SearchResultsPage,
} from '../pageObjects';
import { RouteStopsOverlay } from '../pageObjects/RouteStopsOverlay';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const testRouteLabels = {
  label1: 'T-reitti 1',
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
    ...buildLine({ label: 'Test line' }),
    line_id: '6f1f458a-f6ad-40dd-8866-44e1e4795554',
  },
];

const stops: StopInsertInput[] = [
  {
    ...buildStop({
      label: 'E2E001',
      located_on_infrastructure_link_id: testInfraLinks[0].id,
    }),
    scheduled_stop_point_id: '019ce3bf-cdcd-42ff-9a1d-363108d4c640',
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
    scheduled_stop_point_id: 'b59285c8-a2ee-49dc-ad36-313232947d8a',
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
    scheduled_stop_point_id: 'f2299595-7f95-4b1e-b7aa-4f6f26fc4bc5',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: testRouteLabels.label1 }),
    route_id: '4bde1fd7-9bea-44cc-8ac8-3ff82c204d41',
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
    journey_pattern_id: 'fc99398a-2d6b-47f9-b141-b9050809053c',
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
  removeFromDbHelper(dbResources);
};

describe('Edit route geometry', () => {
  let map: Map;
  let routeStopsOverlay: RouteStopsOverlay;
  let routeEditor: RouteEditor;
  let searchResultsPage: SearchResultsPage;
  let routesAndLinesPage: RoutesAndLinesPage;

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

    cy.setupTests();
    cy.mockLogin();
    cy.visit('/routes');
  });

  afterEach(() => {
    clearDatabase();
  });

  // Skip this test until CI is stable
  it("Should edit a route's shape", { scrollBehavior: 'bottom' }, () => {
    const moveHandleInfo: MoveRouteEditHandleInfo = {
      handleIndex: 2,
      deltaX: 10,
      deltaY: -90,
    };

    routesAndLinesPage
      .getRoutesAndLinesSearchInput()
      .type(`${routes[0].label}{enter}`);

    searchResultsPage.getRoutesResultsButton().click();

    searchResultsPage.getShowRouteOnMapButton().click();

    map.getLoader().should('not.exist');

    map.zoomIn(2);

    routeStopsOverlay.routeShouldBeSelected(routes[0].label);

    routeStopsOverlay.stopsShouldBeIncludedInRoute(
      stops.map((item) => item.label),
    );

    routeEditor.editOneRoutePoint(moveHandleInfo);

    routeEditor.checkRouteSubmitSuccessToast();

    routeStopsOverlay.routeShouldBeSelected(routes[0].label);

    routeStopsOverlay.stopsShouldNotBeIncludedInRoute([stops[1].label]);
  });
});
