import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { getClonedBaseTimetableDataInput } from '../datasets/timetables';
import { Tag } from '../enums';
import {
  ErrorModal,
  ImportTimetablesPage,
  Navbar,
  PassingTimesByStopTable,
  PreviewTimetablesPage,
  RouteTimetablesSection,
  RoutesAndLinesPage,
  SearchResultsPage,
  TimetableVersionsPage,
  TimetablesMainPage,
  VehicleScheduleDetailsPage,
} from '../pageObjects';
import { ConfirmTimetablesImportModal } from '../pageObjects/timetables/import/ConfirmTimetablesImportModal';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

const rootTags: Cypress.SuiteConfigOverrides = {
  tags: [Tag.Timetables, Tag.HastusImport],
};
describe('Timetable import', rootTags, () => {
  let timetablesMainPage: TimetablesMainPage;
  let importTimetablesPage: ImportTimetablesPage;
  let previewTimetablesPage: PreviewTimetablesPage;
  let navbar: Navbar;
  let vehicleScheduleDetailsPage: VehicleScheduleDetailsPage;
  let timetableVersionsPage: TimetableVersionsPage;
  let routeTimetablesSection: RouteTimetablesSection;
  let passingTimesByStopTable: PassingTimesByStopTable;
  let searchResultsPage: SearchResultsPage;
  let dbResources: SupportedResources;

  const baseDbResources = getClonedBaseDbResources();
  const baseTimetableDataInput = getClonedBaseTimetableDataInput();

  before(() => {
    cy.task<UUID[]>(
      'getInfrastructureLinkIdsByExternalIds',
      testInfraLinkExternalIds,
    ).then((infraLinkIds) => {
      const stops = buildStopsOnInfraLinks(infraLinkIds);

      const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

      dbResources = {
        ...baseDbResources,
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  beforeEach(() => {
    cy.task('resetDbs');
    cy.task('emptyDownloadsFolder');
    insertToDbHelper(dbResources);

    timetablesMainPage = new TimetablesMainPage();
    importTimetablesPage = new ImportTimetablesPage();
    previewTimetablesPage = new PreviewTimetablesPage();
    navbar = new Navbar();
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();
    routeTimetablesSection = new RouteTimetablesSection();
    passingTimesByStopTable = new PassingTimesByStopTable();
    searchResultsPage = new SearchResultsPage();

    cy.setupTests();
    cy.mockLogin();
  });

  it(
    'Should export a route and import a Hastus timetable file using preview',
    { tags: [Tag.Smoke] },
    () => {
      const routesAndLinesPage = new RoutesAndLinesPage();
      const { vehicleScheduleFrameBlocksView } = previewTimetablesPage;
      const { blockVehicleJourneysTable } = vehicleScheduleFrameBlocksView;
      const { vehicleJourneyRow } = blockVehicleJourneysTable;

      const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';

      cy.visit('/routes/search?label=901&priorities=10&displayedType=routes');
      // Export the route
      routesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
      routesAndLinesPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('901')
        .check();
      routesAndLinesPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);

      // Import a timetable for the exported route
      navbar.getTimetablesLink().click();
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
      importTimetablesPage.getUploadButton().click();
      importTimetablesPage.toast.expectSuccessToast(
        `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
      );
      // Files uploaded -> nothing left to upload.
      importTimetablesPage.getUploadButton().should('be.disabled');

      importTimetablesPage.clickPreviewButton();

      // Not a single day timetable -> can't select special day.
      previewTimetablesPage.priorityForm
        .getSpecialDayPriorityButton()
        .should('not.be.visible');
      previewTimetablesPage.getTitle().shouldHaveText('Lähtöjä: 8');

      previewTimetablesPage.priorityForm.setAsStandard();
      previewTimetablesPage
        .getVehicleScheduleFrameBlockByLabel('0901')
        .within(() => {
          vehicleScheduleFrameBlocksView
            .getFrameTitleRow()
            .should('contain', '0901')
            .and('contain', '1.4.2023 - 30.6.2023')
            .and('contain', '2 autokiertoa');
          vehicleScheduleFrameBlocksView.getTables().should('have.length', 2);
          vehicleScheduleFrameBlocksView.getNthTable(0).within(() => {
            blockVehicleJourneysTable
              .getTitleRow()
              .should('contain', '901 - 1')
              .and('contain', 'Matala A2 -bussi');
            blockVehicleJourneysTable.getToggleShowTableButton().click();
            blockVehicleJourneysTable.getTableRows().should('have.length', 4);

            blockVehicleJourneysTable.getNthTableRow(0).within(() => {
              vehicleJourneyRow.getDirectionBadge().shouldHaveText('1');
              vehicleJourneyRow.getLabel().shouldHaveText('901');
              vehicleJourneyRow.getDayType().shouldHaveText('Lauantai');
              vehicleJourneyRow.getStartTime().shouldHaveText('07:15');
              vehicleJourneyRow.getEndTime().shouldHaveText('07:39');
              vehicleJourneyRow.getContractNumber().shouldHaveText('CONTRACT');
            });

            blockVehicleJourneysTable.getNthTableRow(1).within(() => {
              vehicleJourneyRow.getDirectionBadge().shouldHaveText('2');
              vehicleJourneyRow.getLabel().shouldHaveText('901');
              vehicleJourneyRow.getDayType().shouldHaveText('Lauantai');
              vehicleJourneyRow.getStartTime().shouldHaveText('07:40');
              vehicleJourneyRow.getEndTime().shouldHaveText('07:58');
              vehicleJourneyRow.getContractNumber().shouldHaveText('CONTRACT');
            });

            blockVehicleJourneysTable.getNthTableRow(2).within(() => {
              vehicleJourneyRow.getDirectionBadge().shouldHaveText('1');
              vehicleJourneyRow.getLabel().shouldHaveText('901');
              vehicleJourneyRow.getDayType().shouldHaveText('Lauantai');
              vehicleJourneyRow.getStartTime().shouldHaveText('08:00');
              vehicleJourneyRow.getEndTime().shouldHaveText('08:24');
              vehicleJourneyRow.getContractNumber().shouldHaveText('CONTRACT');
            });

            blockVehicleJourneysTable.getNthTableRow(3).within(() => {
              vehicleJourneyRow.getDirectionBadge().shouldHaveText('2');
              vehicleJourneyRow.getLabel().shouldHaveText('901');
              vehicleJourneyRow.getDayType().shouldHaveText('Lauantai');
              vehicleJourneyRow.getStartTime().shouldHaveText('08:25');
              vehicleJourneyRow.getEndTime().shouldHaveText('08:43');
              vehicleJourneyRow.getContractNumber().shouldHaveText('CONTRACT');
            });
          });

          vehicleScheduleFrameBlocksView.getNthTable(1).within(() => {
            blockVehicleJourneysTable
              .getTitleRow()
              .should('contain', '901 - 2')
              .and('contain', 'A1 sähköbussi');
            blockVehicleJourneysTable.getToggleShowTableButton().click();
            blockVehicleJourneysTable.getTableRows().should('have.length', 4);

            blockVehicleJourneysTable.getNthTableRow(0).within(() => {
              vehicleJourneyRow.getDirectionBadge().shouldHaveText('1');
              vehicleJourneyRow.getLabel().shouldHaveText('901');
              vehicleJourneyRow.getDayType().shouldHaveText('Lauantai');
              vehicleJourneyRow.getStartTime().shouldHaveText('07:35');
              vehicleJourneyRow.getEndTime().shouldHaveText('07:59');
              vehicleJourneyRow.getContractNumber().shouldHaveText('CONTRACT');
            });

            blockVehicleJourneysTable.getNthTableRow(1).within(() => {
              vehicleJourneyRow.getDirectionBadge().shouldHaveText('2');
              vehicleJourneyRow.getLabel().shouldHaveText('901');
              vehicleJourneyRow.getDayType().shouldHaveText('Lauantai');
              vehicleJourneyRow.getStartTime().shouldHaveText('08:00');
              vehicleJourneyRow.getEndTime().shouldHaveText('08:18');
              vehicleJourneyRow.getContractNumber().shouldHaveText('CONTRACT');
            });

            blockVehicleJourneysTable.getNthTableRow(2).within(() => {
              vehicleJourneyRow.getDirectionBadge().shouldHaveText('1');
              vehicleJourneyRow.getLabel().shouldHaveText('901');
              vehicleJourneyRow.getDayType().shouldHaveText('Lauantai');
              vehicleJourneyRow.getStartTime().shouldHaveText('08:20');
              vehicleJourneyRow.getEndTime().shouldHaveText('08:44');
              vehicleJourneyRow.getContractNumber().shouldHaveText('CONTRACT');
            });

            blockVehicleJourneysTable.getNthTableRow(3).within(() => {
              vehicleJourneyRow.getDirectionBadge().shouldHaveText('2');
              vehicleJourneyRow.getLabel().shouldHaveText('901');
              vehicleJourneyRow.getDayType().shouldHaveText('Lauantai');
              vehicleJourneyRow.getStartTime().shouldHaveText('08:45');
              vehicleJourneyRow.getEndTime().shouldHaveText('09:03');
              vehicleJourneyRow.getContractNumber().shouldHaveText('CONTRACT');
            });
          });
        });

      previewTimetablesPage.getSaveButton().click();
      importTimetablesPage.toast.expectSuccessToast(
        'Aikataulujen tuonti onnistui!',
      );

      // Navigate to timetables page
      navbar.getTimetablesLink().click();
      timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
      searchResultsPage.getRouteLineTableRowByLabel('901').click();

      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-04-29',
      );

      // Check the imported timetable
      routeTimetablesSection
        .getRouteSectionHeadingButton('901', RouteDirectionEnum.Outbound)
        .click();
      vehicleScheduleDetailsPage.getArrivalTimesSwitch().click();

      routeTimetablesSection
        .getRouteSection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          const { row } = passingTimesByStopTable;
          const { passingTime } = row;
          // E2E001
          passingTimesByStopTable.getStopRow('E2E001').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthDepartureTime(0, '15');
              passingTime.assertNthDepartureTime(1, '35');
            });
            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthDepartureTime(0, '00');
              passingTime.assertNthDepartureTime(1, '20');
            });
          });
          // E2E002
          passingTimesByStopTable.getStopRow('E2E002').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthDepartureTime(0, '22');
              passingTime.assertNthDepartureTime(1, '42');
            });
            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthDepartureTime(0, '07');
              passingTime.assertNthDepartureTime(1, '27');
            });
          });
          // E2E003
          passingTimesByStopTable.getStopRow('E2E003').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthArrivalTime(0, '29');
              passingTime.assertNthDepartureTime(0, '30');
              passingTime.assertNthArrivalTime(1, '49');
              passingTime.assertNthDepartureTime(1, '50');
            });
            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthArrivalTime(0, '14');
              passingTime.assertNthDepartureTime(0, '15');
              passingTime.assertNthArrivalTime(1, '34');
              passingTime.assertNthDepartureTime(1, '35');
            });
          });
          // E2E004
          passingTimesByStopTable.getStopRow('E2E004').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthDepartureTime(0, '34');
              passingTime.assertNthDepartureTime(1, '54');
            });
            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthDepartureTime(0, '19');
              passingTime.assertNthDepartureTime(1, '39');
            });
          });
          // E2E005
          passingTimesByStopTable.getStopRow('E2E005').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthDepartureTime(0, '39');
              passingTime.assertNthDepartureTime(1, '59');
            });
            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthDepartureTime(0, '24');
              passingTime.assertNthDepartureTime(1, '44');
            });
          });
        });

      routeTimetablesSection
        .getRouteSection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          const { row } = passingTimesByStopTable;
          const { passingTime } = row;
          // E2E005
          passingTimesByStopTable.getStopRow('E2E005').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(1);
              passingTime.assertNthDepartureTime(0, '40');
            });
            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(3);
              passingTime.assertNthDepartureTime(0, '00');
              passingTime.assertNthDepartureTime(1, '25');
              passingTime.assertNthDepartureTime(2, '45');
            });
          });
          // E2E006
          passingTimesByStopTable.getStopRow('E2E006').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(1);
              passingTime.assertNthDepartureTime(0, '47');
            });
            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(3);
              passingTime.assertNthDepartureTime(0, '07');
              passingTime.assertNthDepartureTime(1, '32');
              passingTime.assertNthDepartureTime(2, '52');
            });
          });
          // E2E007
          passingTimesByStopTable.getStopRow('E2E007').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(1);
              passingTime.assertNthArrivalTime(0, '50');
              passingTime.assertNthDepartureTime(0, '51');
            });
            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(3);
              passingTime.assertNthArrivalTime(0, '10');
              passingTime.assertNthDepartureTime(0, '11');
              passingTime.assertNthArrivalTime(1, '35');
              passingTime.assertNthDepartureTime(1, '36');
              passingTime.assertNthArrivalTime(2, '55');
              passingTime.assertNthDepartureTime(2, '56');
            });
          });
          // E2E008
          passingTimesByStopTable.getStopRow('E2E008').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(1);
              passingTime.assertNthDepartureTime(0, '54');
            });
            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(3);
              passingTime.assertNthDepartureTime(0, '14');
              passingTime.assertNthDepartureTime(1, '39');
              passingTime.assertNthDepartureTime(2, '59');
            });
          });
          // E2E009
          passingTimesByStopTable.getStopRow('E2E009').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(1);
              passingTime.assertNthDepartureTime(0, '58');
            });
            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthDepartureTime(0, '18');
              passingTime.assertNthDepartureTime(1, '43');
            });
            // Hour 09
            row.getTimeContainerByHour('9').within(() => {
              passingTime.assertTotalMinuteCount(1);
              passingTime.assertNthDepartureTime(0, '03');
            });
          });
        });
    },
  );

  describe('Multiple import files', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it('Should import two timetables at the same time', () => {
      const { vehicleScheduleFrameBlocksView } = previewTimetablesPage;
      const { blockVehicleJourneysTable } = vehicleScheduleFrameBlocksView;

      const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';
      const IMPORT_FILENAME_2 = 'hastusImportSunday901June2023.exp';

      cy.visit('/timetables');
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFilesToImport([
        IMPORT_FILENAME,
        IMPORT_FILENAME_2,
      ]);
      importTimetablesPage.getUploadButton().click();

      importTimetablesPage.toast.expectSuccessToast(
        `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
      );
      importTimetablesPage.toast.expectSuccessToast(
        `Tiedoston ${IMPORT_FILENAME_2} lataus onnistui`,
      );

      importTimetablesPage.clickPreviewButton();
      // Not a single day timetable -> can't select special day.
      previewTimetablesPage.priorityForm
        .getSpecialDayPriorityButton()
        .should('not.be.visible');
      previewTimetablesPage.priorityForm.setAsStandard();

      previewTimetablesPage
        .getVehicleScheduleFrameBlockByLabel('0911')
        .within(() => {
          vehicleScheduleFrameBlocksView
            .getFrameTitleRow()
            .should('contain', '0911')
            .and('contain', '1.4.2023 - 30.6.2023')
            .and('contain', '1 autokiertoa');

          vehicleScheduleFrameBlocksView.getNthTable(0).within(() => {
            blockVehicleJourneysTable
              .getTitleRow()
              .should('contain', '901 - 1')
              .and('contain', 'Matala A2 -bussi');
          });
        });

      previewTimetablesPage
        .getVehicleScheduleFrameBlockByLabel('0901')
        .within(() => {
          vehicleScheduleFrameBlocksView
            .getFrameTitleRow()
            .should('contain', '0901')
            .and('contain', '1.4.2023 - 30.6.2023')
            .and('contain', '2 autokiertoa');
          vehicleScheduleFrameBlocksView.getNthTable(0).within(() => {
            blockVehicleJourneysTable
              .getTitleRow()
              .should('contain', '901 - 1')
              .and('contain', 'Matala A2 -bussi');
          });

          vehicleScheduleFrameBlocksView.getNthTable(1).within(() => {
            blockVehicleJourneysTable
              .getTitleRow()
              .should('contain', '901 - 2')
              .and('contain', 'A1 sähköbussi');
          });
        });

      previewTimetablesPage.getSaveButton().click();
      importTimetablesPage.toast.expectSuccessToast(
        'Aikataulujen tuonti onnistui!',
      );
    });
  });

  describe('Temporary timetables', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it('Should import a Hastus timetable as temporary', () => {
      const { vehicleScheduleFrameBlocksView } = previewTimetablesPage;

      const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';

      cy.visit('/');
      navbar.getTimetablesLink().click();
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFilesToImport([IMPORT_FILENAME]);
      importTimetablesPage.getUploadButton().click();

      importTimetablesPage.toast.expectSuccessToast(
        `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
      );

      importTimetablesPage.clickPreviewButton();
      // Not a single day timetable -> can't select special day.
      previewTimetablesPage.priorityForm
        .getSpecialDayPriorityButton()
        .should('not.be.visible');
      previewTimetablesPage.priorityForm.setAsTemporary();

      previewTimetablesPage
        .getVehicleScheduleFrameBlockByLabel('0901')
        .within(() => {
          vehicleScheduleFrameBlocksView
            .getFrameTitleRow()
            .should('contain', '0901')
            .and('contain', '1.4.2023 - 30.6.2023')
            .and('contain', '2 autokiertoa');
        });

      previewTimetablesPage.getSaveButton().click();
      importTimetablesPage.toast.expectSuccessToast(
        'Aikataulujen tuonti onnistui!',
      );

      // Navigate to timetables page
      navbar.getTimetablesLink().click();
      timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
      searchResultsPage.getRouteLineTableRowByLabel('901').click();

      // Check that the original Standard priority Saturday timetable is unchanged
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-01-07',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:05 ... 09:40');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:30 ... 10:05');
        });

      // Check that the imported Temporary priority timetable is now in effect
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-04-01',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.4.2023 - 30.6.2023')
            .and('contain', '4 lähtöä')
            .and('contain', '07:15 ... 08:20');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.4.2023 - 30.6.2023')
            .and('contain', '4 lähtöä')
            .and('contain', '07:40 ... 08:45');
        });
    });
  });

  describe('Draft timetables', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it('Should import a Hastus timetable as a draft', () => {
      timetableVersionsPage = new TimetableVersionsPage();
      const { vehicleScheduleFrameBlocksView } = previewTimetablesPage;
      const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';

      cy.visit('/timetables');
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
      importTimetablesPage.getUploadButton().click();

      importTimetablesPage.toast.expectSuccessToast(
        `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
      );

      importTimetablesPage.clickPreviewButton();
      // Not a single day timetable -> can't select special day.
      previewTimetablesPage.priorityForm
        .getSpecialDayPriorityButton()
        .should('not.be.visible');

      previewTimetablesPage.priorityForm.setAsDraft();
      previewTimetablesPage
        .getVehicleScheduleFrameBlockByLabel('0901')
        .within(() => {
          vehicleScheduleFrameBlocksView
            .getFrameTitleRow()
            .should('contain', '0901')
            .and('contain', '1.4.2023 - 30.6.2023')
            .and('contain', '2 autokiertoa');
        });

      previewTimetablesPage.getSaveButton().click();
      importTimetablesPage.toast.expectSuccessToast(
        'Aikataulujen tuonti onnistui!',
      );

      // Navigate to timetables page
      navbar.getTimetablesLink().click();
      timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
      searchResultsPage.getRouteLineTableRowByLabel('901').click();

      // Check the original Standard priority Saturday timetable within timerange of the draft
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-04-01',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:05 ... 09:40');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:30 ... 10:05');
        });

      // Verify that the draft timetable is listed on the timetable versions page
      vehicleScheduleDetailsPage.getShowVersionsButton().click();
      timetableVersionsPage.timeRangeControl.setTimeRange(
        '2023-06-01',
        '2023-06-30',
      );
      timetableVersionsPage.timetableVersionTable
        .getRows()
        .should('have.length', 3);
      timetableVersionsPage.timetableVersionTable
        .getNthRow(0)
        .should('contain', 'Perusversio')
        .and('contain', 'Lauantai')
        .and('contain', '1.1.2023')
        .and('contain', '31.12.2023')
        .and('contain', '901');

      timetableVersionsPage.timetableVersionTable
        .getNthRow(1)
        .should('contain', 'Perusversio')
        .and('contain', 'Maanantai - Perjantai')
        .and('contain', '1.1.2023')
        .and('contain', '31.12.2023')
        .and('contain', '901');

      timetableVersionsPage.timetableVersionTable
        .getNthRow(2)
        .should('contain', 'Luonnos')
        .and('contain', 'Lauantai')
        .and('contain', '1.4.2023')
        .and('contain', '30.6.2023')
        .and('contain', '901');
    });
  });

  describe('Special days', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it('Should import a special day timetable for a route', () => {
      const { vehicleScheduleFrameBlocksView } = previewTimetablesPage;
      const confirmTimetablesImportModal = new ConfirmTimetablesImportModal();

      const IMPORT_FILENAME = 'hastusImportSaturday901specialDay2023.exp';

      cy.visit('/timetables');
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
      importTimetablesPage.getUploadButton().click();

      importTimetablesPage.toast.expectSuccessToast(
        `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
      );

      // Check that UI component states are correct in the confirmation modal
      importTimetablesPage.getSaveButton().click();
      confirmTimetablesImportModal.confirmTimetablesImportForm.priorityForm
        .getDraftPriorityButton()
        .should('be.disabled');
      confirmTimetablesImportModal.confirmTimetablesImportForm.priorityForm
        .getStandardPriorityButton()
        .should('be.disabled');
      confirmTimetablesImportModal.confirmTimetablesImportForm.priorityForm
        .getTemporaryPriorityButton()
        .should('be.disabled');
      confirmTimetablesImportModal.confirmTimetablesImportForm.priorityForm
        .getSpecialDayPriorityButton()
        .should('be.visible')
        .and('be.checked')
        .and('not.be.disabled');

      confirmTimetablesImportModal.confirmTimetablesImportForm
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
        .getSpecialDayPriorityButton()
        .should('be.visible')
        .and('be.checked')
        .and('not.be.disabled');

      previewTimetablesPage
        .getVehicleScheduleFrameBlockByLabel('0912')
        .within(() => {
          vehicleScheduleFrameBlocksView
            .getFrameTitleRow()
            .should('contain', '0912')
            .and('contain', '1.4.2023 - 1.4.2023')
            .and('contain', '1 autokiertoa');
        });

      previewTimetablesPage.getSaveButton().click();
      importTimetablesPage.toast.expectSuccessToast(
        'Aikataulujen tuonti onnistui!',
      );

      // Navigate to timetables page
      navbar.getTimetablesLink().click();
      timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
      searchResultsPage.getRouteLineTableRowByLabel('901').click();

      // Check the original Standard priority Saturday timetable is unchanged
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-01-07',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:05 ... 09:40');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:30 ... 10:05');
        });

      // Check the imported timetable on the date of the special day
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-04-01',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.4.2023 - 1.4.2023')
            .and('contain', '2 lähtöä')
            .and('contain', '07:15 ... 08:00');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.4.2023 - 1.4.2023')
            .and('contain', '2 lähtöä')
            .and('contain', '07:40 ... 08:25');
        });
    });

    it('Should show an error message when trying to import a normal timetable and a special day timetable at the same time', () => {
      const IMPORT_FILENAME = 'hastusImportSaturday901specialDay2023.exp';
      const IMPORT_FILENAME_2 = 'hastusImportSaturday901Apr-Jun2023.exp';

      cy.visit('/timetables');
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFilesToImport([
        IMPORT_FILENAME,
        IMPORT_FILENAME_2,
      ]);
      importTimetablesPage.getUploadButton().click();

      importTimetablesPage.toast.expectSuccessToast(
        `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
      );

      importTimetablesPage.getSaveButton().click();
      cy.contains(
        'Tuoduissa aikatauluissa on erityispäivien lisäksi myös muita aikatauluja.',
      );
      cy.contains(
        'Tallennus ei ole mahdollista. Keskeytä aikataulujen tuonti ja tuo yhden päivän pituiset aikataulut erikseen.',
      );
    });
  });

  describe('Cancel timetable import', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it('Should successfully cancel a timetable import', () => {
      timetableVersionsPage = new TimetableVersionsPage();

      const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';

      cy.visit('/timetables');
      // Import a timetable for the route
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
      importTimetablesPage.getUploadButton().click();

      importTimetablesPage.toast.expectSuccessToast(
        `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
      );
      importTimetablesPage.getAbortButton().click();
      importTimetablesPage.confirmationDialog.getConfirmButton().click();
      importTimetablesPage.toast.expectSuccessToast(
        'Aikataulujen tuonti keskeytetty',
      );

      importTimetablesPage.verifyImportFormButtonsDisabled();

      // Navigate to timetables page
      navbar.getTimetablesLink().click();
      timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
      searchResultsPage.getRouteLineTableRowByLabel('901').click();

      // Check the original Standard priority Saturday timetable is unchanged
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-01-07',
      );

      // Check the imported timetable on a Saturday, which is the day type of the timetable in the import file
      vehicleScheduleDetailsPage.getShowAllValidSwitch().click();

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('MP')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '06:05 ... 08:40');

          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:05 ... 09:40');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('MP')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '06:30 ... 09:05');

          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:30 ... 10:05');
        });
    });
  });

  describe('Failing hastus import', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it('should display an error dialog when Hastus import fails', () => {
      const errorModal = new ErrorModal();

      // In the file there is one error on line 9, E2E004 should be E2E003, which
      // should cause error
      const IMPORT_FILENAME = 'hastusImportErronous901.exp';

      cy.visit('/timetables');
      // Import a timetable for the exported route
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
      // Import a timetable for the exported route
      navbar.getTimetablesLink().click();
      timetablesMainPage.getImportButton().click();
      importTimetablesPage.selectFileToImport(IMPORT_FILENAME);

      errorModal.getModal().should('not.exist');

      importTimetablesPage.getUploadButton().click();
      cy.wait('@hastusImport').its('response.statusCode').should('equal', 400);

      // Verify that error dialog is shown with correct contents.
      errorModal.getModal().should('exist');
      errorModal.errorModalItem
        .getItem()
        .should('be.visible')
        .should('have.length', 1);
      errorModal.errorModalItem
        .getTitle()
        .should('contain', `Tiedoston ${IMPORT_FILENAME} lataus epäonnistui`);
      errorModal.errorModalItem
        .getDescription()
        .should(
          'contain',
          'Kulkukuviota, jonka pysäkit vastaavat Hastuksen lähtöä, ei löytynyt. Tarkista, onko reitistä olemassa versio, jota ei ole vielä viety Hastukseen.',
        );
      errorModal.errorModalItem
        .getAdditionalDetails()
        .should(
          'contain',
          'Could not find matching journey pattern reference whose stop points correspond to the Hastus trip.',
        );

      errorModal.getCloseButton().click();
      errorModal.getModal().should('not.exist');
    });
  });
});
