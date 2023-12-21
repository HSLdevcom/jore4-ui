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
  ImportTimetablesPage,
  Navbar,
  PassingTimesByStopSection,
  PreviewTimetablesPage,
  RouteTimetablesSection,
  RoutesAndLinesPage,
  TimetableVersionsPage,
  TimetablesMainpage,
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
    validity_start: DateTime.fromISO('2023-01-01'),
    validity_end: DateTime.fromISO('2043-06-30'),
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

const baseTimetableDataInput = {
  _journey_pattern_refs: {
    route99inbound: {
      route_label: '99',
      route_direction: 'inbound',
      route_validity_start: routes[0].validity_start,
      route_validity_end: routes[0].validity_end,
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
  },
  _vehicle_schedule_frames: {
    year2023: {
      validity_start: DateTime.fromISO('2023-01-01'),
      validity_end: DateTime.fromISO('2023-12-31'),
      name: '2023',
      booking_label: '2023 booking label',
      _vehicle_services: {
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

const verifyBaseTimetableValidity = () => {
  const route99InboundTimetableSection = new RouteTimetablesSection(
    '99',
    'inbound',
  );

  const route99InboundSundayVehicleService = new VehicleServiceTable(
    route99InboundTimetableSection,
    'SU',
  );

  const route99InboundSundayPassingTimesSectionStandard =
    new PassingTimesByStopSection(
      route99InboundTimetableSection,
      'SU',
      TimetablePriority.Standard,
    );

  route99InboundSundayVehicleService.getHeadingButton().click();
  route99InboundSundayPassingTimesSectionStandard
    .getDayTypeDropdownButton()
    .should('contain', 'Sunnuntai');
  route99InboundSundayPassingTimesSectionStandard.vehicleJourneyGroupInfo
    .getValidityTimeRange()
    .should('contain', '1.1.2023 - 31.12.2023');
};

describe('Timetable import', () => {
  let timetablesMainPage: TimetablesMainpage;
  let importTimetablesPage: ImportTimetablesPage;
  let previewTimetablesPage: PreviewTimetablesPage;
  let navbar: Navbar;
  let vehicleScheduleDetailsPage: VehicleScheduleDetailsPage;
  let timetableVersionsPage: TimetableVersionsPage;

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
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();

    cy.setupMapTiles();
    cy.mockLogin();
    cy.visit('/');
  });

  afterEach(() => {
    cy.task('emptyDownloadsFolder');
    removeFromDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');
  });

  it(
    'Should export a route and import a Hastus timetable file using preview',
    { tags: [Tag.Smoke, Tag.Timetables, Tag.HastusImport] },
    () => {
      const routesAndLinesPage = new RoutesAndLinesPage();

      const IMPORT_FILENAME = 'hastusImport.exp';

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

      // Skip searching via UI
      cy.visit('/routes/search?label=99&priorities=10&displayedType=routes');
      // Export the route
      routesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
      routesAndLinesPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('99')
        .check();
      routesAndLinesPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);

      // Import a timetable for the exported route
      navbar.getTimetablesLink().click();
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
      importTimetablesPage.getUploadButton().click();
      cy.wait('@hastusImport').its('response.statusCode').should('equal', 200);
      importTimetablesPage.toast.checkSuccessToastHasMessage(
        `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
      );
      // Files uploaded -> nothing left to upload.
      importTimetablesPage.getUploadButton().should('be.disabled');

      importTimetablesPage.clickPreviewButton();

      // Not a single day timetable -> can't select special day.
      previewTimetablesPage.priorityForm
        .getSpecialDayPriorityCheckbox()
        .should('not.be.visible');

      previewTimetablesPage.priorityForm.setAsStandard();
      previewTimetablesPage.blockVehicleJourneysTable
        .getToggleShowTableButton()
        .click();
      previewTimetablesPage.blockVehicleJourneysTable
        .getTable()
        .should('contain', 'Matala A2 -bussi')
        .and('contain', '99')
        .and('contain', 'Lauantai')
        .and('contain', '7:10')
        .and('contain', '7:16');
      previewTimetablesPage.getSaveButton().click();
      importTimetablesPage.toast.checkSuccessToastHasMessage(
        'Aikataulujen tuonti onnistui!',
      );

      // Check the imported timetable on a Saturday, which is the day type of the imported timetable
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2023-04-29&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService.getHeadingButton().click();
      route99InboundSaturdayPassingTimesSection
        .getDayTypeDropdownButton()
        .should('contain', 'Lauantai');
      route99InboundSaturdayPassingTimesSection.assertNthPassingTimeOnStop({
        stopLabel: stopLabels[0],
        nthPassingTime: 0,
        hour: '7',
        departureTime: '10',
      });
      route99InboundSaturdayPassingTimesSection.assertNthPassingTimeOnStop({
        stopLabel: stopLabels[1],
        nthPassingTime: 0,
        hour: '7',
        departureTime: '11',
      });
      route99InboundSaturdayPassingTimesSection.assertNthPassingTimeOnStop({
        stopLabel: stopLabels[2],
        nthPassingTime: 0,
        hour: '7',
        departureTime: '13',
      });
      route99InboundSaturdayPassingTimesSection.assertNthPassingTimeOnStop({
        stopLabel: stopLabels[3],
        nthPassingTime: 0,
        hour: '7',
        departureTime: '16',
      });
    },
  );

  context('Multiple import files', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it(
      'Should import two timetables at the same time',
      { tags: [Tag.Timetables, Tag.HastusImport] },
      () => {
        const IMPORT_FILENAME = 'hastusImport.exp';
        const IMPORT_FILENAME_2 = 'hastusImportSundayJune2023.exp';

        // Import two timetable files
        navbar.getTimetablesLink().click();
        timetablesMainPage.getImportButton().click();
        importTimetablesPage.selectFilesToImport([
          IMPORT_FILENAME,
          IMPORT_FILENAME_2,
        ]);
        importTimetablesPage.getUploadButton().click();
        cy.wait('@hastusImport')
          .its('response.statusCode')
          .should('equal', 200);
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
        );
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          `Tiedoston ${IMPORT_FILENAME_2} lataus onnistui`,
        );
        importTimetablesPage.clickPreviewButton();

        // Not a single day timetable -> can't select special day.
        previewTimetablesPage.priorityForm
          .getSpecialDayPriorityCheckbox()
          .should('not.be.visible');
        previewTimetablesPage.priorityForm.setAsStandard();

        previewTimetablesPage.blockVehicleJourneysTable.clickAllTableToggles();

        previewTimetablesPage.vehicleScheduleFrameBlocksView
          .getFrameBlocksByLabel('0099')
          .should('contain', '1.1.2023 - 30.6.2043 | 1 autokiertoa')
          .and('contain', 'Matala A2 -bussi')
          .and('contain', '99')
          .and('contain', 'Lauantai');

        previewTimetablesPage.vehicleScheduleFrameBlocksView
          .getFrameBlocksByLabel('1199')
          .should('contain', '1.6.2023 - 30.6.2023 | 1 autokiertoa')
          .and('contain', 'Matala A2 -bussi')
          .and('contain', '99')
          .and('contain', 'Sunnuntai');

        previewTimetablesPage.getSaveButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          'Aikataulujen tuonti onnistui!',
        );
      },
    );
  });

  context('Temporary timetables', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it(
      'Should export a route and import a Hastus timetable as temporary',
      { tags: [Tag.Timetables, Tag.HastusImport] },
      () => {
        const route99InboundTimetableSection = new RouteTimetablesSection(
          '99',
          'inbound',
        );

        const route99InboundSundayVehicleService = new VehicleServiceTable(
          route99InboundTimetableSection,
          'SU',
        );

        const route99InboundSundayPassingTimesSectionTemporary =
          new PassingTimesByStopSection(
            route99InboundTimetableSection,
            'SU',
            TimetablePriority.Temporary,
          );

        const IMPORT_FILENAME = 'hastusImportSundayJune2023.exp';

        // Import a timetable for the route
        navbar.getTimetablesLink().click();
        timetablesMainPage.getImportButton().click();
        importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
        importTimetablesPage.getUploadButton().click();
        cy.wait('@hastusImport')
          .its('response.statusCode')
          .should('equal', 200);
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
        );
        importTimetablesPage.clickPreviewButton();

        // Not a single day timetable -> can't select special day.
        previewTimetablesPage.priorityForm
          .getSpecialDayPriorityCheckbox()
          .should('not.be.visible');

        previewTimetablesPage.priorityForm.setAsTemporary();
        previewTimetablesPage.blockVehicleJourneysTable
          .getToggleShowTableButton()
          .click();
        previewTimetablesPage.vehicleScheduleFrameBlocksView
          .getValidityTimeRangeText()
          .should('contain', '1.6.2023 - 30.6.2023 | 1 autokiertoa');
        previewTimetablesPage.blockVehicleJourneysTable
          .getTable()
          .should('contain', 'Matala A2 -bussi')
          .and('contain', '99')
          .and('contain', 'Sunnuntai')
          .and('contain', '7:10')
          .and('contain', '7:16')
          .and('contain', '8:20')
          .and('contain', '8:26');
        previewTimetablesPage.getSaveButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          'Aikataulujen tuonti onnistui!',
        );

        // Check the imported timetable on a Sunday, which is the day type of the imported timetable
        cy.visit(
          `timetables/lines/${lines[0].line_id}?observationDate=2023-06-04&routeLabels=${routes[0].label}`,
        );
        route99InboundSundayVehicleService.getHeadingButton().click();
        route99InboundSundayPassingTimesSectionTemporary
          .getDayTypeDropdownButton()
          .should('contain', 'Sunnuntai');
        route99InboundSundayPassingTimesSectionTemporary.vehicleJourneyGroupInfo
          .getValidityTimeRange()
          .should('contain', '1.6.2023 - 30.6.2023');
        route99InboundSundayPassingTimesSectionTemporary.assertStopTimes({
          stopLabel: stopLabels[0],
          hour: '7',
          departureMinutes: ['10'],
        });
        route99InboundSundayPassingTimesSectionTemporary.assertStopTimes({
          stopLabel: stopLabels[1],
          hour: '7',
          departureMinutes: ['11'],
        });
        route99InboundSundayPassingTimesSectionTemporary.assertStopTimes({
          stopLabel: stopLabels[2],
          hour: '7',
          departureMinutes: ['13'],
        });
        route99InboundSundayPassingTimesSectionTemporary.assertStopTimes({
          stopLabel: stopLabels[3],
          hour: '7',
          departureMinutes: ['16'],
        });

        // Check the Sunday timetable after the temporary timetable is not valid
        cy.visit(
          `timetables/lines/${lines[0].line_id}?observationDate=2023-07-02&routeLabels=${routes[0].label}`,
        );
        verifyBaseTimetableValidity();
      },
    );
  });

  context('Draft timetables', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it(
      'Should import a Hastus timetable as a draft',
      { tags: [Tag.Timetables, Tag.HastusImport] },
      () => {
        timetableVersionsPage = new TimetableVersionsPage();

        const IMPORT_FILENAME = 'hastusImportSundayJune2023.exp';

        // Import a timetable for the route
        navbar.getTimetablesLink().click();
        timetablesMainPage.getImportButton().click();
        importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
        importTimetablesPage.getUploadButton().click();
        cy.wait('@hastusImport')
          .its('response.statusCode')
          .should('equal', 200);
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
        );
        importTimetablesPage.clickPreviewButton();

        // Not a single day timetable -> can't select special day.
        previewTimetablesPage.priorityForm
          .getSpecialDayPriorityCheckbox()
          .should('not.be.visible');

        previewTimetablesPage.priorityForm.setAsDraft();
        previewTimetablesPage.blockVehicleJourneysTable
          .getToggleShowTableButton()
          .click();
        previewTimetablesPage.blockVehicleJourneysTable
          .getTable()
          .should('contain', 'Matala A2 -bussi')
          .and('contain', '99')
          .and('contain', 'Sunnuntai')
          .and('contain', '7:10')
          .and('contain', '7:16');
        previewTimetablesPage.getSaveButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          'Aikataulujen tuonti onnistui!',
        );

        // Check the Sunday timetable within time range of the draft timetable
        cy.visit(
          `timetables/lines/${lines[0].line_id}?observationDate=2023-06-04&routeLabels=${routes[0].label}`,
        );

        verifyBaseTimetableValidity();

        // Verify that the draft timetable is listed on the timetable versions page
        vehicleScheduleDetailsPage.getShowVersionsButton().click();
        timetableVersionsPage.timeRangeControl.setTimeRange(
          '2023-06-01',
          '2023-06-30',
        );
        timetableVersionsPage.timetableVersionTableRow
          .getRow()
          .should('have.length', 2);
        timetableVersionsPage.timetableVersionTableRow
          .getRow()
          .eq(0)
          .should('contain', 'Voimassa')
          .and('contain', 'Sunnuntai')
          .and('contain', '1.1.2023')
          .and('contain', '31.12.2023')
          .and('contain', '99');
        timetableVersionsPage.timetableVersionTableRow
          .getRow()
          .eq(1)
          .should('contain', 'Luonnos')
          .and('contain', 'Sunnuntai')
          .and('contain', '1.6.2023')
          .and('contain', '30.6.2023')
          .and('contain', '99');
      },
    );
  });

  context('Special days', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it(
      'Should import a special day timetable for a route',
      { tags: [Tag.Timetables, Tag.HastusImport] },
      () => {
        const route99InboundTimetableSection = new RouteTimetablesSection(
          '99',
          'inbound',
        );

        const route99InboundSundayVehicleService = new VehicleServiceTable(
          route99InboundTimetableSection,
          'SU',
        );

        const route99InboundSundayPassingTimesSectionSpecial =
          new PassingTimesByStopSection(
            route99InboundTimetableSection,
            'SU',
            TimetablePriority.Special,
          );

        const IMPORT_FILENAME = 'specialDaySunday.exp';

        // Import the special day timetable for the route
        navbar.getTimetablesLink().click();
        timetablesMainPage.getImportButton().click();
        importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
        importTimetablesPage.getUploadButton().click();
        cy.wait('@hastusImport')
          .its('response.statusCode')
          .should('equal', 200);
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
        );

        // Check that UI component states are correct in the confirmation modal
        importTimetablesPage.getSaveButton().click();
        previewTimetablesPage.confirmTimetablesImportForm.priorityForm
          .getDraftPriorityButton()
          .should('be.disabled');
        previewTimetablesPage.confirmTimetablesImportForm.priorityForm
          .getStandardPriorityButton()
          .should('be.disabled');
        previewTimetablesPage.confirmTimetablesImportForm.priorityForm
          .getTemporaryPriorityButton()
          .should('be.disabled');
        previewTimetablesPage.confirmTimetablesImportForm.priorityForm
          .getSpecialDayPriorityCheckbox()
          .should('be.visible')
          .and('be.checked')
          .and('be.disabled');
        previewTimetablesPage.confirmTimetablesImportForm
          .getCancelButton()
          .click();

        // Check that UI component states are correct in the preview
        importTimetablesPage.clickPreviewButton();
        previewTimetablesPage.priorityForm
          .getStandardPriorityButton()
          .should('be.disabled');
        previewTimetablesPage.priorityForm
          .getDraftPriorityButton()
          .should('be.disabled');
        previewTimetablesPage.priorityForm
          .getTemporaryPriorityButton()
          .should('be.disabled');
        previewTimetablesPage.priorityForm
          .getSpecialDayPriorityCheckbox()
          .should('be.visible')
          .and('be.checked')
          .and('be.disabled');

        previewTimetablesPage.blockVehicleJourneysTable
          .getToggleShowTableButton()
          .click();
        previewTimetablesPage.blockVehicleJourneysTable
          .getTable()
          .should('contain', 'Matala A2 -bussi')
          .and('contain', '99')
          .and('contain', 'Sunnuntai')
          .and('contain', '6:10')
          .and('contain', '6:16');
        previewTimetablesPage.getSaveButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          'Aikataulujen tuonti onnistui!',
        );

        // Check the imported timetable on the date of the special day
        cy.visit(
          `timetables/lines/${lines[0].line_id}?observationDate=2023-11-12&routeLabels=${routes[0].label}`,
        );
        route99InboundSundayVehicleService.getHeadingButton().click();
        route99InboundSundayPassingTimesSectionSpecial
          .getDayTypeDropdownButton()
          .should('contain', 'Sunnuntai');
        route99InboundSundayPassingTimesSectionSpecial.vehicleJourneyGroupInfo
          .getValidityTimeRange()
          .should('contain', '12.11.2023 - 12.11.2023');
        route99InboundSundayPassingTimesSectionSpecial.assertStopTimes({
          stopLabel: stopLabels[0],
          hour: '6',
          departureMinutes: ['10'],
        });
        route99InboundSundayPassingTimesSectionSpecial.assertStopTimes({
          stopLabel: stopLabels[1],
          hour: '6',
          departureMinutes: ['11'],
        });
        route99InboundSundayPassingTimesSectionSpecial.assertStopTimes({
          stopLabel: stopLabels[2],
          hour: '6',
          departureMinutes: ['13'],
        });
        route99InboundSundayPassingTimesSectionSpecial.assertStopTimes({
          stopLabel: stopLabels[3],
          hour: '6',
          departureMinutes: ['16'],
        });

        route99InboundSundayPassingTimesSectionSpecial.assertStopTimes({
          stopLabel: stopLabels[0],
          hour: '7',
          departureMinutes: ['20'],
        });
        route99InboundSundayPassingTimesSectionSpecial.assertStopTimes({
          stopLabel: stopLabels[1],
          hour: '7',
          departureMinutes: ['21'],
        });
        route99InboundSundayPassingTimesSectionSpecial.assertStopTimes({
          stopLabel: stopLabels[2],
          hour: '7',
          departureMinutes: ['23'],
        });
        route99InboundSundayPassingTimesSectionSpecial.assertStopTimes({
          stopLabel: stopLabels[3],
          hour: '7',
          departureMinutes: ['26'],
        });

        // Check the Sunday timetable a week from the special day
        cy.visit(
          `timetables/lines/${lines[0].line_id}?observationDate=2023-11-19&routeLabels=${routes[0].label}`,
        );
        verifyBaseTimetableValidity();
      },
    );

    it(
      'Should show an error message when trying to import a normal timetable and a special day timetable at the same time',
      { tags: [Tag.Timetables, Tag.HastusImport] },
      () => {
        const IMPORT_FILENAME = 'specialDaySunday.exp';
        const IMPORT_FILENAME_2 = 'hastusImport.exp';

        navbar.getTimetablesLink().click();
        timetablesMainPage.getImportButton().click();
        importTimetablesPage.selectFilesToImport([
          IMPORT_FILENAME,
          IMPORT_FILENAME_2,
        ]);
        importTimetablesPage.getUploadButton().click();
        cy.wait('@hastusImport')
          .its('response.statusCode')
          .should('equal', 200);
        importTimetablesPage.getSaveButton().click();
        cy.contains(
          'Tuoduissa aikatauluissa on erityispäivien lisäksi myös muita aikatauluja.',
        );
        cy.contains(
          'Tallennus ei ole mahdollista. Keskeytä aikataulujen tuonti ja tuo yhden päivän pituiset aikataulut erikseen.',
        );
      },
    );
  });

  context('Cancel timetable import', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it(
      'Should successfully cancel a timetable import',
      { tags: [Tag.Timetables, Tag.HastusImport] },
      () => {
        timetableVersionsPage = new TimetableVersionsPage();

        const IMPORT_FILENAME = 'hastusImport.exp';

        // Import a timetable for the route
        navbar.getTimetablesLink().click();
        timetablesMainPage.getImportButton().click();
        importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
        importTimetablesPage.getUploadButton().click();
        cy.wait('@hastusImport')
          .its('response.statusCode')
          .should('equal', 200);
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
        );
        importTimetablesPage.getAbortButton().click();
        importTimetablesPage.confirmationDialog.getConfirmButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          'Aikataulujen tuonti keskeytetty',
        );

        importTimetablesPage.verifyImportFormButtonsDisabled();

        // Check the imported timetable on a Saturday, which is the day type of the timetable in the import file
        cy.visit(
          `timetables/lines/${lines[0].line_id}?observationDate=2023-04-29&routeLabels=${routes[0].label}`,
        );

        vehicleScheduleDetailsPage.getShowAllValidSwitch().click();

        cy.getByTestId('VehicleServiceTable::headingButton')
          .contains('Sunnuntai')
          .should('exist');
        cy.get('[data-testid="VehicleServiceTable::headingButton"]')
          .contains('Lauantai')
          .should('not.exist');
      },
    );
  });
});
