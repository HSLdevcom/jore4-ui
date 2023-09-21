import {
  GetInfrastructureLinksByExternalIdsResult,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  RouteDirectionEnum,
  RouteInsertInput,
  RouteTypeOfLineEnum,
  StopInJourneyPatternInsertInput,
  StopInsertInput,
  TimetablePriority,
  buildLine,
  buildRoute,
  buildStop,
  buildStopInJourneyPattern,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  mapToGetInfrastructureLinksByExternalIdsQuery,
} from '@hsl/jore4-test-db-manager';
import { defaultDayTypeIds } from '@hsl/timetables-data-inserter';
import { DateTime, Duration } from 'luxon';
import { Tag } from '../enums';
import {
  Navbar,
  PassingTimesByStopSection,
  RouteTimetablesSection,
  VehicleScheduleDetailsPage,
  VehicleServiceTable,
} from '../pageObjects';
import { UUID } from '../types';
import {
  SupportedResources,
  insertToDbHelper,
  removeFromDbHelper,
} from '../utils';

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

const stopLabels = ['H1234', 'H1235', 'H1236'];

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '1234' }),
    line_id: 'f148d51b-36ff-4321-8cf1-049946f75f73',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
  },
];

const timingPlaces = [
  buildTimingPlace('50623e7b-abd0-4c9a-85fa-f88ff7f65a06', '1AACKT'),
  buildTimingPlace('31a2592e-0af1-48b7-8f2f-373dcca39ddd', '1AURLA'),
];

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    scheduled_stop_point_id: 'd9f0bc78-45f2-4d44-9cac-4674f856a400',
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
    scheduled_stop_point_id: '63bd05f9-de46-4fa3-bdd9-10e9a81702e3',
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
    scheduled_stop_point_id: 'f732ceb2-fc41-4843-8164-ead6ec7dd33b',
    timing_place_id: timingPlaces[1].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '99' }),
    route_id: '829e9d55-aa25-4ab9-858b-f2a5aa81d931',
    on_line_id: lines[0].line_id,
    validity_start: DateTime.fromISO('2023-01-01T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2043-06-30T13:08:43.315+03:00'),
    direction: RouteDirectionEnum.Inbound,
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
    journey_pattern_id: '72ff8c33-33aa-4169-803e-53f2426a4508',
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

describe('Timetable import and export', () => {
  let vehicleScheduleDetailsPage: VehicleScheduleDetailsPage;
  let navbar: Navbar;

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
        timingPlaces,
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  beforeEach(() => {
    cy.task('truncateTimetablesDatabase');
    removeFromDbHelper(dbResources);
    insertToDbHelper(dbResources);
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();
    navbar = new Navbar();

    cy.setupMapTiles();
    cy.mockLogin();
    cy.visit('/');
    navbar.getTimetablesLink().click();

    const input = {
      _journey_pattern_refs: {
        route99inbound: {
          journey_pattern_id: journeyPatterns[0].journey_pattern_id,
          _stop_points: [
            {
              scheduled_stop_point_sequence: 1,
              scheduled_stop_point_label: 'H1234',
            },
            {
              scheduled_stop_point_sequence: 2,
              scheduled_stop_point_label: 'H1235',
            },
            {
              scheduled_stop_point_sequence: 3,
              scheduled_stop_point_label: 'H1236',
            },
          ],
        },
      },
      _vehicle_schedule_frames: {
        winter2022: {
          validity_start: DateTime.fromISO('2022-07-01'),
          validity_end: DateTime.fromISO('2023-05-31'),
          name: 'Talvi 2022',
          booking_label: 'Winter booking label',
          _vehicle_services: {
            monFri: {
              day_type_id: defaultDayTypeIds.SATURDAY,
              _blocks: {
                block: {
                  _vehicle_journeys: {
                    route99Inbound1: {
                      _journey_pattern_ref_name: 'route99inbound',
                      _passing_times: [
                        {
                          _scheduled_stop_point_label: 'H1234',
                          arrival_time: null,
                          departure_time: Duration.fromISO('PT7H05M'),
                        },
                        {
                          _scheduled_stop_point_label: 'H1235',
                          arrival_time: Duration.fromISO('PT7H12M'),
                          departure_time: Duration.fromISO('PT7H13M'),
                        },
                        {
                          _scheduled_stop_point_label: 'H1236',
                          arrival_time: Duration.fromISO('PT7H19M'),
                          departure_time: null,
                        },
                      ],
                    },
                    route99Inbound2: {
                      _journey_pattern_ref_name: 'route99inbound',
                      _passing_times: [
                        {
                          _scheduled_stop_point_label: 'H1234',
                          arrival_time: null,
                          departure_time: Duration.fromISO('PT8H20M'),
                        },
                        {
                          _scheduled_stop_point_label: 'H1235',
                          arrival_time: Duration.fromISO('PT8H22M'),
                          departure_time: Duration.fromISO('PT8H23M'),
                        },
                        {
                          _scheduled_stop_point_label: 'H1236',
                          arrival_time: Duration.fromISO('PT8H26M'),
                          departure_time: null,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    cy.task('insertHslTimetablesDatasetToDb', input);
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');
  });

  it(
    'Should show arrival times and highlight departures',
    { tags: [Tag.Timetables, Tag.HastusImport] },
    () => {
      const route99InboundTimetableSection = new RouteTimetablesSection(
        '99',
        'inbound',
      );

      const route99InboundSaturdayVehicleService = new VehicleServiceTable(
        route99InboundTimetableSection,
        'LA',
      );

      const route99InboundSaturdayPassingTimesSection =
        new PassingTimesByStopSection(
          route99InboundTimetableSection,
          'LA',
          TimetablePriority.Standard,
        );

      // Check the imported timetable on a Saturday, which is the day type of the imported timetable
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2023-04-29&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService.getHeadingButton().click();
      vehicleScheduleDetailsPage.getArrivalTimesSwitch().click();
      route99InboundSaturdayPassingTimesSection.assertNthPassingTimeOnStop({
        stopLabel: stopLabels[1],
        nthPassingTime: 0,
        hour: '7',
        arrivalTime: '12',
        departureTime: '13',
      });
      route99InboundSaturdayPassingTimesSection.clickToHighlightNthPassingTimeOnStopRow(
        stopLabels[0],
        1,
      );

      // Assert that departures in the second column are highlighted
      cy.wrap(stopLabels).each((stopLabel) => {
        return route99InboundSaturdayPassingTimesSection.assertNthPassingTimeHighlightOnStopRow(
          {
            stopLabel: String(stopLabel),
            nthPassingTime: 1,
            isHighlighted: true,
          },
        );
      });

      // Assert that departures in the first column are not highlighted
      cy.wrap(stopLabels).each((stopLabel) => {
        return route99InboundSaturdayPassingTimesSection.assertNthPassingTimeHighlightOnStopRow(
          {
            stopLabel: String(stopLabel),
            nthPassingTime: 0,
            isHighlighted: false,
          },
        );
      });
    },
  );
});
