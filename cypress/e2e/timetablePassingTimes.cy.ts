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
  ObservationDateControl,
  PassingTimesByStopTableRowPassingTime,
  SearchResultsPage,
  TimetablesMainPage,
  VehicleScheduleDetailsPage,
} from '../pageObjects';
import { PassingTimesByStopTable } from '../pageObjects/timetables/PassingTimesByStopTable';
import { RouteTimetablesSection } from '../pageObjects/timetables/RouteTimetablesSection';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

describe('Timetable passing times', { tags: [Tag.Timetables] }, () => {
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
    cy.setupTests();
    cy.mockLogin();
  });

  it(
    'Should highlight vehicle journey passing times',
    { tags: [Tag.Smoke, Tag.HastusImport] },
    () => {
      cy.visit('/timetables');
      TimetablesMainPage.searchContainer.getSearchInput().type('901{enter}');

      SearchResultsPage.getRouteLineTableRowByLabel('901').click();

      ObservationDateControl.setObservationDate('2023-04-29');

      RouteTimetablesSection.getRouteSectionHeadingButton(
        '901',
        RouteDirectionEnum.Outbound,
      ).click();

      RouteTimetablesSection.getRouteSection(
        '901',
        RouteDirectionEnum.Outbound,
      ).within(() => {
        const { row } = PassingTimesByStopTable;
        const { passingTime } = row;

        PassingTimesByStopTable.getStopRow('E2E001').within(() => {
          row.getTimeContainerByHour('8').within(() => {
            // Click one passing time to highlight the journey
            passingTime.passingMinute.getMinute().click();

            PassingTimesByStopTableRowPassingTime.assertNthMinuteShouldBeHighlighted(
              0,
            );
          });
        });

        PassingTimesByStopTable.getStopRow('E2E002').within(() => {
          row.getTimeContainerByHour('8').within(() => {
            PassingTimesByStopTableRowPassingTime.assertNthMinuteShouldBeHighlighted(
              0,
            );
          });
        });

        PassingTimesByStopTable.getStopRow('E2E003').within(() => {
          row.getTimeContainerByHour('8').within(() => {
            PassingTimesByStopTableRowPassingTime.assertNthMinuteShouldBeHighlighted(
              1,
            );
          });
        });

        PassingTimesByStopTable.getStopRow('E2E004').within(() => {
          row.getTimeContainerByHour('8').within(() => {
            PassingTimesByStopTableRowPassingTime.assertNthMinuteShouldBeHighlighted(
              1,
            );
          });
        });

        PassingTimesByStopTable.getStopRow('E2E005').within(() => {
          row.getTimeContainerByHour('8').within(() => {
            PassingTimesByStopTableRowPassingTime.assertNthMinuteShouldBeHighlighted(
              1,
            );
          });
        });

        // Check that we have the correct amount of elements highlighted
        PassingTimesByStopTable.getAllHighlightedElements().should(
          'have.length',
          5,
        );
      });

      // Check that the other direction route section has no highlighted elements
      RouteTimetablesSection.getRouteSection(
        '901',
        RouteDirectionEnum.Inbound,
      ).within(() => {
        PassingTimesByStopTable.getAllHighlightedElements().should(
          'have.length',
          0,
        );
      });
    },
  );

  it('Should show arrival times', { tags: [Tag.HastusImport] }, () => {
    cy.visit('/timetables');
    TimetablesMainPage.searchContainer.getSearchInput().type('901{enter}');

    SearchResultsPage.getRouteLineTableRowByLabel('901').click();

    ObservationDateControl.setObservationDate('2023-04-29');

    RouteTimetablesSection.getRouteSectionHeadingButton(
      '901',
      RouteDirectionEnum.Outbound,
    ).click();

    PassingTimesByStopTable.getAllPassingTimeArrivalTimes().should(
      'have.length',
      60,
    );

    VehicleScheduleDetailsPage.getArrivalTimesSwitch().click();

    RouteTimetablesSection.getRouteSection(
      '901',
      RouteDirectionEnum.Outbound,
    ).within(() => {
      const { row } = PassingTimesByStopTable;
      const { passingTime } = row;
      // E2E003
      PassingTimesByStopTable.getStopRow('E2E003').within(() => {
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
      PassingTimesByStopTable.getStopRow('E2E004').within(() => {
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
  });
});
