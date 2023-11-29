import {
  GetInfrastructureLinksByExternalIdsResult,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  Priority,
  RouteDirectionEnum,
  RouteInsertInput,
  RouteTypeOfLineEnum,
  StopInJourneyPatternInsertInput,
  StopInsertInput,
  buildLine,
  buildRoute,
  buildStop,
  buildStopInJourneyPattern,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  mapToGetInfrastructureLinksByExternalIdsQuery,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import {
  Map,
  MapFooter,
  MapModal,
  RouteEditor,
  RoutesAndLinesPage,
  SearchResultsPage,
} from '../pageObjects';
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
};

// These need to be deleted separately with deleteRoutesByLabel
const testCreatedRouteLabels = {
  templateRoute: 'T-reitti 2',
};

// These infralink IDs exist in the 'infraLinks.sql' test data file.
// These form a straight line on Eerikinkatu in Helsinki.
// Coordinates are partial since they are needed only for the stop creation.

const timingPlaces = [
  buildTimingPlace('f7fd2b8c-380b-48da-b87c-78bfa1690aa3', '1AACKT'),
  buildTimingPlace('3faa5ec1-aa5c-423e-9064-1523c460299e', '1AURLA'),
];

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

const stopLabels = ['E2E001', 'E2E002', 'E2E003'];

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: 'Test line 1' }),
    line_id: '08d1fa6b-440c-421e-ad4d-0778d65afe60',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
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
    scheduled_stop_point_id: 'bfa722af-4605-4792-b01a-9184c2133368',
    timing_place_id: timingPlaces[0].timing_place_id,
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
    scheduled_stop_point_id: '779e9352-ae03-42f6-bd1e-2519887cdaa3',
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
    scheduled_stop_point_id: '5d25c9ef-f48e-4d10-8cbf-deec0d274d7f',
    timing_place_id: timingPlaces[1].timing_place_id,
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

const buildInfraLinksAlongRoute = (
  infrastructureLinkIds: UUID[],
): InfraLinkAlongRouteInsertInput[] => [
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[0],
    infrastructure_link_sequence: 0,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[1],
    infrastructure_link_sequence: 1,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[2],
    infrastructure_link_sequence: 2,
    is_traversal_forwards: true,
  },
];

const journeyPatterns: JourneyPatternInsertInput[] = [
  {
    journey_pattern_id: '6cae356b-20f4-4e04-a969-097999b351f0',
    on_route_id: routes[0].route_id,
  },
];

const stopsInJourneyPattern: StopInJourneyPatternInsertInput[] = [
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: stopLabels[0],
    scheduledStopPointSequence: 0,
    isUsedAsTimingPoint: true,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: stopLabels[1],
    scheduledStopPointSequence: 1,
    isUsedAsTimingPoint: false,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: stopLabels[2],
    scheduledStopPointSequence: 2,
    isUsedAsTimingPoint: true,
  }),
];

describe('Edit route geometry', () => {
  let map: Map;
  let routeStopsOverlay: RouteStopsOverlay;
  let routeEditor: RouteEditor;
  let searchResultsPage: SearchResultsPage;
  let routesAndLinesPage: RoutesAndLinesPage;
  let mapModal: MapModal;
  let mapFooter: MapFooter;

  const baseDbResources = {
    lines,
    routes,
    timingPlaces,
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
    deleteRoutesByLabel(Object.values(testCreatedRouteLabels));
    removeFromDbHelper(dbResources);

    insertToDbHelper(dbResources);

    map = new Map();
    routeStopsOverlay = new RouteStopsOverlay();
    routeEditor = new RouteEditor();
    searchResultsPage = new SearchResultsPage();
    routesAndLinesPage = new RoutesAndLinesPage();
    mapModal = new MapModal();
    mapFooter = new MapFooter();

    cy.setupMapTiles();
    cy.mockLogin();
  });

  afterEach(() => {
    deleteRoutesByLabel(Object.values(testCreatedRouteLabels));
    removeFromDbHelper(dbResources);
  });

  it(
    "Should edit a route's shape",
    { tags: [Tag.Routes, Tag.Network], scrollBehavior: 'bottom' },
    () => {
      cy.visit('/routes');
      routesAndLinesPage.searchContainer
        .getSearchInput()
        .type(`${routes[0].label}{enter}`);

      searchResultsPage.getRoutesResultsButton().click();

      searchResultsPage.getShowRouteOnMapButton().click();

      map.waitForLoadToComplete();

      map.zoomIn(2);

      routeStopsOverlay.routeShouldBeSelected(routes[0].label);

      routeStopsOverlay.stopsShouldBeIncludedInRoute(stopLabels);

      // Route is edited so that the second stop is not included
      routeEditor.editOneRoutePoint({
        handleIndex: 2,
        deltaX: 10,
        deltaY: -90,
      });

      mapFooter.save();

      routeEditor.checkRouteSubmitSuccessToast();

      routeStopsOverlay.routeShouldBeSelected(routes[0].label);

      routeStopsOverlay.stopsShouldNotBeIncludedInRoute([stopLabels[1]]);
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

      mapModal.createRoute({
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

      // Verify that the edited route shape excludes the second stop
      // and that the stop count is correct
      routeStopsOverlay.assertRouteStopCount(2);
      routeStopsOverlay.stopsShouldBeIncludedInRoute([
        stopLabels[0],
        stopLabels[2],
      ]);
      routeStopsOverlay.stopsShouldNotBeIncludedInRoute([stopLabels[1]]);
    },
  );
});
