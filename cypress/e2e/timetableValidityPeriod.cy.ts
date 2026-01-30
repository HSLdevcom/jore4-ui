import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { DateTime } from 'luxon';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../datasets/base';
import {
  getClonedBaseTimetableDataInput,
  satVehicleScheduleFrame,
} from '../datasets/timetables';
import { Tag } from '../enums';
import {
  PassingTimesByStopTable,
  RouteTimetablesSection,
  SearchResultsPage,
  TimetablesMainPage,
  VehicleScheduleDetailsPage,
  VehicleServiceTable,
} from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

describe('Timetable validity period', () => {
  let vehicleScheduleDetailsPage: VehicleScheduleDetailsPage;
  let timetablesMainPage: TimetablesMainPage;
  let searchResultsPage: SearchResultsPage;
  let routeTimetablesSection: RouteTimetablesSection;
  let vehicleServiceTable: VehicleServiceTable;
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

  describe('Basic validity changes', { tags: [Tag.Timetables] }, () => {
    beforeEach(() => {
      cy.task('resetDbs');
      insertToDbHelper(dbResources);
      cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);

      timetablesMainPage = new TimetablesMainPage();
      vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();
      searchResultsPage = new SearchResultsPage();
      routeTimetablesSection = new RouteTimetablesSection();
      vehicleServiceTable = new VehicleServiceTable();
      passingTimesByStopTable = new PassingTimesByStopTable();

      cy.setupTests();
      cy.mockLogin();
    });

    it(
      "Should change a timetable's validity period",
      { tags: [Tag.Smoke] },
      () => {
        cy.visit('timetables');

        timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');

        searchResultsPage.getRouteLineTableRowByLabel('901').click();

        vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
          '2023-04-29',
        );

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .within(() => {
                vehicleServiceTable.vehicleJourneyGroupInfo
                  .getChangeValidityButton()
                  .click();
              });
          });

        vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityStartDate(
          '2024-01-01',
        );

        vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityEndDate(
          '2024-12-31',
        );

        vehicleScheduleDetailsPage.changeTimetablesValidityForm
          .getSaveButton()
          .click();

        routeTimetablesSection.getLoader().shouldBeVisible();
        routeTimetablesSection.getLoader().should('not.exist');

        vehicleScheduleDetailsPage.toast.expectSuccessToast(
          'Aikataulun voimassaolo tallennettu',
        );

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
          .should('contain', 'Ei vuoroja');

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
          .should('contain', 'Ei vuoroja');

        vehicleScheduleDetailsPage.getShowAllValidSwitch().click();
        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('MP')
              .should('contain', '1.1.2023 - 31.12.2023')
              .and('contain', '6 lähtöä')
              .and('contain', '06:05 ... 08:40');
          });

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('MP')
              .should('contain', '1.1.2023 - 31.12.2023')
              .and('contain', '6 lähtöä')
              .and('contain', '06:30 ... 09:05');
          });
        vehicleScheduleDetailsPage.getShowAllValidSwitch().click();

        // Set observation date to first Saturday of the new validity period
        vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
          '2024-01-06',
        );

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .should('contain', '1.1.2024 - 31.12.2024')
              .and('contain', '6 lähtöä')
              .and('contain', '07:05 ... 09:40');
          });

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
          .within(() => {
            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .should('contain', '1.1.2024 - 31.12.2024')
              .and('contain', '6 lähtöä')
              .and('contain', '07:30 ... 10:05');
          });
      },
    );

    it("Should change a timetable's validity period in the passing times view", () => {
      cy.visit(
        'timetables/lines/08d1fa6b-440c-421e-ad4d-0778d65afe60?observationDate=2023-04-29&routeLabels=901',
      );

      // Open passing times view
      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .within(() => vehicleServiceTable.getHeadingButton().click());

          passingTimesByStopTable.vehicleJourneyGroupInfo
            .getChangeValidityButton()
            .click();
        });

      vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityStartDate(
        '2024-01-01',
      );
      vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityEndDate(
        '2024-12-31',
      );

      vehicleScheduleDetailsPage.changeTimetablesValidityForm
        .getSaveButton()
        .click();

      routeTimetablesSection.getLoader().shouldBeVisible();
      routeTimetablesSection.getLoader().should('not.exist');

      vehicleScheduleDetailsPage.toast.expectSuccessToast(
        'Aikataulun voimassaolo tallennettu',
      );

      // Check that there is no schedules, since they are no longer valid on observationDate
      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .should('contain', 'Ei vuoroja');

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .should('contain', 'Ei vuoroja');

      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2024-01-06',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          passingTimesByStopTable.vehicleJourneyGroupInfo
            .get()
            .should('contain', '1.1.2024 - 31.12.2024')
            .and('contain', '6 lähtöä')
            .and('contain', '07:05 ... 09:40');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          passingTimesByStopTable.vehicleJourneyGroupInfo
            .get()
            .should('contain', '1.1.2024 - 31.12.2024')
            .and('contain', '6 lähtöä')
            .and('contain', '07:30 ... 10:05');
        });
    });
  });

  describe('Overlapping validity periods', () => {
    beforeEach(() => {
      cy.task('resetDbs');
      insertToDbHelper(dbResources);

      // Add saturday schedule for 2024 in addition to baseTimetableData
      cy.task('insertHslTimetablesDatasetToDb', {
        ...baseTimetableDataInput,
        _vehicle_schedule_frames: {
          // eslint-disable-next-line no-underscore-dangle
          ...baseTimetableDataInput._vehicle_schedule_frames,
          year2024Sat: {
            ...satVehicleScheduleFrame,
            validity_start: DateTime.fromISO('2024-01-01'),
            validity_end: DateTime.fromISO('2024-12-31'),
            name: '2024 sat',
            booking_label: '2024 booking label sat',
          },
        },
      });

      timetablesMainPage = new TimetablesMainPage();
      vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();
      searchResultsPage = new SearchResultsPage();
      routeTimetablesSection = new RouteTimetablesSection();
      vehicleServiceTable = new VehicleServiceTable();

      cy.setupTests();
      cy.mockLogin();
    });

    it('Should not let the user extend the validity period so that it overlaps the validity period of another timetable with the same priority', () => {
      cy.visit(
        'timetables/lines/08d1fa6b-440c-421e-ad4d-0778d65afe60?observationDate=2023-04-29&routeLabels=901',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .within(() => {
              vehicleServiceTable.vehicleJourneyGroupInfo
                .getChangeValidityButton()
                .click();
            });
        });

      // Try to extend the 2023 timetables validity into 2024
      vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityEndDate(
        '2024-03-03',
      );

      vehicleScheduleDetailsPage.changeTimetablesValidityForm
        .getSaveButton()
        .click();

      vehicleScheduleDetailsPage.toast.expectDangerToast(
        'Tallennus epäonnistui: GraphQL errors: conflicting schedules detected',
      );
    });
  });
});
