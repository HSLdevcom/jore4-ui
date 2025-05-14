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
  SearchResultsPage,
  TimetablesMainPage,
  VehicleScheduleDetailsPage,
} from '../pageObjects';
import { PassingTimesByStopTable } from '../pageObjects/timetables/PassingTimesByStopTable';
import { RouteTimetablesSection } from '../pageObjects/timetables/RouteTimetablesSection';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

describe('Timetable passing times', () => {
  let timetablesMainPage: TimetablesMainPage;
  let vehicleScheduleDetailsPage: VehicleScheduleDetailsPage;
  let searchResultsPage: SearchResultsPage;
  let routeTimetablesSection: RouteTimetablesSection;
  let passingTimesByStopTable: PassingTimesByStopTable;

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
    insertToDbHelper(dbResources);
    cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);

    timetablesMainPage = new TimetablesMainPage();
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();
    searchResultsPage = new SearchResultsPage();
    routeTimetablesSection = new RouteTimetablesSection();
    passingTimesByStopTable = new PassingTimesByStopTable();

    cy.setupTests();
    cy.mockLogin();
  });

  it(
    'Should highlight vehicle journey passing times',
    { tags: [Tag.Timetables, Tag.HastusImport] },
    () => {
      cy.visit('/timetables');
      timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');

      searchResultsPage.getRouteLineTableRowByLabel('901').click();

      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-04-29',
      );

      routeTimetablesSection
        .getRouteSectionHeadingButton('901', RouteDirectionEnum.Outbound)
        .click();

      routeTimetablesSection
        .getRouteSection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          const { row } = passingTimesByStopTable;
          const { passingTime } = row;

          passingTimesByStopTable.getStopRow('E2E001').within(() => {
            row.getTimeContainerByHour('8').within(() => {
              // Click one passing time to highlight the journey
              passingTime.passingMinute.getMinute().click();

              passingTime.assertNthMinuteShouldBeHighlighted(0);
            });
          });

          passingTimesByStopTable.getStopRow('E2E002').within(() => {
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertNthMinuteShouldBeHighlighted(0);
            });
          });

          passingTimesByStopTable.getStopRow('E2E003').within(() => {
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertNthMinuteShouldBeHighlighted(1);
            });
          });

          passingTimesByStopTable.getStopRow('E2E004').within(() => {
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertNthMinuteShouldBeHighlighted(1);
            });
          });

          passingTimesByStopTable.getStopRow('E2E005').within(() => {
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertNthMinuteShouldBeHighlighted(1);
            });
          });

          // Check that we have the correct amount of elements highlighted
          passingTimesByStopTable
            .getAllHighlightedElements()
            .should('have.length', 5);
        });

      // Check that the other direction route section has no highlighted elements
      routeTimetablesSection
        .getRouteSection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          passingTimesByStopTable
            .getAllHighlightedElements()
            .should('have.length', 0);
        });
    },
  );

  it(
    'Should show arrival times',
    { tags: [Tag.Timetables, Tag.HastusImport] },
    () => {
      cy.visit('/timetables');
      timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');

      searchResultsPage.getRouteLineTableRowByLabel('901').click();

      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-04-29',
      );

      routeTimetablesSection
        .getRouteSectionHeadingButton('901', RouteDirectionEnum.Outbound)
        .click();

      passingTimesByStopTable
        .getAllPassingTimeArrivalTimes()
        .should('have.length', 60);

      vehicleScheduleDetailsPage.getArrivalTimesSwitch().click();

      routeTimetablesSection
        .getRouteSection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          const { row } = passingTimesByStopTable;
          const { passingTime } = row;
          // E2E003
          passingTimesByStopTable.getStopRow('E2E003').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthArrivalTime(0, '19');
              passingTime.assertNthArrivalTime(1, '29');
            });

            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthArrivalTime(0, '00');
              passingTime.assertNthArrivalTime(1, '10');
            });

            // Hour 09
            row.getTimeContainerByHour('9').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthArrivalTime(0, '42');
              passingTime.assertNthArrivalTime(1, '52');
            });
          });

          // E2E004
          passingTimesByStopTable.getStopRow('E2E004').within(() => {
            // Hour 07
            row.getTimeContainerByHour('7').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthArrivalTime(0, '24');
              passingTime.assertNthArrivalTime(1, '34');
            });

            // Hour 08
            row.getTimeContainerByHour('8').within(() => {
              passingTime.assertTotalMinuteCount(2);
              passingTime.assertNthArrivalTime(0, '05');
              passingTime.assertNthArrivalTime(1, '15');
            });

            // Hour 09
            row.getTimeContainerByHour('9').within(() => {
              passingTime.assertTotalMinuteCount(1);
              passingTime.assertNthArrivalTime(0, '50');
            });

            // Hour 10
            row.getTimeContainerByHour('10').within(() => {
              passingTime.assertTotalMinuteCount(1);
              passingTime.assertNthArrivalTime(0, '00');
            });
          });
        });
    },
  );
});
