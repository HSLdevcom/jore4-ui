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
import {
  ChangeTimetablesValidityForm,
  TimetableVersionDetailsPanel,
  TimetableVersionsPage,
  Toast,
  VehicleServiceRow,
} from '../pageObjects';
import { UUID } from '../types';
import {
  SupportedResources,
  insertToDbHelper,
  removeFromDbHelper,
} from '../utils';

// TODO: Extract the basedata somewhere, so that it can be used in multiple tests. No need
// to copy paste 400+ lines in front of every test.

// TODO: Also after extracting base data, expand the data so that we have different labeled routes
// in the dataset and add asserts to the tests for those details

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
    line_id: 'f148d51b-36ff-4321-8cf1-049946f75f73',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
  },
];

const timingPlaces = [
  buildTimingPlace('50623e7b-abd0-4c9a-85fa-f88ff7f65a06', '1AACKT'),
  buildTimingPlace('f8a93c6f-5ef7-4b09-ae5e-0a04ea8597e9', '1ELIMK'),
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
  {
    ...buildStop({
      label: stopLabels[3],
      located_on_infrastructure_link_id: infrastructureLinkIds[3],
    }),
    scheduled_stop_point_id: '322a32cc-7a50-402b-9c01-5dc6a6b39af6',
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
    route_id: '829e9d55-aa25-4ab9-858b-f2a5aa81d931',
    on_line_id: lines[0].line_id,
    validity_start: DateTime.fromISO('2023-01-01T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2043-06-30T13:08:43.315+03:00'),
    direction: RouteDirectionEnum.Inbound,
  },
  {
    ...buildRoute({ label: '99' }),
    route_id: '06577560-4535-46ec-8240-0b989b0fed87',
    on_line_id: lines[0].line_id,
    validity_start: DateTime.fromISO('2023-01-01T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2043-06-30T13:08:43.315+03:00'),
    direction: RouteDirectionEnum.Outbound,
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
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[3],
    infrastructure_link_sequence: 0,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[2],
    infrastructure_link_sequence: 1,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[1],
    infrastructure_link_sequence: 2,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[0],
    infrastructure_link_sequence: 3,
    is_traversal_forwards: true,
  },
];

const journeyPatterns: JourneyPatternInsertInput[] = [
  {
    journey_pattern_id: '72ff8c33-33aa-4169-803e-53f2426a4508',
    on_route_id: routes[0].route_id,
  },
  {
    journey_pattern_id: '45217fb9-f95f-4193-8597-fb285e859d04',
    on_route_id: routes[1].route_id,
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

const stopInAnotherJourneyPattern: StopInJourneyPatternInsertInput[] = [
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[1].journey_pattern_id,
    stopLabel: stopLabels[3],
    scheduledStopPointSequence: 0,
    isUsedAsTimingPoint: true,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[1].journey_pattern_id,
    stopLabel: stopLabels[2],
    scheduledStopPointSequence: 1,
    isUsedAsTimingPoint: true,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[1].journey_pattern_id,
    stopLabel: stopLabels[1],
    scheduledStopPointSequence: 2,
    isUsedAsTimingPoint: false,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[1].journey_pattern_id,
    stopLabel: stopLabels[0],
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
          timing_place_label: '1AACKT',
        },
        {
          scheduled_stop_point_sequence: 2,
          scheduled_stop_point_label: 'H1232',
        },
        {
          scheduled_stop_point_sequence: 3,
          scheduled_stop_point_label: 'H1233',
          timing_place_label: '1ELIMK',
        },
        {
          scheduled_stop_point_sequence: 4,
          scheduled_stop_point_label: 'H1234',
          timing_place_label: '1AURLA',
        },
      ],
    },
    route99outbound: {
      route_label: '99',
      route_direction: 'outbound',
      journey_pattern_id: journeyPatterns[1].journey_pattern_id,
      _stop_points: [
        {
          scheduled_stop_point_sequence: 1,
          scheduled_stop_point_label: 'H1234',
          timing_place_label: '1AURLA',
        },
        {
          scheduled_stop_point_sequence: 2,
          scheduled_stop_point_label: 'H1233',
          timing_place_label: '1ELIMK',
        },
        {
          scheduled_stop_point_sequence: 3,
          scheduled_stop_point_label: 'H1232',
        },
        {
          scheduled_stop_point_sequence: 4,
          scheduled_stop_point_label: 'H1231',
          timing_place_label: '1AACKT',
        },
      ],
    },
  },
  _vehicle_schedule_frames: {
    year2023: {
      validity_start: DateTime.fromISO('2023-01-01'),
      validity_end: DateTime.fromISO('2023-12-31'),
      name: '2023',
      booking_label: '2023 booking label',
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
                      departure_time: Duration.fromISO('PT7H12M'),
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
                      departure_time: Duration.fromISO('PT8H22M'),
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
                route99Inbound3: {
                  _journey_pattern_ref_name: 'route99inbound',
                  _passing_times: [
                    {
                      _scheduled_stop_point_label: 'H1231',
                      arrival_time: null,
                      departure_time: Duration.fromISO('PT8H30M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1232',
                      arrival_time: Duration.fromISO('PT8H39M'),
                      departure_time: Duration.fromISO('PT8H39M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1233',
                      arrival_time: Duration.fromISO('PT8H50M'),
                      departure_time: Duration.fromISO('PT8H50M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1234',
                      arrival_time: Duration.fromISO('PT8H59M'),
                      departure_time: null,
                    },
                  ],
                },
                route99Outbound1: {
                  _journey_pattern_ref_name: 'route99outbound',
                  _passing_times: [
                    {
                      _scheduled_stop_point_label: 'H1234',
                      arrival_time: null,
                      departure_time: Duration.fromISO('PT7H28M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1233',
                      arrival_time: Duration.fromISO('PT7H38M'),
                      departure_time: Duration.fromISO('PT7H38M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1232',
                      arrival_time: Duration.fromISO('PT8H00M'),
                      departure_time: Duration.fromISO('PT8H00M'),
                    },
                    {
                      _scheduled_stop_point_label: 'H1231',
                      arrival_time: Duration.fromISO('PT8H15M'),
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

describe('Timetable version details panel', () => {
  const baseDbResources = {
    lines,
    routes,
    journeyPatterns,
    stopsInJourneyPattern,
    stopInAnotherJourneyPattern,
  };
  let dbResources: SupportedResources;
  let timetableVersionsPage: TimetableVersionsPage;
  let timetableVersionDetailsPanel: TimetableVersionDetailsPanel;
  let changeTimetablesValidityForm: ChangeTimetablesValidityForm;
  let vehicleServiceRow: VehicleServiceRow;
  let toast: Toast;

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

    timetableVersionsPage = new TimetableVersionsPage();
    timetableVersionDetailsPanel = new TimetableVersionDetailsPanel();
    changeTimetablesValidityForm = new ChangeTimetablesValidityForm();
    vehicleServiceRow = new VehicleServiceRow();
    toast = new Toast();

    cy.setupTests();
    cy.mockLogin();
    cy.visit(
      `/timetables/lines/99/versions?startDate=2023-03-04&endDate=2024-03-04`,
    );
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');
  });

  it('Should open, have correct details, and close', () => {
    timetableVersionsPage.timetableVersionTableRow
      .getRows()
      .should('have.length', 1);

    timetableVersionsPage.timetableVersionTableRow.openNthRowVersionDetailsPanel(
      0,
    );

    timetableVersionDetailsPanel
      .getHeading()
      .should('contain', 'Aikataulu voimassa')
      .and('contain', '1.1.2023 - 31.12.2023');

    timetableVersionDetailsPanel.getRows().should('have.length', 2);

    timetableVersionDetailsPanel
      .getRows()
      .eq(0)
      .findByTestId('DirectionBadge::outbound')
      .should('be.visible');

    timetableVersionDetailsPanel.getRows().eq(0).should('contain', '99');

    timetableVersionDetailsPanel.toggleExpandNthRow(0);
    timetableVersionDetailsPanel.getRows()
      .eq(0)
      .findByTestId('VehicleServiceRow::row')
      .findByTestId('VehicleServiceRow::hour')
      .eq(0)
      .should('contain', '07');

    timetableVersionDetailsPanel
      .getRows()
      .eq(1)
      .findByTestId('DirectionBadge::inbound')
      .should('be.visible');

    timetableVersionDetailsPanel.toggleExpandNthRow(1);
    timetableVersionDetailsPanel.getRows()
      .eq(1)
      .findByTestId('VehicleServiceRow::row')
      .then((rows) => {
        // hour 07 departures
        cy.wrap(rows)
          .eq(0)
          .within(() => {
            vehicleServiceRow.getHour().should('contain', '07');
            vehicleServiceRow.getMinute().eq(0).contains('05');
          });

        // hour 08 departures
        cy.wrap(rows)
          .eq(1)
          .within(() => {
            vehicleServiceRow.getHour().should('contain', '08');
            vehicleServiceRow.getMinute().eq(0).contains('20');
            vehicleServiceRow.getMinute().eq(1).contains('30');
          });
      });

    timetableVersionDetailsPanel.close();

    timetableVersionDetailsPanel.getHeading().should('not.exist');
  });

  it('Should change the validity period and update all correct validities', () => {
    timetableVersionsPage.timetableVersionTableRow.openNthRowVersionDetailsPanel(
      0,
    );

    timetableVersionDetailsPanel
      .getHeading()
      .should('contain', 'Aikataulu voimassa')
      .and('contain', '1.1.2023 - 31.12.2023');

    timetableVersionDetailsPanel.toggleExpandNthRow(0);
    timetableVersionDetailsPanel.vehicleJourneyGroupInfo
      .getChangeValidityButton()
      .eq(0)
      .click();

    changeTimetablesValidityForm.setValidityEndDate('2024-03-31');
    changeTimetablesValidityForm.getSaveButton().click();

    toast.getSuccessToast().should('be.visible');

    // Check that the panel heading's validity changed
    timetableVersionDetailsPanel.getHeading().contains('1.1.2023 - 31.3.2024');

    timetableVersionDetailsPanel.toggleExpandNthRow(1);

    // Check that both timetable card validity periods changed
    timetableVersionDetailsPanel.vehicleJourneyGroupInfo
      .getValidityTimeRange()
      .eq(0)
      .contains('1.1.2023 - 31.3.2024');
    timetableVersionDetailsPanel.vehicleJourneyGroupInfo
      .getValidityTimeRange()
      .eq(1)
      .contains('1.1.2023 - 31.3.2024');

    // Check that the version row's validity changed
    timetableVersionsPage.timetableVersionTableRow
      .getRows()
      .eq(0)
      .findByTestId('TimetableVersionTableRow::validityEnd')
      .contains('31.3.2024');
  });
});
