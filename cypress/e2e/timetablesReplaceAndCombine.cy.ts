import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
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
  ErrorModal,
  ImportTimetablesPage,
  Navbar,
  PassingTimesByStopTable,
  PreviewTimetablesPage,
  RouteTimetablesSection,
  SearchResultsPage,
  TimetablesMainPage,
  VehicleScheduleDetailsPage,
} from '../pageObjects';
import { ConfirmTimetablesImportModal } from '../pageObjects/timetables/import/ConfirmTimetablesImportModal';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

describe(
  'Timetable replacement and combination',
  { tags: [Tag.Timetables] },
  () => {
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
        { tags: [Tag.Smoke, Tag.HastusImport] },
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
            .getRouteSectionByLabelAndDirection(
              '901',
              RouteDirectionEnum.Inbound,
            )
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
          importTimetablesPage.toast.expectSuccessToast(
            `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
          );

          importTimetablesPage.clickPreviewButton();
          previewTimetablesPage.priorityForm.setAsStandard();
          previewTimetablesPage.getSaveButton().click();
          importTimetablesPage.toast.expectSuccessToast(
            'Aikataulujen tuonti onnistui!',
          );

          // Navigate to timetables page
          navbar.getTimetablesLink().click();
          timetablesMainPage.searchContainer
            .getSearchInput()
            .type('901{enter}');
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
            .getRouteSectionByLabelAndDirection(
              '901',
              RouteDirectionEnum.Inbound,
            )
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
            .getRouteSectionByLabelAndDirection(
              '901',
              RouteDirectionEnum.Inbound,
            )
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
        { tags: [Tag.Smoke, Tag.HastusImport] },
        () => {
          const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';
          const confirmTimetablesImportModal =
            new ConfirmTimetablesImportModal();
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
            .getRouteSectionByLabelAndDirection(
              '901',
              RouteDirectionEnum.Inbound,
            )
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
          importTimetablesPage.toast.expectSuccessToast(
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

          importTimetablesPage.toast.expectSuccessToast(
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
        { tags: Tag.HastusImport },
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
            .getRouteSectionByLabelAndDirection(
              '901',
              RouteDirectionEnum.Inbound,
            )
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
          importTimetablesPage.toast.expectSuccessToast(
            `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
          );

          importTimetablesPage.clickPreviewButton();
          previewTimetablesPage.priorityForm.setAsStandard();
          previewTimetablesPage.confirmPreviewedTimetablesImportForm
            .getCombineRadioButton()
            .check();

          previewTimetablesPage.getSaveButton().click();
          importTimetablesPage.toast.expectSuccessToast(
            'Aikataulujen tuonti onnistui!',
          );

          // Navigate to timetables page
          navbar.getTimetablesLink().click();
          timetablesMainPage.searchContainer
            .getSearchInput()
            .type('901{enter}');
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
            .getRouteSectionByLabelAndDirection(
              '901',
              RouteDirectionEnum.Inbound,
            )
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
              // Check that we have 10 departures x 5 stops = 50 total minutes visible
              passingTime.assertTotalMinuteCount(50);
              // Verify with a subset check that combined timetable has correct departure
              // and arrival times from both sources
              // E2E003
              passingTimesByStopTable.getStopRow('E2E003').within(() => {
                passingTime.assertTotalMinuteCount(10);
                // Hour 07
                row.getTimeContainerByHour('7').within(() => {
                  passingTime.assertTotalMinuteCount(4);
                  // Check departure and arrival times from existing timetable
                  passingTime.assertNthArrivalTime(0, '19');
                  passingTime.assertNthDepartureTime(0, '20');
                  passingTime.assertNthArrivalTime(1, '29');
                  passingTime.assertNthDepartureTime(1, '30');

                  // Check departure and arrival times from import file
                  passingTime.assertNthArrivalTime(2, '29');
                  passingTime.assertNthDepartureTime(2, '30');
                  passingTime.assertNthArrivalTime(3, '49');
                  passingTime.assertNthDepartureTime(3, '50');
                });
                // Hour 08
                row.getTimeContainerByHour('8').within(() => {
                  passingTime.assertTotalMinuteCount(4);
                  // Check departure and arrival times from existing timetable
                  passingTime.assertNthArrivalTime(0, '00');
                  passingTime.assertNthDepartureTime(0, '01');
                  passingTime.assertNthArrivalTime(1, '10');
                  passingTime.assertNthDepartureTime(1, '11');
                  // Check departure and arrival times from import file
                  passingTime.assertNthArrivalTime(2, '14');
                  passingTime.assertNthDepartureTime(2, '15');
                  passingTime.assertNthArrivalTime(3, '34');
                  passingTime.assertNthDepartureTime(3, '35');
                });
                // Hour 09
                row.getTimeContainerByHour('9').within(() => {
                  passingTime.assertTotalMinuteCount(2);
                  // Check departure and arrival times from existing timetable
                  passingTime.assertNthArrivalTime(0, '42');
                  passingTime.assertNthDepartureTime(0, '46');
                  passingTime.assertNthArrivalTime(1, '52');
                  passingTime.assertNthDepartureTime(1, '56');
                });
              });
            });

          routeTimetablesSection
            .getRouteSection('901', RouteDirectionEnum.Inbound)
            .within(() => {
              const { row } = passingTimesByStopTable;
              const { passingTime } = row;
              // Check that we have 10 departures x 5 stops = 50 total minutes visible
              passingTime.assertTotalMinuteCount(50);
              // Verify with a subset check that combined timetable has correct departure
              // and arrival times from both sources
              // E2E007
              passingTimesByStopTable.getStopRow('E2E007').within(() => {
                passingTime.assertTotalMinuteCount(10);
                // Hour 07
                row.getTimeContainerByHour('7').within(() => {
                  passingTime.assertTotalMinuteCount(3);
                  // Check departure and arrival times from existing timetable
                  passingTime.assertNthArrivalTime(0, '40');
                  passingTime.assertNthDepartureTime(0, '41');
                  passingTime.assertNthArrivalTime(1, '50');
                  passingTime.assertNthDepartureTime(1, '51');
                  // Check departure and arrival times from import file
                  passingTime.assertNthArrivalTime(2, '50');
                  passingTime.assertNthDepartureTime(2, '51');
                });
                // Hour 08
                row.getTimeContainerByHour('8').within(() => {
                  passingTime.assertTotalMinuteCount(5);
                  // Check departure and arrival times from existing timetable
                  passingTime.assertNthArrivalTime(1, '21');
                  passingTime.assertNthDepartureTime(1, '22');
                  passingTime.assertNthArrivalTime(2, '31');
                  passingTime.assertNthDepartureTime(2, '32');
                  // Check departure and arrival times from import file
                  passingTime.assertNthArrivalTime(0, '10');
                  passingTime.assertNthDepartureTime(0, '11');
                  passingTime.assertNthArrivalTime(3, '35');
                  passingTime.assertNthDepartureTime(3, '36');
                  passingTime.assertNthArrivalTime(4, '55');
                  passingTime.assertNthDepartureTime(4, '56');
                });
                // Hour 09 No departures
                // Hour 10
                row.getTimeContainerByHour('10').within(() => {
                  // Check departure and arrival times from existing timetable
                  passingTime.assertTotalMinuteCount(2);
                  passingTime.assertNthArrivalTime(0, '04');
                  passingTime.assertNthDepartureTime(0, '05');
                  passingTime.assertNthArrivalTime(1, '14');
                  passingTime.assertNthDepartureTime(1, '15');
                });
              });
            });
        },
      );

      it(
        'Should import timetable data without preview and combine existing data',
        { tags: Tag.HastusImport },
        () => {
          const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';
          const confirmTimetablesImportModal =
            new ConfirmTimetablesImportModal();

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
            .getRouteSectionByLabelAndDirection(
              '901',
              RouteDirectionEnum.Inbound,
            )
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
          importTimetablesPage.toast.expectSuccessToast(
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

          importTimetablesPage.toast.expectSuccessToast(
            'Aikataulujen tuonti onnistui!',
          );
        },
      );
    });

    describe('Error cases', () => {
      describe('Combining mismatching timetable', () => {
        beforeEach(() => {
          cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);
        });

        it('should show an error message when the target timetable has different validity than import', () => {
          const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';
          const errorModal = new ErrorModal();
          const { vehicleScheduleFrameBlocksView } = previewTimetablesPage;

          // Observation date is the first day the imported timetable would be in effect
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
            .getRouteSectionByLabelAndDirection(
              '901',
              RouteDirectionEnum.Inbound,
            )
            .within(() => {
              routeTimetablesSection
                .getVehicleServiceTableByDayType('LA')
                .should('contain', '1.1.2023 - 31.12.2023')
                .and('contain', '6 lähtöä')
                .and('contain', '07:30 ... 10:05');
            });

          // Navigate to timetables import and import new timetable with combine
          navbar.getTimetablesLink().click();
          timetablesMainPage.getImportButton().click();
          importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
          importTimetablesPage.getUploadButton().click();
          importTimetablesPage.toast.expectSuccessToast(
            `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
          );

          importTimetablesPage.clickPreviewButton();
          previewTimetablesPage.priorityForm.setAsStandard();
          previewTimetablesPage.confirmPreviewedTimetablesImportForm
            .getCombineRadioButton()
            .check();
          previewTimetablesPage
            .getVehicleScheduleFrameBlockByLabel('0901')
            .within(() => {
              // Check that the imported timetable has different validity than the existing
              vehicleScheduleFrameBlocksView
                .getFrameTitleRow()
                .should('contain', '0901')
                .and('contain', '1.4.2023 - 30.6.2023')
                .and('contain', '2 autokiertoa');
            });
          previewTimetablesPage.getSaveButton().click();

          errorModal.getModal().should('exist');
          errorModal.errorModalItem
            .getItem()
            .should('be.visible')
            .should('have.length', 1);
          errorModal.errorModalItem
            .getDescription()
            .shouldHaveText(
              'Tuotavia aikatauluja ei voitu yhdistää: kohdeaikataulua ei löytynyt.',
            );
        });
      });

      describe('Replacing timetable from the beginning of its validity', () => {
        beforeEach(() => {
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

        it('should show an error message when the target timetables validity starts at the same time', () => {
          const IMPORT_FILENAME = 'hastusImportSaturday901Apr-Jun2023.exp';
          const errorModal = new ErrorModal();
          const { vehicleScheduleFrameBlocksView } = previewTimetablesPage;

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
            .getRouteSectionByLabelAndDirection(
              '901',
              RouteDirectionEnum.Inbound,
            )
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
          importTimetablesPage.toast.expectSuccessToast(
            `Tiedoston ${IMPORT_FILENAME} lataus onnistui`,
          );

          importTimetablesPage.clickPreviewButton();
          previewTimetablesPage.priorityForm.setAsStandard();
          previewTimetablesPage.confirmPreviewedTimetablesImportForm
            .getReplaceRadioButton()
            .should('be.checked');
          previewTimetablesPage
            .getVehicleScheduleFrameBlockByLabel('0901')
            .within(() => {
              // Check that the imported timetable has the same validity than the existing
              vehicleScheduleFrameBlocksView
                .getFrameTitleRow()
                .should('contain', '0901')
                .and('contain', '1.4.2023 - 30.6.2023')
                .and('contain', '2 autokiertoa');
            });
          previewTimetablesPage.getSaveButton().click();

          errorModal.getModal().should('exist');
          errorModal.errorModalItem
            .getItem()
            .should('be.visible')
            .should('have.length', 1);
          errorModal.errorModalItem
            .getDescription()
            .shouldHaveText(
              'Tallentaminen epäonnistui: aikataulukehyksissä on päällekkäisyyksiä.',
            );
        });
      });
    });
  },
);
