import {
  GetInfrastructureLinksByExternalIdsResult,
  buildLine,
  buildRoute,
  buildStop,
  buildStopsInJourneyPattern,
  extractInfrastructureLinkIdsFromResponse,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  RouteInsertInput,
  StopInsertInput,
  TimingPatternTimingPlaceInsertInput,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import {
  ImportTimetablesPage,
  PreviewTimetablesPage,
  TimetablesMainpage,
  VehicleScheduleDetailsPage,
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
  },
];

const timingPlaces: TimingPatternTimingPlaceInsertInput[] = [
  {
    timing_place_id: '78ee94c3-e856-4fdc-89ad-10b72cadb444',
    label: '1AACKT',
    description: 'Timing place description 1',
  },
  {
    timing_place_id: 'f8a93c6f-5ef7-4b09-ae5e-0a04ea8597e9',
    label: '1ELIMK',
    description: 'Timing place description 2',
  },
  {
    timing_place_id: '5240633b-5c94-49c1-b1c2-26e9d61a01cd',
    label: '1AURLA',
    description: 'Timing place description 3',
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
    scheduled_stop_point_id: '7ef42a37-142d-44be-9b69-dbe6adca7f34',
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

const stopsInJourneyPattern = buildStopsInJourneyPattern(
  stopLabels,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  journeyPatterns[0].journey_pattern_id!,
);

describe('Timetable import and export', () => {
  let timetablesMainPage: TimetablesMainpage;
  let importTimetablesPage: ImportTimetablesPage;
  let previewTimetablesPage: PreviewTimetablesPage;
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
    cy.task('truncateTimetablesDatabase');
    removeFromDbHelper(dbResources);
    insertToDbHelper(dbResources);

    timetablesMainPage = new TimetablesMainpage();
    importTimetablesPage = new ImportTimetablesPage();
    previewTimetablesPage = new PreviewTimetablesPage();
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();

    cy.setupTests();
    cy.mockLogin();
    cy.visit('/timetables');
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');
  });

  context('Import', () => {
    it(
      'Imports a Hastus timetable file',
      { tags: [Tag.Smoke, Tag.Timetables] },
      () => {
        const ImportFileName = 'hastusImport.exp';
        timetablesMainPage.getImportButton().click();
        cy.get('input[type=file]')
          // Cypress cannot interact with the input component that is hidden
          // so we have to get it to show first
          .invoke('show')
          .selectFile(`uploads/${ImportFileName}`);
        importTimetablesPage.getUploadButton().click();
        cy.wait('@hastusImport')
          .its('response.statusCode')
          .should('equal', 200);
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          `Tiedoston ${ImportFileName} lataus onnistui!`,
        );
        importTimetablesPage.clickEnabledPreviewButton();
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
          .and('contain', '7:17');
        previewTimetablesPage.getSaveButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          'Aikataulujen tuonti onnistui!',
        );
        // Check the imported timetable on a Saturday, which is the day type of the imported timetable
        cy.visit(
          `timetables/lines/${lines[0].line_id}?observationDate=2023-04-29&routeLabels=${routes[0].label}`,
        );
        vehicleScheduleDetailsPage.routeTimetableList.routeTimetablesSection.vehicleServiceTable
          .getTable()
          .click();
        vehicleScheduleDetailsPage.dayTypeDropDown
          .getDayTypeDropdownButton()
          .should('contain', 'Lauantai');
        vehicleScheduleDetailsPage.passingTimesByStopTable
          .getTableRow(stopLabels[0])
          .should('contain', '7')
          .and('contain', '10');
        vehicleScheduleDetailsPage.passingTimesByStopTable
          .getTableRow(stopLabels[1])
          .should('contain', '7')
          .and('contain', '13');
        vehicleScheduleDetailsPage.passingTimesByStopTable
          .getTableRow(stopLabels[2])
          .should('contain', '7')
          .and('contain', '17');
      },
    );
  });

  context('Export', () => {
    const exportDate = DateTime.now().toFormat('yyyy-MM-dd');
    const exportFilePath = `${Cypress.config(
      'downloadsFolder',
    )}/jore4-export-${exportDate}.csv`;

    beforeEach(() => {
      // Import timetable data that can be exported
      const ImportFileName = 'hastusImport.exp';
      timetablesMainPage.getImportButton().click();
      cy.get('input[type=file]')
        .invoke('show')
        .selectFile(`uploads/${ImportFileName}`);
      importTimetablesPage.getUploadButton().click();
      cy.wait('@hastusImport').its('response.statusCode').should('equal', 200);
      importTimetablesPage.toast.checkSuccessToastHasMessage(
        `Tiedoston ${ImportFileName} lataus onnistui!`,
      );
      importTimetablesPage.clickEnabledPreviewButton();
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
      cy.task('deleteFile', exportFilePath);
    });

    it('Exports a timetable of a line', { tags: [Tag.Timetables] }, () => {
      // Search and export timetable
      cy.visit('/timetables');
      timetablesMainPage.searchContainer.getChevron().click();
      timetablesMainPage.searchContainer.priorityCondition
        .getTemporaryPriorityConditionButton()
        .click();
      timetablesMainPage.searchContainer.getSearchInput().type('1234{enter}');
      timetablesMainPage.exportToolBar.getToggleSelectingButton().click();
      // Test id of the checkbox has the variant appended to the label
      timetablesMainPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('1234_0')
        .check();
      timetablesMainPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);
      cy.readFile(exportFilePath)
        .should('contain', 'line 1234')
        .and('contain', 'route 99');
    });

    it('Exports a timetable of a route', { tags: [Tag.Timetables] }, () => {
      // Skip searching via UI
      cy.visit(
        '/timetables/search?label=99&priorities=10&displayedType=routes',
      );
      timetablesMainPage.exportToolBar.getToggleSelectingButton().click();
      // Test id of the checkbox has the variant appended to the label
      timetablesMainPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('99_0')
        .check();
      timetablesMainPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);
      cy.readFile(exportFilePath)
        .should('contain', 'line 1234')
        .and('contain', 'route 99');
    });
  });
});
