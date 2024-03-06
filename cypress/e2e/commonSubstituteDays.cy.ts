import {
  GetInfrastructureLinksByExternalIdsResult,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
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
  TimetablesMainPage,
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
    ...buildLine({ label: '123' }),
    line_id: 'feddf51d-d65f-4ee0-a3d7-f8fe0d912a55',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService, // Peruslinja
  },
];

const timingPlaces = [
  buildTimingPlace('644e0887-b71d-470f-af2b-016e0b90f1b3', '1AACKT'),
  buildTimingPlace('31f37ab7-187d-434e-8b5f-cafbb9ca2494', '1AURLA'),
];

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    scheduled_stop_point_id: '568bb49c-d019-49d5-b117-3cf967d5e73f',
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
    scheduled_stop_point_id: '359da508-e6a0-4474-bc96-3ab52c3453b0',
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
    scheduled_stop_point_id: '39c6e166-c521-42d6-b54c-16c07d26a25e',
    timing_place_id: timingPlaces[1].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '1232' }),
    route_id: 'e0e25b5a-4746-4276-85d7-fe174251a9ea',
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
    journey_pattern_id: '450d2bc2-20b8-48bd-a66c-aeb4f77a8657',
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

const timetableDataInput = {
  _journey_pattern_refs: {
    route1232inbound: {
      route_label: '1232',
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
    year2024: {
      validity_start: DateTime.fromISO('2024-01-01'),
      validity_end: DateTime.fromISO('2024-12-31'),
      name: '2024',
      booking_label: '2024 booking label',
      _vehicle_services: {
        saturday: {
          day_type_id: defaultDayTypeIds.SATURDAY,
          _blocks: {
            block: {
              _vehicle_journeys: {
                route1232Inbound1: {
                  _journey_pattern_ref_name: 'route1232inbound',
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
                route1232Inbound2: {
                  _journey_pattern_ref_name: 'route1232inbound',
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
        thursday: {
          day_type_id: defaultDayTypeIds.THURSDAY,
          _blocks: {
            block: {
              _vehicle_journeys: {
                route1232Inbound1: {
                  _journey_pattern_ref_name: 'route1232inbound',
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
                route1232Inbound2: {
                  _journey_pattern_ref_name: 'route1232inbound',
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
                route1232Inbound3: {
                  _journey_pattern_ref_name: 'route1232inbound',
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

describe('Common substitute operating periods', () => {
  let substituteDaySettingsPage: SubstituteDaySettingsPage;
  let vehicleScheduleDetailsPage: VehicleScheduleDetailsPage;
  let timetablesMainPage: TimetablesMainPage;
  let toast: Toast;

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
    cy.task('insertHslTimetablesDatasetToDb', timetableDataInput);

    substituteDaySettingsPage = new SubstituteDaySettingsPage();
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();
    timetablesMainPage = new TimetablesMainPage();
    toast = new Toast();

    cy.setupTests();
    cy.mockLogin();
    cy.visit('/timetables/settings');
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');
  });

  it(
    'Should create and delete a common substitute operating period successfully',
    { tags: [Tag.Timetables, Tag.Smoke] },
    () => {
      const route1231InboundTimetableSection = new RouteTimetablesSection(
        '1232',
        'inbound',
      );

      const route1231InboundThursdayVehicleServiceTable =
        new VehicleServiceTable(route1231InboundTimetableSection, 'TO');

      const route1231InboundSaturdayVehicleServiceTable =
        new VehicleServiceTable(route1231InboundTimetableSection, 'LA');

      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2024-01-01',
        '2024-12-31',
      );

      // Add a common substitute day
      substituteDaySettingsPage.commonSubstitutePeriodForm.editCommonSubstitutePeriod(
        {
          periodName: 'Tapaninpäivä 2024',
          substituteDay: 'Lauantai',
          lineTypes: ['Peruslinja'],
        },
      );
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .click();
      toast.checkSuccessToastHasMessage('Tallennus onnistui');

      // Navigate to the vehicleSchedule page
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .should('be.disabled');
      substituteDaySettingsPage.close();
      cy.getByTestId('SearchContainer::searchInput').type('123{enter}');
      cy.getByTestId('RouteLineTableRow::row::123').click();

      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2024-12-26',
      );
      vehicleScheduleDetailsPage.getShowAllValidSwitch().click();

      // Check that the Boxing day schedule is the same as the Saturday schedule
      route1231InboundThursdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getValidityTimeRange()
        .should('contain', '26.12.2024 - 26.12.2024');
      route1231InboundThursdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getTripCount()
        .and('contain', '2 lähtöä');
      route1231InboundThursdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getTripTimeRange()
        .should('contain', '07:05 ... 08:20');

      route1231InboundSaturdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getValidityTimeRange()
        .should('contain', '1.1.2024 - 31.12.2024');
      route1231InboundSaturdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getTripCount()
        .should('contain', '2 lähtöä');
      route1231InboundSaturdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getTripTimeRange()
        .should('contain', '07:05 ... 08:20');

      // Navigate back to timetable settings
      cy.getByTestId('NavLinks::timetables.timetables').click();
      timetablesMainPage.openSettings();

      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2024-01-01',
        '2024-12-31',
      );

      cy.getByTestId(
        'CommonSubstitutePeriodForm::loadingCommonSubstitutePeriods',
      ).should('not.exist');

      substituteDaySettingsPage.commonSubstitutePeriodForm.removeCommonSubstitutePeriod(
        'Tapaninpäivä 2024',
      );

      toast.checkSuccessToastHasMessage('Tallennus onnistui');

      // And navigate again to the vehicle schedules
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .should('be.disabled');
      substituteDaySettingsPage.close();
      cy.getByTestId('SearchContainer::searchInput').type('123{enter}');
      cy.getByTestId('RouteLineTableRow::row::123').click();

      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2024-12-26',
      );

      // Check that the Boxing day schedule and Sunday timetables are not the same
      route1231InboundThursdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getValidityTimeRange()
        .should('contain', '1.1.2024 - 31.12.2024');
      route1231InboundThursdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getTripCount()
        .and('contain', '3 lähtöä');
      route1231InboundThursdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getTripTimeRange()
        .should('contain', '11:05 ... 13:05');
      route1231InboundSaturdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getValidityTimeRange()
        .should('contain', '1.1.2024 - 31.12.2024');
      route1231InboundSaturdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getTripCount()
        .should('contain', '2 lähtöä');
      route1231InboundSaturdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getTripTimeRange()
        .should('contain', '07:05 ... 08:20');
    },
  );

  it(
    "Should create and delete a 'No traffic' common substitute operating period successfully",
    { tags: [Tag.Timetables, Tag.Smoke] },
    () => {
      const route1231InboundTimetableSection = new RouteTimetablesSection(
        '1232',
        'inbound',
      );

      const route1231InboundThursdayVehicleServiceTable =
        new VehicleServiceTable(route1231InboundTimetableSection, 'TO');

      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2024-01-01',
        '2024-12-31',
      );

      // Add a common substitute day
      substituteDaySettingsPage.commonSubstitutePeriodForm.editCommonSubstitutePeriod(
        {
          periodName: 'Tapaninpäivä 2024',
          substituteDay: 'Ei liikennöintiä',
          lineTypes: ['Kaikki'],
        },
      );
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .click();
      toast.checkSuccessToastHasMessage('Tallennus onnistui');

      // Navigate to the vehicleSchedule page
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .should('be.disabled');
      substituteDaySettingsPage.close();
      cy.getByTestId('SearchContainer::searchInput').type('123{enter}');
      cy.getByTestId('RouteLineTableRow::row::123').click();

      // Check that there is no trafficking on boxing day
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2024-12-26',
      );
      vehicleScheduleDetailsPage.getShowAllValidSwitch().click();

      route1231InboundThursdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getValidityTimeRange()
        .should('contain', '26.12.2024 - 26.12.2024');
      route1231InboundThursdayVehicleServiceTable
        .get()
        .should('contain', 'Ei liikennöintiä');

      // Navigate back to timetable settings
      cy.getByTestId('NavLinks::timetables.timetables').click();
      timetablesMainPage.openSettings();

      // Remove the boxing day substitute day setting
      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2024-01-01',
        '2024-12-31',
      );
      substituteDaySettingsPage.commonSubstitutePeriodForm.removeCommonSubstitutePeriod(
        'Tapaninpäivä 2024',
      );

      // And navigate again to the vehicle schedules
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .should('be.disabled');
      substituteDaySettingsPage.close();
      cy.getByTestId('SearchContainer::searchInput').type('123{enter}');
      cy.getByTestId('RouteLineTableRow::row::123').click();

      // Check that the Boxing day schedule has trafficking
      route1231InboundThursdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getValidityTimeRange()
        .should('contain', '1.1.2024 - 31.12.2024');
      route1231InboundThursdayVehicleServiceTable.vehicleJourneyGroupInfo
        .getTripCount()
        .and('contain', '3 lähtöä');
    },
  );

  describe('Overlapping dates', () => {
    beforeEach(() => {
      // Add an occasional substitute day
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getAddOccasionalSubstitutePeriodButton()
        .click();
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm(
        {
          nth: 0,
          formInfo: {
            name: 'Poikkeusjakson nimi',
            beginDate: '2024-12-26',
            beginTime: '04:30',
            endDate: '2024-12-26',
            endTime: '28:30',
            substituteDay: 'Sunnuntai',
            lineTypes: ['Peruslinja'],
          },
        },
      );
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getSaveButton()
        .click();
      toast.checkSuccessToastHasMessage('Tallennus onnistui');
    });

    it(
      'Should not let the user create a common substitute day that overlaps an occasional substitute day',
      { tags: [Tag.Timetables] },
      () => {
        substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
          '2024-01-01',
          '2024-12-31',
        );

        // Add a common substitute day
        substituteDaySettingsPage.commonSubstitutePeriodForm.editCommonSubstitutePeriod(
          {
            periodName: 'Tapaninpäivä 2024',
            substituteDay: 'Sunnuntai',
            lineTypes: ['Peruslinja'],
          },
        );

        substituteDaySettingsPage.commonSubstitutePeriodForm
          .getSaveButton()
          .click();
        substituteDaySettingsPage.toast.checkDangerToastHasMessage(
          'Tallennus epäonnistui: GraphQL errors: Exclusion violation. conflicting key ' +
            'value violates exclusion constraint "substitute_operating_day_by_line_type_no_timespan_overlap"',
        );
      },
    );
  });
});
