import {
  GetInfrastructureLinksByExternalIdsResult,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  RouteInsertInput,
  StopInJourneyPatternInsertInput,
  RouteDirectionEnum,
  RouteTypeOfLineEnum,
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
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import {
  ImportTimetablesPage,
  Navbar,
  PassingTimesByStopSection,
  PreviewTimetablesPage,
  RoutesAndLinesPage,
  RouteTimetablesSection,
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
    line_id: '4b8c8f84-12bc-4716-b15e-476f0efaa645',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
  },
];

const timingPlaces = [
  buildTimingPlace('0f61ad5c-9035-4b62-8120-92e39baf3e24', '1AACKT'),
  buildTimingPlace('f8a93c6f-5ef7-4b09-ae5e-0a04ea8597e9', '1ELIMK'),
  buildTimingPlace('53285ed7-5ca6-48ce-9853-d9613cc5995f', '1AURLA'),
];

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    scheduled_stop_point_id: '12fe9420-94c5-4619-bb99-541087b542b7',
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
    scheduled_stop_point_id: '9a9cbf66-44ce-4aea-8c2a-23ae963d24fb',
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
    scheduled_stop_point_id: '21ea80fa-9a00-462a-b644-abe7a75597ff',
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
    route_id: 'c82987b1-87f8-474e-99aa-07350a474efd',
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
    journey_pattern_id: 'a7f7a166-0b12-474b-940b-a5d2da9ad24b',
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

describe('Timetable validity period', () => {
  let routesAndLinesPage: RoutesAndLinesPage;
  let timetablesMainPage: TimetablesMainpage;
  let importTimetablesPage: ImportTimetablesPage;
  let previewTimetablesPage: PreviewTimetablesPage;
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

    routesAndLinesPage = new RoutesAndLinesPage();
    timetablesMainPage = new TimetablesMainpage();
    importTimetablesPage = new ImportTimetablesPage();
    previewTimetablesPage = new PreviewTimetablesPage();
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();
    navbar = new Navbar();

    cy.setupMapTiles();
    cy.mockLogin();
    cy.visit('/');

    // TODO: Change timetable importing to use Data Inserter instead of populating data using
    // jore4-hastus service.

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

    const IMPORT_FILENAME = 'hastusImport.exp';
    timetablesMainPage.getImportButton().click();
    importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
    importTimetablesPage.getUploadButton().click();
    cy.wait('@hastusImport').its('response.statusCode').should('equal', 200);
    importTimetablesPage.clickPreviewButton();
    previewTimetablesPage.priorityForm.setAsStandard();
    previewTimetablesPage.blockVehicleJourneysTable
      .getToggleShowTableButton()
      .click();
    previewTimetablesPage.getSaveButton().click();
    importTimetablesPage.toast.checkSuccessToastHasMessage(
      'Aikataulujen tuonti onnistui!',
    );
  });

  afterEach(() => {
    const exportDate = DateTime.now().toISODate();
    const exportFilePath = `${Cypress.config(
      'downloadsFolder',
    )}/jore4-export-${exportDate}.csv`;
    cy.task('deleteFile', exportFilePath);

    removeFromDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');
  });

  it(
    "Should change a timetable's validity period",
    { tags: [Tag.Timetables] },
    () => {
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2023-04-29&routeLabels=${routes[0].label}`,
      );
      const route99InboundTimetableSection = new RouteTimetablesSection(
        '99',
        'inbound',
      );

      const route99InboundSaturdayVehicleService = new VehicleServiceTable(
        route99InboundTimetableSection,
        'LA',
      );

      route99InboundSaturdayVehicleService.clickChangeValidityDate();

      vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityStartDate(
        '2025-03-03',
      );

      vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityEndDate(
        '2026-03-03',
      );

      vehicleScheduleDetailsPage.changeTimetablesValidityForm
        .getSaveButton()
        .click();

      cy.wait('@gqlUpdateVehicleScheduleFrameValidity')
        .its('response.statusCode')
        .should('equal', 200);

      vehicleScheduleDetailsPage.toast.checkSuccessToastHasMessage(
        'Aikataulun voimassaolo tallennettu',
      );

      route99InboundTimetableSection.assertRouteHasNoSchedules();
      // Check the imported timetable on the first valid Saturday, which is the day type of the imported timetable
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2025-03-08',
      );

      route99InboundSaturdayVehicleService
        .get()
        .should('contain', '3.3.2025 - 3.3.2026')
        .and('contain', '2 lähtöä')
        .and('contain', '07:10 ... 08:20');

      // Verify the timetable is not valid on the last Saturday before the validity period has begun
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2025-03-01',
      );
      route99InboundTimetableSection.assertRouteHasNoSchedules();
      // Verify the timetable is not valid on the first Saturday after the validity period has ended
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2026-03-07',
      );
      route99InboundTimetableSection.assertRouteHasNoSchedules();
    },
  );

  it(
    "Should change a timetable's validity period in the passing times view",
    { tags: [Tag.Timetables] },
    () => {
      cy.visit(
        `timetables/lines/${lines[0].line_id}?routeLabels=${routes[0].label}&observationDate=2023-04-29&timetablesView=passingTimesByStop&dayType=LA`,
      );

      const route99InboundTimetableSection = new RouteTimetablesSection(
        '99',
        'inbound',
      );

      const route99InboundSaturdayPassingTimesSection =
        new PassingTimesByStopSection(
          route99InboundTimetableSection,
          'LA',
          TimetablePriority.Standard,
        );

      route99InboundSaturdayPassingTimesSection.clickChangeValidityDate();
      vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityStartDate(
        '2025-03-03',
      );
      vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityEndDate(
        '2026-03-03',
      );

      route99InboundSaturdayPassingTimesSection.clickChangeValidityDate();
      vehicleScheduleDetailsPage.changeTimetablesValidityForm
        .getSaveButton()
        .click();

      cy.wait('@gqlUpdateVehicleScheduleFrameValidity')
        .its('response.statusCode')
        .should('equal', 200);

      vehicleScheduleDetailsPage.toast.checkSuccessToastHasMessage(
        'Aikataulun voimassaolo tallennettu',
      );

      route99InboundTimetableSection.assertRouteHasNoSchedules();

      // Check the imported timetable on the first valid Saturday, which is the day type of the imported timetable
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2025-03-08',
      );
      route99InboundSaturdayPassingTimesSection
        .getDayTypeDropdownButton()
        .should('contain', 'Lauantai');
      route99InboundSaturdayPassingTimesSection
        .get()
        .should('contain', '3.3.2025 - 3.3.2026')
        .and('contain', '2 lähtöä')
        .and('contain', '07:10 ... 08:20');
      // Verify the timetable is not valid on the last Saturday before the validity period has begun
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2025-03-01',
      );
      route99InboundTimetableSection.assertRouteHasNoSchedules();
      // Verify the timetable is not valid on the first Saturday after the validity period has ended
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2026-03-07',
      );
      route99InboundTimetableSection.assertRouteHasNoSchedules();
    },
  );
});
