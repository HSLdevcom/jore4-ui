import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { getClonedBaseTimetableDataInput } from '../datasets/timetables';
import { Tag } from '../enums';
import {
  ImportTimetablesPage,
  Navbar,
  PassingTimesByStopTable,
  PreviewTimetablesPage,
  RouteTimetablesSection,
  SearchResultsPage,
  TimetablesMainPage,
  VehicleScheduleDetailsPage
} from '../pageObjects';
import { ConfirmTimetablesImportModal } from '../pageObjects/timetables/import/ConfirmTimetablesImportModal';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

describe('Timetable replacement and combination', () => {
  let timetablesMainPage: TimetablesMainPage;
  let importTimetablesPage: ImportTimetablesPage;
  let previewTimetablesPage: PreviewTimetablesPage;
  let vehicleScheduleDetailsPage: VehicleScheduleDetailsPage;
  let routeTimetablesSection: RouteTimetablesSection;
  let searchResultsPage: SearchResultsPage;
  let navbar: Navbar;
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
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();
    routeTimetablesSection = new RouteTimetablesSection();
    searchResultsPage = new SearchResultsPage();
    navbar = new Navbar();

    cy.setupTests();
    cy.mockLogin();
  });

  describe('Importing(replace) timetable with overlapping validity', () => {
    beforeEach(() => {
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
    });

    it(
      'Should import timetable data using preview and replace existing data',
      { tags: [Tag.Smoke, Tag.Timetables, Tag.HastusImport] },
      () => {
        const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';
        cy.visit(
          '/timetables/lines/08d1fa6b-440c-421e-ad4d-0778d65afe60?observationDate=2023-04-01',
        );

        // Check existing timetable validity
        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
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

        // Navigate to timetables import and import new timetable that overlaps with the existing
        navbar.getTimetablesLink().click();
        timetablesMainPage.getImportButton().click();
        importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
        importTimetablesPage.getUploadButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
        );

        importTimetablesPage.clickPreviewButton();
        previewTimetablesPage.priorityForm.setAsStandard();
        previewTimetablesPage.getSaveButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          'Aikataulujen tuonti onnistui!',
        );

        // Navigate to timetables page
        navbar.getTimetablesLink().click();
        timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
        searchResultsPage.getRouteLineTableRowByLabel('901').click();

        // Check that the imported timetable is in effect on the first day of its validity
        vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
          '2023-04-01',
        );

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
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

        // Check that the original timetables validity ends the day before
        vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
          '2023-03-25',
        );

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .should('contain', '1.1.2023 - 31.3.2023')
              .and('contain', '6 lähtöä')
              .and('contain', '07:05 ... 09:40');
          });

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .should('contain', '1.1.2023 - 31.3.2023')
              .and('contain', '6 lähtöä')
              .and('contain', '07:30 ... 10:05');
          });
      },
    );

    it(
      'Should import timetable data without preview and replace existing data',
      { tags: [Tag.Smoke, Tag.Timetables, Tag.HastusImport] },
      () => {
        const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';
        const confirmTimetablesImportModal = new ConfirmTimetablesImportModal();
        cy.visit(
          '/timetables/lines/08d1fa6b-440c-421e-ad4d-0778d65afe60?observationDate=2023-04-01',
        );

        // Check existing timetable validity
        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
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

        // Navigate to timetables import and import new timetable that overlaps with the existing
        navbar.getTimetablesLink().click();
        timetablesMainPage.getImportButton().click();
        importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
        importTimetablesPage.getUploadButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
        );

        importTimetablesPage.getSaveButton().click();
        confirmTimetablesImportModal.confirmTimetablesImportForm
          .getReplaceRadioButton()
          .should('be.checked');
        confirmTimetablesImportModal.confirmTimetablesImportForm.priorityForm.setAsStandard();

        confirmTimetablesImportModal.confirmTimetablesImportForm
          .getSaveButton()
          .click();

        importTimetablesPage.toast.checkSuccessToastHasMessage(
          'Aikataulujen tuonti onnistui!',
        );
      },
    );
  });

  describe('Combining imported timetable with existing', () => {
    beforeEach(() => {
      // Modify existing data so that the validities match with the import file
      cy.task('insertHslTimetablesDatasetToDb', {
        ...baseTimetableDataInput,
        _vehicle_schedule_frames: {
          // eslint-disable-next-line no-underscore-dangle
          ...baseTimetableDataInput._vehicle_schedule_frames,
          year2023Sat: {
            // eslint-disable-next-line no-underscore-dangle
            ...baseTimetableDataInput._vehicle_schedule_frames.year2023Sat,
            validity_start: DateTime.fromISO('2023-04-01'),
            validity_end: DateTime.fromISO('2023-06-30'),
          },
        },
      });
    });

    it(
      'Should import timetable data using preview and combine existing data',
      { tags: [Tag.Timetables, Tag.HastusImport] },
      () => {
        const passingTimesByStopTable = new PassingTimesByStopTable();
        const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';

        cy.visit(
          '/timetables/lines/08d1fa6b-440c-421e-ad4d-0778d65afe60?observationDate=2023-04-01',
        );

        // Check existing timetable validity
        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .should('contain', '1.4.2023 - 30.6.2023')
              .and('contain', '6 lähtöä')
              .and('contain', '07:05 ... 09:40');
          });

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .should('contain', '1.4.2023 - 30.6.2023')
              .and('contain', '6 lähtöä')
              .and('contain', '07:30 ... 10:05');
          });

        // Navigate to timetables import and import new timetable with combine
        navbar.getTimetablesLink().click();
        timetablesMainPage.getImportButton().click();
        importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
        importTimetablesPage.getUploadButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
        );

        importTimetablesPage.clickPreviewButton();
        previewTimetablesPage.priorityForm.setAsStandard();
        previewTimetablesPage.confirmPreviewedTimetablesImportForm
          .getCombineRadioButton()
          .check();

        previewTimetablesPage.getSaveButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          'Aikataulujen tuonti onnistui!',
        );

        // Navigate to timetables page
        navbar.getTimetablesLink().click();
        timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
        searchResultsPage.getRouteLineTableRowByLabel('901').click();

        // Check that the existing and imported timetables are now combined
        vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
          '2023-04-01',
        );

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .should('contain', '1.4.2023 - 30.6.2023')
              .and('contain', '10 lähtöä')
              .and('contain', '07:05 ... 09:40');
          });

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .should('contain', '1.4.2023 - 30.6.2023')
              .and('contain', '10 lähtöä')
              .and('contain', '07:30 ... 10:05');
          });

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
                passingTime.assertTotalMinuteCount(5);
                passingTime.assertNthDepartureTime(0, '05');
                passingTime.assertNthDepartureTime(1, '15');
                passingTime.assertNthDepartureTime(2, '15');
                passingTime.assertNthDepartureTime(3, '35');
                passingTime.assertNthDepartureTime(4, '50');
              });
              // Hour 08
              row.getTimeContainerByHour('8').within(() => {
                passingTime.assertTotalMinuteCount(3);
                passingTime.assertNthDepartureTime(0, '00');
                passingTime.assertNthDepartureTime(1, '00');
                passingTime.assertNthDepartureTime(2, '20');
              });
              // Hour 09
              row.getTimeContainerByHour('9').within(() => {
                passingTime.assertTotalMinuteCount(2);
                passingTime.assertNthDepartureTime(0, '30');
                passingTime.assertNthDepartureTime(1, '40');
              });
            });
            // E2E002
            passingTimesByStopTable.getStopRow('E2E002').within(() => {
              // Hour 07
              row.getTimeContainerByHour('7').within(() => {
                passingTime.assertTotalMinuteCount(5);
                passingTime.assertNthDepartureTime(0, '12');
                passingTime.assertNthDepartureTime(1, '22');
                passingTime.assertNthDepartureTime(2, '22');
                passingTime.assertNthDepartureTime(3, '42');
                passingTime.assertNthDepartureTime(4, '57');
              });
              // Hour 08
              row.getTimeContainerByHour('8').within(() => {
                passingTime.assertTotalMinuteCount(3);

                passingTime.assertNthDepartureTime(0, '07');
                passingTime.assertNthDepartureTime(1, '07');
                passingTime.assertNthDepartureTime(2, '27');
              });
              // Hour 09
              row.getTimeContainerByHour('9').within(() => {
                passingTime.assertTotalMinuteCount(2);
                passingTime.assertNthDepartureTime(0, '35');
                passingTime.assertNthDepartureTime(1, '45');
              });
            });
            // E2E003
            passingTimesByStopTable.getStopRow('E2E003').within(() => {
              // Hour 07
              row.getTimeContainerByHour('7').within(() => {
                passingTime.assertTotalMinuteCount(4);
                passingTime.assertNthArrivalTime(0, '19');
                passingTime.assertNthDepartureTime(0, '20');
                passingTime.assertNthArrivalTime(1, '29');
                passingTime.assertNthDepartureTime(1, '30');
                passingTime.assertNthArrivalTime(2, '29');
                passingTime.assertNthDepartureTime(2, '30');
                passingTime.assertNthArrivalTime(3, '49');
                passingTime.assertNthDepartureTime(3, '50');
              });
              // Hour 08
              row.getTimeContainerByHour('8').within(() => {
                passingTime.assertTotalMinuteCount(4);
                passingTime.assertNthArrivalTime(0, '00');
                passingTime.assertNthDepartureTime(0, '01');
                passingTime.assertNthArrivalTime(1, '10');
                passingTime.assertNthDepartureTime(1, '11');
                passingTime.assertNthArrivalTime(2, '14');
                passingTime.assertNthDepartureTime(2, '15');
                passingTime.assertNthArrivalTime(3, '34');
                passingTime.assertNthDepartureTime(3, '35');
              });
              // Hour 09
              row.getTimeContainerByHour('9').within(() => {
                passingTime.assertTotalMinuteCount(2);
                passingTime.assertNthArrivalTime(0, '42');
                passingTime.assertNthDepartureTime(0, '46');
                passingTime.assertNthArrivalTime(1, '52');
                passingTime.assertNthDepartureTime(1, '56');
              });
            });
            // E2E004
            passingTimesByStopTable.getStopRow('E2E004').within(() => {
              // Hour 07
              row.getTimeContainerByHour('7').within(() => {
                passingTime.assertTotalMinuteCount(4);
                passingTime.assertNthArrivalTime(0, '24');
                passingTime.assertNthDepartureTime(0, '25');
                passingTime.assertNthDepartureTime(1, '34');
                passingTime.assertNthArrivalTime(2, '34');
                passingTime.assertNthDepartureTime(2, '35');
                passingTime.assertNthDepartureTime(3, '54');
              });
              // Hour 08
              row.getTimeContainerByHour('8').within(() => {
                passingTime.assertTotalMinuteCount(4);
                passingTime.assertNthArrivalTime(0, '05');
                passingTime.assertNthDepartureTime(0, '06');
                passingTime.assertNthArrivalTime(1, '15');
                passingTime.assertNthDepartureTime(1, '16');
                passingTime.assertNthDepartureTime(2, '19');
                passingTime.assertNthDepartureTime(3, '39');
              });
              // Hour 09
              row.getTimeContainerByHour('9').within(() => {
                passingTime.assertTotalMinuteCount(1);
                passingTime.assertNthArrivalTime(0, '50');
                passingTime.assertNthDepartureTime(0, '51');
              });
              // Hour 10
              row.getTimeContainerByHour('10').within(() => {
                passingTime.assertTotalMinuteCount(1);
                passingTime.assertNthArrivalTime(0, '00');
                passingTime.assertNthDepartureTime(0, '01');
              });
            });
            // E2E005
            passingTimesByStopTable.getStopRow('E2E005').within(() => {
              // Hour 07
              row.getTimeContainerByHour('7').within(() => {
                passingTime.assertTotalMinuteCount(4);
                passingTime.assertNthDepartureTime(0, '29');
                passingTime.assertNthDepartureTime(1, '39');
                passingTime.assertNthDepartureTime(2, '39');
                passingTime.assertNthDepartureTime(3, '59');
              });
              // Hour 08
              row.getTimeContainerByHour('8').within(() => {
                passingTime.assertTotalMinuteCount(4);
                passingTime.assertNthDepartureTime(0, '09');
                passingTime.assertNthDepartureTime(1, '19');
                passingTime.assertNthDepartureTime(2, '24');
                passingTime.assertNthDepartureTime(3, '44');
              });
              // Hour 09
              row.getTimeContainerByHour('9').within(() => {
                passingTime.assertTotalMinuteCount(1);
                passingTime.assertNthDepartureTime(0, '53');
              });
              // Hour 10
              row.getTimeContainerByHour('10').within(() => {
                passingTime.assertTotalMinuteCount(1);
                passingTime.assertNthDepartureTime(0, '03');
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
                passingTime.assertTotalMinuteCount(3);
                passingTime.assertNthDepartureTime(0, '30');
                passingTime.assertNthDepartureTime(1, '40');
                passingTime.assertNthDepartureTime(2, '40');
              });
              // Hour 08
              row.getTimeContainerByHour('8').within(() => {
                passingTime.assertTotalMinuteCount(5);
                passingTime.assertNthDepartureTime(0, '00');
                passingTime.assertNthDepartureTime(1, '10');
                passingTime.assertNthDepartureTime(2, '20');
                passingTime.assertNthDepartureTime(3, '25');
                passingTime.assertNthDepartureTime(4, '45');
              });
              // Hour 09
              row.getTimeContainerByHour('9').within(() => {
                passingTime.assertTotalMinuteCount(1);
                passingTime.assertNthDepartureTime(0, '55');
              });
              // Hour 10
              row.getTimeContainerByHour('10').within(() => {
                passingTime.assertTotalMinuteCount(1);
                passingTime.assertNthDepartureTime(0, '05');
              });
            });
            // E2E006
            passingTimesByStopTable.getStopRow('E2E006').within(() => {
              // Hour 07
              row.getTimeContainerByHour('7').within(() => {
                passingTime.assertTotalMinuteCount(3);
                passingTime.assertNthDepartureTime(0, '37');
                passingTime.assertNthDepartureTime(1, '47');
                passingTime.assertNthDepartureTime(2, '47');
              });
              // Hour 08
              row.getTimeContainerByHour('8').within(() => {
                passingTime.assertTotalMinuteCount(5);
                passingTime.assertNthDepartureTime(0, '07');
                passingTime.assertNthDepartureTime(1, '17');
                passingTime.assertNthDepartureTime(2, '27');
                passingTime.assertNthDepartureTime(3, '32');
                passingTime.assertNthDepartureTime(4, '52');
              });
              // Hour 9 No departures
              // Hour 10
              row.getTimeContainerByHour('10').within(() => {
                passingTime.assertTotalMinuteCount(2);
                passingTime.assertNthDepartureTime(0, '00');
                passingTime.assertNthDepartureTime(1, '10');
              });
            });
            // E2E007
            passingTimesByStopTable.getStopRow('E2E007').within(() => {
              // Hour 07
              row.getTimeContainerByHour('7').within(() => {
                passingTime.assertTotalMinuteCount(3);
                passingTime.assertNthArrivalTime(0, '40');
                passingTime.assertNthDepartureTime(0, '41');
                passingTime.assertNthArrivalTime(1, '50');
                passingTime.assertNthDepartureTime(1, '51');
                passingTime.assertNthArrivalTime(2, '50');
                passingTime.assertNthDepartureTime(2, '51');
              });
              // Hour 08
              row.getTimeContainerByHour('8').within(() => {
                passingTime.assertTotalMinuteCount(5);
                passingTime.assertNthArrivalTime(0, '10');
                passingTime.assertNthDepartureTime(0, '11');
                passingTime.assertNthArrivalTime(1, '21');
                passingTime.assertNthDepartureTime(1, '22');
                passingTime.assertNthArrivalTime(2, '31');
                passingTime.assertNthDepartureTime(2, '32');
                passingTime.assertNthArrivalTime(3, '35');
                passingTime.assertNthDepartureTime(3, '36');
                passingTime.assertNthArrivalTime(4, '55');
                passingTime.assertNthDepartureTime(4, '56');
              });
              // Hour 09 No departures
              // Hour 10
              row.getTimeContainerByHour('10').within(() => {
                passingTime.assertTotalMinuteCount(2);
                passingTime.assertNthArrivalTime(0, '04');
                passingTime.assertNthDepartureTime(0, '05');
                passingTime.assertNthArrivalTime(1, '14');
                passingTime.assertNthDepartureTime(1, '15');
              });
            });
            // E2E008
            passingTimesByStopTable.getStopRow('E2E008').within(() => {
              // Hour 07
              row.getTimeContainerByHour('7').within(() => {
                passingTime.assertTotalMinuteCount(3);
                passingTime.assertNthDepartureTime(0, '44');
                passingTime.assertNthDepartureTime(1, '54');
                passingTime.assertNthDepartureTime(2, '54');
              });
              // Hour 08
              row.getTimeContainerByHour('8').within(() => {
                passingTime.assertTotalMinuteCount(5);
                passingTime.assertNthDepartureTime(0, '14');
                passingTime.assertNthDepartureTime(1, '29');
                passingTime.assertNthDepartureTime(2, '39');
                passingTime.assertNthDepartureTime(3, '39');
                passingTime.assertNthDepartureTime(4, '59');
              });
              // Hour 09 No Departures
              // Hour 10
              row.getTimeContainerByHour('10').within(() => {
                passingTime.assertTotalMinuteCount(2);
                passingTime.assertNthDepartureTime(0, '12');
                passingTime.assertNthDepartureTime(1, '22');
              });
            });
            // E2E009
            passingTimesByStopTable.getStopRow('E2E009').within(() => {
              // Hour 07
              row.getTimeContainerByHour('7').within(() => {
                passingTime.assertTotalMinuteCount(3);
                passingTime.assertNthDepartureTime(0, '48');
                passingTime.assertNthDepartureTime(1, '58');
                passingTime.assertNthDepartureTime(2, '58');
              });
              // Hour 08
              row.getTimeContainerByHour('8').within(() => {
                passingTime.assertTotalMinuteCount(4);
                passingTime.assertNthDepartureTime(0, '18');
                passingTime.assertNthDepartureTime(1, '34');
                passingTime.assertNthDepartureTime(2, '43');
                passingTime.assertNthDepartureTime(3, '44');
              });
              // Hour 09
              row.getTimeContainerByHour('9').within(() => {
                passingTime.assertTotalMinuteCount(1);
                passingTime.assertNthDepartureTime(0, '03');
              });
              // Hour 10
              row.getTimeContainerByHour('10').within(() => {
                passingTime.assertTotalMinuteCount(2);
                passingTime.assertNthDepartureTime(0, '17');
                passingTime.assertNthDepartureTime(1, '27');
              });
            });
          });
      },
    );

    it(
      'Should import timetable data without preview and combine existing data',
      { tags: [Tag.Timetables, Tag.HastusImport] },
      () => {
        const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';
        const confirmTimetablesImportModal = new ConfirmTimetablesImportModal();

        cy.visit(
          '/timetables/lines/08d1fa6b-440c-421e-ad4d-0778d65afe60?observationDate=2023-04-01',
        );

        // Check existing timetable validity
        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .should('contain', '1.4.2023 - 30.6.2023')
              .and('contain', '6 lähtöä')
              .and('contain', '07:05 ... 09:40');
          });

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .should('contain', '1.4.2023 - 30.6.2023')
              .and('contain', '6 lähtöä')
              .and('contain', '07:30 ... 10:05');
          });

        // Navigate to timetables import and import new timetable with combine
        navbar.getTimetablesLink().click();
        timetablesMainPage.getImportButton().click();
        importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
        importTimetablesPage.getUploadButton().click();
        importTimetablesPage.toast.checkSuccessToastHasMessage(
          `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
        );

        importTimetablesPage.getSaveButton().click();
        confirmTimetablesImportModal.confirmTimetablesImportForm.priorityForm.setAsStandard();
        confirmTimetablesImportModal.confirmTimetablesImportForm
          .getCombineRadioButton()
          .check();
        confirmTimetablesImportModal.confirmTimetablesImportForm
          .getSaveButton()
          .click();

        importTimetablesPage.toast.checkSuccessToastHasMessage(
          'Aikataulujen tuonti onnistui!',
        );
      },
    );
  });
  // TODO: add a test for a fail case when it is handled in the UI
});
