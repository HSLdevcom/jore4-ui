import {
  GetInfrastructureLinksByExternalIdsResult,
  buildLine,
  buildRoute,
  buildStop,
  buildStopInJourneyPattern,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  RouteDirectionEnum,
  RouteInsertInput,
  StopInJourneyPatternInsertInput,
  RouteTypeOfLineEnum,
  StopInsertInput,
  TimetablePriority,
} from '@hsl/jore4-test-db-manager';
import { defaultDayTypeIds } from '@hsl/timetables-data-inserter';
import { DateTime, Duration } from 'luxon';
import { Tag } from '../enums';
import {
  ImportTimetablesPage,
  Navbar,
  PassingTimesByStopSection,
  PreviewTimetablesPage,
  RoutesAndLinesPage,
  RouteTimetablesSection,
  TimetablesMainpage,
  VehicleServiceTable,
} from '../pageObjects';
import { UUID } from '../types';
import {
  insertToDbHelper,
  removeFromDbHelper,
  SupportedResources,
} from '../utils';
import { deleteExportFile } from './utils';

const REPLACE_IMPORT_FILENAME = 'timetablesReplace1.exp';
const COMBINE_IMPORT_FILENAME = 'timetablesCombine1.exp';

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
  buildTimingPlace('78ee94c3-e856-4fdc-89ad-10b72cadb444', '1AACKT'),
  buildTimingPlace('f8a93c6f-5ef7-4b09-ae5e-0a04ea8597e9', '1ELIMK'),
  buildTimingPlace('5240633b-5c94-49c1-b1c2-26e9d61a01cd', '1AURLA'),
];

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    scheduled_stop_point_id: '7ef42a37-142d-44be-9b69-dbe6adca7f34',
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
    scheduled_stop_point_id: '4f8df0bc-a5cb-4fbe-a6dc-0425d55be382',
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
    scheduled_stop_point_id: 'b17e9ca3-44d1-4c18-8caf-018f28793ec2',
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
      validity_start: DateTime.fromISO('2023-01-01'),
      validity_end: DateTime.fromISO('2023-12-31'),
      name: 'Kevät 2023',
      booking_label: 'Spring booking label',
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
      },
    },
  },
};

describe('Timetable replacement and combination', () => {
  let timetablesMainPage: TimetablesMainpage;
  let importTimetablesPage: ImportTimetablesPage;
  let previewTimetablesPage: PreviewTimetablesPage;
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

    timetablesMainPage = new TimetablesMainpage();
    importTimetablesPage = new ImportTimetablesPage();
    previewTimetablesPage = new PreviewTimetablesPage();
    navbar = new Navbar();

    cy.setupMapTiles();
    cy.mockLogin();
    cy.visit('/');

    cy.task('insertHslTimetablesDatasetToDb', timetableDataInput);
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');
  });

  after(() => {
    deleteExportFile();
  });

  it(
    'Should import timetable data using preview and replace existing data',
    { tags: [Tag.Smoke, Tag.Timetables, Tag.HastusImport] },
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

      const routesAndLinesPage = new RoutesAndLinesPage();

      // Skip searching via UI
      cy.visit('/routes/search?label=99&priorities=10&displayedType=routes');
      // Export the route to enable timetable import for it
      routesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
      routesAndLinesPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('99')
        .check();
      routesAndLinesPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);

      // Import the replacement timetable for the exported route
      navbar.getTimetablesLink().click();
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFileToImport(REPLACE_IMPORT_FILENAME);
      importTimetablesPage.getUploadButton().click();
      cy.wait('@hastusImport').its('response.statusCode').should('equal', 200);
      importTimetablesPage.toast.checkSuccessToastHasMessage(
        `Tiedoston ${REPLACE_IMPORT_FILENAME} lataus onnistui!`,
      );
      importTimetablesPage.clickPreviewButton();
      previewTimetablesPage.priorityForm.setAsStandard();
      previewTimetablesPage.confirmPreviewedTimetablesImportForm
        .getReplaceRadioButton()
        .should('be.checked');
      previewTimetablesPage.vehicleScheduleFrameBlocksView
        .getValidityTimeRangeText()
        .should('contain', '1.7.2023 - 31.12.2023 | 1 autokiertoa');
      previewTimetablesPage.blockVehicleJourneysTable
        .getToggleShowTableButton()
        .click();
      previewTimetablesPage.blockVehicleJourneysTable
        .getTable()
        .find('th')
        .should('contain', 'Kalustotyyppi 3 - Normaalibussi');
      previewTimetablesPage.blockVehicleJourneysTable
        .getVehicleJourneyRow('99', 'inbound')
        .eq(0)
        .should('contain', 'Lauantai')
        .and('contain', '09:11')
        .and('contain', '09:17');
      previewTimetablesPage.blockVehicleJourneysTable
        .getVehicleJourneyRow('99', 'inbound')
        .eq(1)
        .should('contain', 'Lauantai')
        .and('contain', '10:21')
        .and('contain', '10:27');
      previewTimetablesPage.getSaveButton().click();
      importTimetablesPage.toast.checkSuccessToastHasMessage(
        'Aikataulujen tuonti onnistui!',
      );

      // Check the timetable on a Saturday before the change date
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2023-06-24&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService.getHeadingButton().click();
      route99InboundSaturdayPassingTimesSection
        .getDayTypeDropdownButton()
        .should('contain', 'Lauantai');
      route99InboundSaturdayPassingTimesSection.vehicleJourneyGroupInfo
        .getValidityTimeRange()
        .should('contain', '1.1.2023 - 30.6.2023');
      route99InboundSaturdayPassingTimesSection.vehicleJourneyGroupInfo
        .getTripCount()
        .should('contain', '2 lähtöä');
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '7',
        departureMinutes: ['05'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '7',
        departureMinutes: ['13'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '7',
        departureMinutes: ['23'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '7',
        departureMinutes: ['27'],
      });

      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '8',
        departureMinutes: ['20'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '8',
        departureMinutes: ['23'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '8',
        departureMinutes: ['27'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '8',
        departureMinutes: ['29'],
      });

      // Check that the timetable has changed on the first Saturday after the validity start date of the new timetable
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2023-07-01&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService.getHeadingButton().click();
      route99InboundSaturdayPassingTimesSection
        .getDayTypeDropdownButton()
        .should('contain', 'Lauantai');
      route99InboundSaturdayPassingTimesSection.vehicleJourneyGroupInfo
        .getValidityTimeRange()
        .should('contain', '1.7.2023 - 31.12.2023');
      route99InboundSaturdayPassingTimesSection.vehicleJourneyGroupInfo
        .getTripCount()
        .should('contain', '2 lähtöä');
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '9',
        departureMinutes: ['11'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '9',
        departureMinutes: ['12'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '9',
        departureMinutes: ['14'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '9',
        departureMinutes: ['17'],
      });

      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '10',
        departureMinutes: ['21'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '10',
        departureMinutes: ['21'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '10',
        departureMinutes: ['24'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '10',
        departureMinutes: ['27'],
      });
    },
  );

  it(
    'Should import timetable data using preview and combine existing data',
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

      const routesAndLinesPage = new RoutesAndLinesPage();

      // Skip searching via UI
      cy.visit('/routes/search?label=99&priorities=10&displayedType=routes');
      // Export the route to enable timetable import for it
      routesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
      routesAndLinesPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('99')
        .check();
      routesAndLinesPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);

      // Import the replacement timetable for the exported route
      navbar.getTimetablesLink().click();
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFileToImport(COMBINE_IMPORT_FILENAME);
      importTimetablesPage.getUploadButton().click();
      cy.wait('@hastusImport').its('response.statusCode').should('equal', 200);
      importTimetablesPage.toast.checkSuccessToastHasMessage(
        `Tiedoston ${COMBINE_IMPORT_FILENAME} lataus onnistui!`,
      );
      importTimetablesPage.clickPreviewButton();
      previewTimetablesPage.priorityForm.setAsStandard();
      previewTimetablesPage.vehicleScheduleFrameBlocksView
        .getValidityTimeRangeText()
        .should('contain', '1.1.2023 - 31.12.2023 | 1 autokiertoa');
      previewTimetablesPage.confirmPreviewedTimetablesImportForm
        .getCombineRadioButton()
        .check();
      previewTimetablesPage.blockVehicleJourneysTable
        .getToggleShowTableButton()
        .click();
      previewTimetablesPage.blockVehicleJourneysTable
        .getTable()
        .find('th')
        .should('contain', 'Kalustotyyppi 3 - Normaalibussi');
      previewTimetablesPage.blockVehicleJourneysTable
        .getVehicleJourneyRow('99', 'inbound')
        .eq(0)
        .should('contain', 'Lauantai')
        .and('contain', '7:11')
        .and('contain', '7:17');
      previewTimetablesPage.blockVehicleJourneysTable
        .getVehicleJourneyRow('99', 'inbound')
        .eq(1)
        .should('contain', 'Lauantai')
        .and('contain', '8:21')
        .and('contain', '8:33');
      previewTimetablesPage.getSaveButton().click();
      importTimetablesPage.toast.checkSuccessToastHasMessage(
        'Aikataulujen tuonti onnistui!',
      );

      // Check that the previous timetable data and imported timetable data both exist
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2023-01-07&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService.getHeadingButton().click();
      route99InboundSaturdayPassingTimesSection
        .getDayTypeDropdownButton()
        .should('contain', 'Lauantai');

      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '7',
        departureMinutes: ['05', '11'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '7',
        departureMinutes: ['12', '13'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '7',
        departureMinutes: ['14', '23'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '7',
        departureMinutes: ['17', '27'],
      });

      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '8',
        departureMinutes: ['20', '21'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '8',
        departureMinutes: ['21', '23'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '8',
        departureMinutes: ['24', '27'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '8',
        departureMinutes: ['29', '33'],
      });
    },
  );

  it(
    'Should import timetable data without using preview and replace existing data',
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

      const routesAndLinesPage = new RoutesAndLinesPage();

      // Skip searching via UI
      cy.visit('/routes/search?label=99&priorities=10&displayedType=routes');
      // Export the route to enable timetable import for it
      routesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
      routesAndLinesPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('99')
        .check();
      routesAndLinesPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);

      // Import the replacement timetable for the exported route
      navbar.getTimetablesLink().click();
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFileToImport(REPLACE_IMPORT_FILENAME);
      importTimetablesPage.getUploadButton().click();
      cy.wait('@hastusImport').its('response.statusCode').should('equal', 200);
      importTimetablesPage.toast.checkSuccessToastHasMessage(
        `Tiedoston ${REPLACE_IMPORT_FILENAME} lataus onnistui!`,
      );
      importTimetablesPage.getSaveButton().click();

      previewTimetablesPage.confirmTimetablesImportForm
        .getReplaceRadioButton()
        .should('be.checked');
      previewTimetablesPage.confirmTimetablesImportForm.priorityForm.setAsStandard();
      previewTimetablesPage.confirmTimetablesImportForm.getSaveButton().click();
      importTimetablesPage.toast.checkSuccessToastHasMessage(
        'Aikataulujen tuonti onnistui!',
      );

      // Check the timetable on a Saturday before the change date
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2023-06-24&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService.getHeadingButton().click();
      route99InboundSaturdayPassingTimesSection
        .getDayTypeDropdownButton()
        .should('contain', 'Lauantai');
      route99InboundSaturdayPassingTimesSection.vehicleJourneyGroupInfo
        .getValidityTimeRange()
        .should('contain', '1.1.2023 - 30.6.2023');
      route99InboundSaturdayPassingTimesSection.vehicleJourneyGroupInfo
        .getTripCount()
        .should('contain', '2 lähtöä');
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '7',
        departureMinutes: ['05'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '7',
        departureMinutes: ['13'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '7',
        departureMinutes: ['23'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '7',
        departureMinutes: ['27'],
      });

      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '8',
        departureMinutes: ['20'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '8',
        departureMinutes: ['23'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '8',
        departureMinutes: ['27'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '8',
        departureMinutes: ['29'],
      });

      // Check that the timetable has changed on the first Saturday after the validity start date of the new timetable
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2023-07-01&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService.getHeadingButton().click();
      route99InboundSaturdayPassingTimesSection
        .getDayTypeDropdownButton()
        .should('contain', 'Lauantai');
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '9',
        departureMinutes: ['11'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '9',
        departureMinutes: ['12'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '9',
        departureMinutes: ['14'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '9',
        departureMinutes: ['17'],
      });

      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '10',
        departureMinutes: ['21'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '10',
        departureMinutes: ['21'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '10',
        departureMinutes: ['24'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '10',
        departureMinutes: ['27'],
      });
    },
  );

  it(
    'Should import timetable data without using preview and combine existing data',
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

      const routesAndLinesPage = new RoutesAndLinesPage();

      // Skip searching via UI
      cy.visit('/routes/search?label=99&priorities=10&displayedType=routes');
      // Export the route to enable timetable import for it
      routesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
      routesAndLinesPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('99')
        .check();
      routesAndLinesPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);

      // Import the replacement timetable for the exported route
      navbar.getTimetablesLink().click();
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFileToImport(COMBINE_IMPORT_FILENAME);
      importTimetablesPage.getUploadButton().click();
      cy.wait('@hastusImport').its('response.statusCode').should('equal', 200);
      importTimetablesPage.toast.checkSuccessToastHasMessage(
        `Tiedoston ${COMBINE_IMPORT_FILENAME} lataus onnistui!`,
      );
      importTimetablesPage.getSaveButton().click();
      previewTimetablesPage.confirmTimetablesImportForm
        .getCombineRadioButton()
        .click();
      previewTimetablesPage.confirmTimetablesImportForm.priorityForm.setAsStandard();
      // TODO: check that to-be-replaced frames are shown correctly
      previewTimetablesPage.confirmTimetablesImportForm.getSaveButton().click();
      importTimetablesPage.toast.checkSuccessToastHasMessage(
        'Aikataulujen tuonti onnistui!',
      );

      // Check that the previous timetable data and imported timetable data both exist
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2023-01-07&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService.getHeadingButton().click();
      route99InboundSaturdayPassingTimesSection
        .getDayTypeDropdownButton()
        .should('contain', 'Lauantai');

      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '7',
        departureMinutes: ['05', '11'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '7',
        departureMinutes: ['12', '13'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '7',
        departureMinutes: ['14', '23'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '7',
        departureMinutes: ['17', '27'],
      });

      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[0],
        hour: '8',
        departureMinutes: ['20', '21'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[1],
        hour: '8',
        departureMinutes: ['21', '23'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[2],
        hour: '8',
        departureMinutes: ['24', '27'],
      });
      route99InboundSaturdayPassingTimesSection.assertStopTimes({
        stopLabel: stopLabels[3],
        hour: '8',
        departureMinutes: ['29', '33'],
      });
    },
  );

  // TODO: add a test for a fail case when it is handled in the UI
});
