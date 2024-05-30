import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
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
import {
  SupportedResources,
  insertToDbHelper,
  removeFromDbHelper,
} from '../utils';

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
    cy.task('truncateTimetablesDatabase');
    removeFromDbHelper(dbResources);
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

  afterEach(() => {
    cy.task('emptyDownloadsFolder');

    removeFromDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');
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
          // Click one passing time to hilight the journey
          passingTimesByStopTable
            .getAllStopPassingTimesMinuteButtons('E2E001')
            .eq(3)
            .click();

          // Then check that the right passing times are highlighted
          passingTimesByStopTable.assertStopNthPassingTimeShouldBeHighlighted(
            'E2E001',
            3,
          );

          passingTimesByStopTable.assertStopNthPassingTimeShouldBeHighlighted(
            'E2E002',
            3,
          );

          passingTimesByStopTable.assertStopNthPassingTimeShouldBeHighlighted(
            'E2E003',
            3,
          );

          passingTimesByStopTable.assertStopNthPassingTimeShouldBeHighlighted(
            'E2E004',
            3,
          );

          passingTimesByStopTable.assertStopNthPassingTimeShouldBeHighlighted(
            'E2E005',
            3,
          );

          // Check that we have the correct amount of elements highlighted
          passingTimesByStopTable
            .getHighlightedElements()
            .should('have.length', 5);
        });

      // Check that the other direction route section has no highlighted elements
      routeTimetablesSection
        .getRouteSection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          passingTimesByStopTable
            .getHighlightedElements()
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
        .getRouteSectionHeadingButton('901', RouteDirectionEnum.Inbound)
        .click();

      passingTimesByStopTable
        .getAllPassingTimeArrivalTimes()
        .should('have.length', 0);

      vehicleScheduleDetailsPage.getArrivalTimesSwitch().click();

      routeTimetablesSection
        .getRouteSection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          // E2E007
          // Hour 07
          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E007', 0)
            .should('contain', '19');

          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E007', 1)
            .should('contain', '29');

          // Hour 08
          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E007', 2)
            .should('contain', '00');

          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E007', 3)
            .should('contain', '10');

          // Hour 09
          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E007', 4)
            .should('contain', '42');

          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E007', 5)
            .should('contain', '52');

          // E2E008
          // Hour 07
          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E008', 0)
            .should('contain', '24');

          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E008', 1)
            .should('contain', '34');

          // Hour 08
          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E008', 2)
            .should('contain', '05');

          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E008', 3)
            .should('contain', '15');

          // Hour 09
          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E008', 4)
            .should('contain', '50');

          // Hour 10
          passingTimesByStopTable
            .getStopNthPassingTimesArrivalTime('E2E008', 5)
            .should('contain', '00');
        });
    },
  );
});
