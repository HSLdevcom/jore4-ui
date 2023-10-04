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
  VehicleServiceTable,
} from '../pageObjects';
import { UUID } from '../types';
import {
  insertToDbHelper,
  removeFromDbHelper,
  SupportedResources,
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
    timing_place_id: timingPlaces[1].timing_place_id,
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
    scheduled_stop_point_id: '322a32cc-7a50-402b-9c01-5dc6a6b39af6',
    timing_place_id: timingPlaces[2].timing_place_id,
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

describe('Timetable import and export', () => {
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

    cy.setupTests();
    cy.mockLogin();
    cy.visit('/');
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
    'Should export a route and import a Hastus timetable file using preview',
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

      const IMPORT_FILENAME = 'hastusImport.exp';

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
        `Tiedoston ${IMPORT_FILENAME} lataus onnistui!`,
      );
      importTimetablesPage.clickPreviewButton();
      previewTimetablesPage.priorityForm.setAsStandard();
      previewTimetablesPage.blockVehicleJourneysTable
        .getToggleShowTableButton()
        .click();
      previewTimetablesPage.blockVehicleJourneysTable
        .getTable()
        .should('contain', 'Kalustotyyppi 3 - Normaalibussi')
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
        departureTime: '13',
      });
      route99InboundSaturdayPassingTimesSection.assertNthPassingTimeOnStop({
        stopLabel: stopLabels[2],
        nthPassingTime: 0,
        hour: '7',
        departureTime: '16',
      });
    },
  );
});
