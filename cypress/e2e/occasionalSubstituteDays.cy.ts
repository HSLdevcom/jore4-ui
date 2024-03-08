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
  RouteTimetablesSection,
  SubstituteDaySettingsPage,
  Toast,
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
    coordinates: [24.925682785, 60.163824160000004, 7.3515],
  },
  {
    externalId: '442331',
    coordinates: [24.927565858, 60.1644843305, 9.778500000000001],
  },
  {
    externalId: '442424',
    coordinates: [24.929825718, 60.165285984, 9.957],
  },
  {
    externalId: '442325',
    coordinates: [24.93312261043133, 60.16645636069328, 13.390046659939703],
  },
];

const stopLabels = ['H1231', 'H1232', 'H1233', 'H1234'];

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '99' }),
    line_id: '08d1fa6b-440c-421e-ad4d-0778d65afe60',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
  },
];

const timingPlaces = [
  buildTimingPlace('ad07b4bd-1d38-4ed5-a0b6-451887f3deb2', '1AACKT'),
  buildTimingPlace('38e9a1d5-d92f-4379-90c6-0c748f3db9a7', '1ELIMK'),
  buildTimingPlace('19f429b5-ea6c-4747-a048-2a064d2b6d6b', '1AURLA'),
];

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    scheduled_stop_point_id: '52dfb94f-d37f-47d2-ae28-a06f2208fe13',
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
    scheduled_stop_point_id: 'c6bac741-4c95-4d78-afa4-f43928ae3ff4',
    timing_place_id: null,
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
    scheduled_stop_point_id: '7f0cee71-d847-42e3-9bff-f68207634d59',
    timing_place_id: timingPlaces[1].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
  {
    ...buildStop({
      label: stopLabels[3],
      located_on_infrastructure_link_id: infrastructureLinkIds[3],
    }),
    scheduled_stop_point_id: 'a4580ffd-6f58-49fc-a4ae-9d6f7cdfedc4',
    timing_place_id: timingPlaces[2].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[3].coordinates,
    },
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '99' }),
    route_id: 'a87d68ff-4e72-4a25-b8db-67606a72a962',
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
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[3],
    infrastructure_link_sequence: 3,
    is_traversal_forwards: true,
  },
];

const journeyPatterns: JourneyPatternInsertInput[] = [
  {
    journey_pattern_id: 'c9167102-8815-419e-92e3-2d249000bae5',
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
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: stopLabels[3],
    scheduledStopPointSequence: 3,
    isUsedAsTimingPoint: true,
  }),
];

const timetableDataInput = {
  _journey_pattern_refs: {
    route99inbound: {
      route_label: '99',
      route_direction: 'inbound',
      journey_pattern_id: journeyPatterns[0].journey_pattern_id,
      _stop_points: [
        {
          scheduled_stop_point_sequence: 1,
          scheduled_stop_point_label: 'H1231',
        },
        {
          scheduled_stop_point_sequence: 2,
          scheduled_stop_point_label: 'H1232',
        },
        {
          scheduled_stop_point_sequence: 3,
          scheduled_stop_point_label: 'H1233',
        },
        {
          scheduled_stop_point_sequence: 4,
          scheduled_stop_point_label: 'H1234',
        },
      ],
    },
  },
  _vehicle_schedule_frames: {
    spring2023: {
      validity_start: DateTime.fromISO('2025-01-01'),
      validity_end: DateTime.fromISO('2025-12-31'),
      name: 'Kevät 2025',
      booking_label: 'Spring booking label',
      _vehicle_services: {
        saturday: {
          day_type_id: defaultDayTypeIds.SATURDAY,
          _blocks: {
            block: {
              _vehicle_journeys: {
                route99Inbound1: {
                  _journey_pattern_ref_name: 'route99inbound',
                  _passing_times: [
                    {
                      _scheduled_stop_point_label: 'H1231',
                      arrival_time: null,
                      departure_time: Duration.fromISO('PT7H05M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1232',
                      arrival_time: Duration.fromISO('PT7H12M'),
                      departure_time: Duration.fromISO('PT7H13M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1233',
                      arrival_time: Duration.fromISO('PT7H19M'),
                      departure_time: Duration.fromISO('PT7H23M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1234',
                      arrival_time: Duration.fromISO('PT7H27M'),
                      departure_time: null,
                    },
                  ],
                },
                route99Inbound2: {
                  _journey_pattern_ref_name: 'route99inbound',
                  _passing_times: [
                    {
                      _scheduled_stop_point_label: 'H1231',
                      arrival_time: null,
                      departure_time: Duration.fromISO('PT8H20M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1232',
                      arrival_time: Duration.fromISO('PT8H22M'),
                      departure_time: Duration.fromISO('PT8H23M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1233',
                      arrival_time: Duration.fromISO('PT8H26M'),
                      departure_time: Duration.fromISO('PT8H27M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1234',
                      arrival_time: Duration.fromISO('PT8H29M'),
                      departure_time: null,
                    },
                  ],
                },
              },
            },
          },
        },
        sunday: {
          day_type_id: defaultDayTypeIds.SUNDAY,
          _blocks: {
            block: {
              _vehicle_journeys: {
                route99Inbound1: {
                  _journey_pattern_ref_name: 'route99inbound',
                  _passing_times: [
                    {
                      _scheduled_stop_point_label: 'H1231',
                      arrival_time: null,
                      departure_time: Duration.fromISO('PT11H05M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1232',
                      arrival_time: Duration.fromISO('PT11H12M'),
                      departure_time: Duration.fromISO('PT11H13M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1233',
                      arrival_time: Duration.fromISO('PT11H19M'),
                      departure_time: Duration.fromISO('PT11H23M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1234',
                      arrival_time: Duration.fromISO('PT11H27M'),
                      departure_time: null,
                    },
                  ],
                },
                route99Inbound2: {
                  _journey_pattern_ref_name: 'route99inbound',
                  _passing_times: [
                    {
                      _scheduled_stop_point_label: 'H1231',
                      arrival_time: null,
                      departure_time: Duration.fromISO('PT12H20M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1232',
                      arrival_time: Duration.fromISO('PT12H22M'),
                      departure_time: Duration.fromISO('PT12H23M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1233',
                      arrival_time: Duration.fromISO('PT12H26M'),
                      departure_time: Duration.fromISO('PT12H27M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1234',
                      arrival_time: Duration.fromISO('PT12H29M'),
                      departure_time: null,
                    },
                  ],
                },
                route99Inbound3: {
                  _journey_pattern_ref_name: 'route99inbound',
                  _passing_times: [
                    {
                      _scheduled_stop_point_label: 'H1231',
                      arrival_time: null,
                      departure_time: Duration.fromISO('PT13H05M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1232',
                      arrival_time: Duration.fromISO('PT13H12M'),
                      departure_time: Duration.fromISO('PT13H13M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1233',
                      arrival_time: Duration.fromISO('PT13H19M'),
                      departure_time: Duration.fromISO('PT13H23M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1234',
                      arrival_time: Duration.fromISO('PT13H27M'),
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

const route99InboundTimetableSection = new RouteTimetablesSection(
  '99',
  'inbound',
);

const route99InboundSaturdayVehicleService = new VehicleServiceTable(
  route99InboundTimetableSection,
  'LA',
);

const route99InboundSundayVehicleService = new VehicleServiceTable(
  route99InboundTimetableSection,
  'SU',
);

describe('Occasional substitute operating periods', () => {
  let substituteDaySettingsPage: SubstituteDaySettingsPage;
  let toast: Toast;
  let vehicleScheduleDetailsPage: VehicleScheduleDetailsPage;

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
    removeFromDbHelper(dbResources);
    insertToDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');

    substituteDaySettingsPage = new SubstituteDaySettingsPage();
    toast = new Toast();
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();

    cy.setupTests();
    cy.mockLogin();

    cy.task('insertHslTimetablesDatasetToDb', timetableDataInput);

    cy.visit('/timetables/settings');
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');
  });

  it(
    'Should create and delete an occasional substitute operating period successfully',
    { tags: [Tag.Timetables, Tag.Smoke] },
    () => {
      // Set observation period so that the saved ocasional substitute day will
      // not be in the range of this period
      substituteDaySettingsPage.observationPeriodForm.setStartDate(
        '2023-01-01',
      );
      substituteDaySettingsPage.observationPeriodForm.setEndDate('2023-12-31');
      // Add an occasional substitute day
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getAddOccasionalSubstitutePeriodButton()
        .click();
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm(
        {
          nth: 0,
          formInfo: {
            name: 'Poikkeusjakson nimi',
            beginDate: '2025-03-08',
            beginTime: '04:30',
            endDate: '2025-03-08',
            endTime: '28:30',
            substituteDay: 'Sunnuntai',
            lineTypes: ['Peruslinja'],
          },
        },
      );
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getSaveButton()
        .click();
      cy.wait('@gqlCreateSubstituteOperatingPeriod')
        .its('response.statusCode')
        .should('equal', 200);
      toast.checkWarningToastHasMessage('Suodatusjaksoa muutettu');

      // Check that the Saturday schedule is the same as the Sunday schedule
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2025-03-08&routeLabels=${routes[0].label}`,
      );
      vehicleScheduleDetailsPage.getShowAllValidSwitch().click();
      route99InboundSaturdayVehicleService
        .get()
        .should('contain', '8.3.2025 - 8.3.2025')
        .and('contain', '3 lähtöä')
        .and('contain', '11:05 ... 13:05');
      route99InboundSundayVehicleService
        .get()
        .should('contain', '1.1.2025 - 31.12.2025')
        .and('contain', '3 lähtöä')
        .and('contain', '11:05 ... 13:05');

      // Remove the substitute day
      cy.visit('/timetables/settings');
      substituteDaySettingsPage.observationPeriodForm.setStartDate(
        '2025-03-08',
      );
      substituteDaySettingsPage.observationPeriodForm.setEndDate('2025-03-08');
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.deleteNthOccasionalSubstituteDay(
        0,
      );
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getSaveButton()
        .click();

      // Check that the Saturday schedule is not the same as the Sunday schedule
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2025-03-08&routeLabels=${routes[0].label}`,
      );
      vehicleScheduleDetailsPage.getShowAllValidSwitch().click();
      route99InboundSaturdayVehicleService
        .get()
        .should('contain', '1.1.2025 - 31.12.2025')
        .and('contain', '2 lähtöä')
        .and('contain', '07:05 ... 08:20');
      route99InboundSundayVehicleService
        .get()
        .should('contain', '1.1.2025 - 31.12.2025')
        .and('contain', '3 lähtöä')
        .and('contain', '11:05 ... 13:05');
    },
  );

  it(
    "Should create a 'No traffic' day successfully",
    { tags: [Tag.Timetables] },
    () => {
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getAddOccasionalSubstitutePeriodButton()
        .click();
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm(
        {
          nth: 0,
          formInfo: {
            name: 'Ei liikennöintiä -päivä',
            beginDate: '2025-01-18',
            beginTime: '04:30',
            endDate: '2025-01-18',
            endTime: '28:30',
            substituteDay: 'Ei liikennöintiä',
            lineTypes: ['Peruslinja'],
          },
        },
      );
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getSaveButton()
        .click();
      cy.wait('@gqlCreateSubstituteOperatingPeriod')
        .its('response.statusCode')
        .should('equal', 200);

      // Check the timetable on the date when there should be no operation
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2025-01-18&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService
        .get()
        .should('contain', 'Ei liikennöintiä');
      // Check that next Saturday's timetable remains unaffected
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2025-01-25&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService
        .get()
        .should('contain', '1.1.2025 - 31.12.2025')
        .and('contain', '2 lähtöä')
        .and('contain', '07:05 ... 08:20');
    },
  );

  it(
    'Should create a substitute period based on a partial day successfully',
    { tags: [Tag.Timetables] },
    () => {
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getAddOccasionalSubstitutePeriodButton()
        .click();
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm(
        {
          nth: 0,
          formInfo: {
            name: 'nimi',
            beginDate: '2025-03-15',
            beginTime: '12:00',
            endDate: '2025-03-15',
            endTime: '13:00',
            substituteDay: 'Sunnuntai',
            lineTypes: ['Peruslinja'],
          },
        },
      );
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getSaveButton()
        .click();
      cy.wait('@gqlCreateSubstituteOperatingPeriod')
        .its('response.statusCode')
        .should('equal', 200);

      // Check that the setting was applied to the selected date
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2025-03-15&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService
        .get()
        .should('contain', '15.3.2025 - 15.3.2025')
        .and('contain', '1 lähtöä')
        .and('contain', '12:20 ... 12:20');
      // Check that next Saturday's timetable remains unaffected
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2025-03-22&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService
        .get()
        .should('contain', '1.1.2025 - 31.12.2025')
        .and('contain', '2 lähtöä')
        .and('contain', '07:05 ... 08:20');
    },
  );

  // TODO: 'Should not let the user create an occasional reference day that overlaps a static reference day'
});
