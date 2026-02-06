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
  ObservationDateControl,
  PassingTimesByStopTable,
  RouteTimetablesSection,
  SearchResultsPage,
  TimetablesMainPage,
  Toast,
  VehicleScheduleDetailsPage,
  VehicleServiceTable,
} from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

describe('Timetable validity period', () => {
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
      cy.setupTests();
      cy.mockLogin();
    });

    it(
      "Should change a timetable's validity period",
      { tags: [Tag.Smoke] },
      () => {
        cy.visit('timetables');

        TimetablesMainPage.searchContainer.getSearchInput().type('901{enter}');

        SearchResultsPage.getRouteLineTableRowByLabel('901').click();

        ObservationDateControl.setObservationDate('2023-04-29');

        VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
          '901',
          RouteDirectionEnum.Outbound,
        ).within(() => {
          RouteTimetablesSection.getVehicleServiceTableByDayType('LA').within(
            () => {
              VehicleServiceTable.vehicleJourneyGroupInfo
                .getChangeValidityButton()
                .click();
            },
          );
        });

        VehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityStartDate(
          '2024-01-01',
        );

        VehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityEndDate(
          '2024-12-31',
        );

        VehicleScheduleDetailsPage.changeTimetablesValidityForm
          .getSaveButton()
          .click();

        RouteTimetablesSection.getLoader().shouldBeVisible();
        RouteTimetablesSection.getLoader().should('not.exist');

        Toast.expectSuccessToast('Aikataulun voimassaolo tallennettu');

        VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
          '901',
          RouteDirectionEnum.Outbound,
        ).should('contain', 'Ei vuoroja');

        VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
          '901',
          RouteDirectionEnum.Inbound,
        ).should('contain', 'Ei vuoroja');

        VehicleScheduleDetailsPage.getShowAllValidSwitch().click();
        VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
          '901',
          RouteDirectionEnum.Outbound,
        ).within(() => {
          RouteTimetablesSection.getVehicleServiceTableByDayType('MP')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '06:05 ... 08:40');
        });

        VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
          '901',
          RouteDirectionEnum.Inbound,
        ).within(() => {
          RouteTimetablesSection.getVehicleServiceTableByDayType('MP')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '06:30 ... 09:05');
        });
        VehicleScheduleDetailsPage.getShowAllValidSwitch().click();

        // Set observation date to first Saturday of the new validity period
        ObservationDateControl.setObservationDate('2024-01-06');

        VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
          '901',
          RouteDirectionEnum.Outbound,
        ).within(() => {
          RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2024 - 31.12.2024')
            .and('contain', '6 lähtöä')
            .and('contain', '07:05 ... 09:40');
        });

        VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
          '901',
          RouteDirectionEnum.Inbound,
        ).within(() => {
          RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
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
      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Outbound,
      ).within(() => {
        RouteTimetablesSection.getVehicleServiceTableByDayType('LA').within(
          () => VehicleServiceTable.getHeadingButton().click(),
        );

        PassingTimesByStopTable.vehicleJourneyGroupInfo
          .getChangeValidityButton()
          .click();
      });

      VehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityStartDate(
        '2024-01-01',
      );
      VehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityEndDate(
        '2024-12-31',
      );

      VehicleScheduleDetailsPage.changeTimetablesValidityForm
        .getSaveButton()
        .click();

      RouteTimetablesSection.getLoader().shouldBeVisible();
      RouteTimetablesSection.getLoader().should('not.exist');

      Toast.expectSuccessToast('Aikataulun voimassaolo tallennettu');

      // Check that there is no schedules, since they are no longer valid on observationDate
      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Outbound,
      ).should('contain', 'Ei vuoroja');

      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Inbound,
      ).should('contain', 'Ei vuoroja');

      ObservationDateControl.setObservationDate('2024-01-06');

      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Outbound,
      ).within(() => {
        PassingTimesByStopTable.vehicleJourneyGroupInfo
          .get()
          .should('contain', '1.1.2024 - 31.12.2024')
          .and('contain', '6 lähtöä')
          .and('contain', '07:05 ... 09:40');
      });

      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Inbound,
      ).within(() => {
        PassingTimesByStopTable.vehicleJourneyGroupInfo
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

      cy.setupTests();
      cy.mockLogin();
    });

    it('Should not let the user extend the validity period so that it overlaps the validity period of another timetable with the same priority', () => {
      cy.visit(
        'timetables/lines/08d1fa6b-440c-421e-ad4d-0778d65afe60?observationDate=2023-04-29&routeLabels=901',
      );

      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Outbound,
      ).within(() => {
        RouteTimetablesSection.getVehicleServiceTableByDayType('LA').within(
          () => {
            VehicleServiceTable.vehicleJourneyGroupInfo
              .getChangeValidityButton()
              .click();
          },
        );
      });

      // Try to extend the 2023 timetables validity into 2024
      VehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityEndDate(
        '2024-03-03',
      );

      VehicleScheduleDetailsPage.changeTimetablesValidityForm
        .getSaveButton()
        .click();

      Toast.expectDangerToast(
        'Tallennus epäonnistui: GraphQL errors: conflicting schedules detected',
      );
    });
  });
});
