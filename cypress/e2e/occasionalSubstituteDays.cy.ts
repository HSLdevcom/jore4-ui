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
  Navbar,
  ObservationDateControl,
  OccasionalSubstitutePeriodForm,
  SearchResultsPage,
  SubstituteDaySettingsPage,
  TimetablesMainPage,
  Toast,
  VehicleScheduleDetailsPage,
} from '../pageObjects';
import { RouteTimetablesSection } from '../pageObjects/timetables/RouteTimetablesSection';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

const rootTags: Cypress.SuiteConfigOverrides = { tags: [Tag.Timetables] };
describe('Occasional substitute operating periods', rootTags, () => {
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
    'Should create and delete an occasional substitute operating period successfully',
    { tags: [Tag.Smoke] },
    () => {
      cy.visit('/timetables/settings');
      // Set observation period so that the saved ocasional substitute day will
      // not be in the range of this period
      SubstituteDaySettingsPage.observationPeriodForm.setStartDate(
        '2022-01-01',
      );
      SubstituteDaySettingsPage.observationPeriodForm.setEndDate('2022-12-31');
      // Add an occasional substitute day
      OccasionalSubstitutePeriodForm.getAddOccasionalSubstitutePeriodButton().click();

      cy.getByTestId('ObservationPeriodForm::warningMessage').shouldHaveText(
        'Tallenna tai hylkää lomakkeen muutokset',
      );

      OccasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm({
        nth: 0,
        formInfo: {
          name: 'Poikkeusjakson nimi',
          beginDate: '2023-03-08',
          beginTime: '04:30',
          endDate: '2023-03-08',
          endTime: '28:30',
          substituteDay: 'Lauantai',
          lineTypes: ['Peruslinja'],
        },
      });
      OccasionalSubstitutePeriodForm.getSaveButton().click();
      Toast.expectSuccessToast('Tallennus onnistui');

      // Navigate to route's timetable
      Navbar.getTimetablesLink().click();
      TimetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
      SearchResultsPage.getRouteLineTableRowByLabel('901').click();
      ObservationDateControl.setObservationDate('2023-03-08');
      VehicleScheduleDetailsPage.getShowAllValidSwitch().click();

      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Outbound,
      ).within(() => {
        // Check that the substituteDay (Wed) is matching with the chosen timetable (Sat)
        RouteTimetablesSection.getVehicleServiceTableByDayType('KE')
          .should('contain', '8.3.2023 - 8.3.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '07:05 ... 09:40');

        RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
          .should('contain', '1.1.2023 - 31.12.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '07:05 ... 09:40');

        // And check that the Mon-Fri timetable is still visible
        RouteTimetablesSection.getVehicleServiceTableByDayType('MP')
          .should('contain', '1.1.2023 - 31.12.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '06:05 ... 08:40');
      });

      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Inbound,
      ).within(() => {
        // Check that the substituteDay (Wed) is matching with the chosen timetable (Sat)
        RouteTimetablesSection.getVehicleServiceTableByDayType('KE')
          .should('contain', '8.3.2023 - 8.3.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '07:30 ... 10:05');

        RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
          .should('contain', '1.1.2023 - 31.12.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '07:30 ... 10:05');

        // And check that the Mon-Fri timetable is still visible
        RouteTimetablesSection.getVehicleServiceTableByDayType('MP')
          .should('contain', '1.1.2023 - 31.12.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '06:30 ... 09:05');
      });

      // Remove the substitute day
      Navbar.getTimetablesLink().click();
      TimetablesMainPage.getSettingsButton().click();
      SubstituteDaySettingsPage.observationPeriodForm.setStartDate(
        '2023-03-08',
      );
      SubstituteDaySettingsPage.observationPeriodForm.setEndDate('2023-03-08');
      SubstituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .shouldBeVisible();

      cy.getByTestId('ObservationPeriodForm::filterButton').click();

      OccasionalSubstitutePeriodForm.deleteNthOccasionalSubstituteDay(0);
      OccasionalSubstitutePeriodForm.getSaveButton().click();
      Toast.expectSuccessToast('Tallennus onnistui');

      // Navigate to route's timetable
      Navbar.getTimetablesLink().click();
      TimetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
      SearchResultsPage.getRouteLineTableRowByLabel('901').click();
      ObservationDateControl.setObservationDate('2023-03-08');

      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Outbound,
      ).within(() => {
        RouteTimetablesSection.getVehicleServiceTableByDayType('MP')
          .should('contain', '1.1.2023 - 31.12.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '06:05 ... 08:40');

        RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
          .should('contain', '1.1.2023 - 31.12.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '07:05 ... 09:40');

        // Check that the substituteDay (Wed) is no longer existing
        RouteTimetablesSection.getVehicleServiceTableByDayType('KE').should(
          'not.exist',
        );
      });

      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Inbound,
      ).within(() => {
        RouteTimetablesSection.getVehicleServiceTableByDayType('MP')
          .should('contain', '1.1.2023 - 31.12.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '06:30 ... 09:05');

        RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
          .should('contain', '1.1.2023 - 31.12.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '07:30 ... 10:05');

        // Check that the substituteDay (Wed) is no longer existing
        RouteTimetablesSection.getVehicleServiceTableByDayType('KE').should(
          'not.exist',
        );
      });
    },
  );

  it("Should create a 'No traffic' day successfully", () => {
    cy.visit('/timetables/settings');
    OccasionalSubstitutePeriodForm.getAddOccasionalSubstitutePeriodButton().click();
    OccasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm({
      nth: 0,
      formInfo: {
        name: 'Ei liikennöintiä -päivä',
        beginDate: '2023-01-21',
        beginTime: '04:30',
        endDate: '2023-01-21',
        endTime: '28:30',
        substituteDay: 'Ei liikennöintiä',
        lineTypes: ['Peruslinja'],
      },
    });
    OccasionalSubstitutePeriodForm.getSaveButton().click();
    Toast.expectSuccessToast('Tallennus onnistui');

    // Navigate to route's timetable
    Navbar.getTimetablesLink().click();
    TimetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
    SearchResultsPage.getRouteLineTableRowByLabel('901').click();
    ObservationDateControl.setObservationDate('2023-01-21');

    VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
      '901',
      RouteDirectionEnum.Outbound,
    ).within(() => {
      // Check the timetable on the date when there should be no operation
      RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
        .should('contain', '21.1.2023')
        .and('contain', 'Ei liikennöintiä');
    });

    VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
      '901',
      RouteDirectionEnum.Inbound,
    ).within(() => {
      // Check the timetable on the date when there should be no operation
      RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
        .should('contain', '21.1.2023')
        .and('contain', 'Ei liikennöintiä');
    });

    // Check that next Saturday's timetable remains unaffected
    ObservationDateControl.setObservationDate('2023-01-28');

    VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
      '901',
      RouteDirectionEnum.Outbound,
    ).within(() => {
      RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
        .should('contain', '1.1.2023 - 31.12.2023')
        .and('contain', '6 lähtöä')
        .and('contain', '07:05 ... 09:40');
    });

    VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
      '901',
      RouteDirectionEnum.Inbound,
    ).within(() => {
      RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
        .should('contain', '1.1.2023 - 31.12.2023')
        .and('contain', '6 lähtöä')
        .and('contain', '07:30 ... 10:05');
    });
  });

  it('Should create a substitute period based on a partial day successfully', () => {
    cy.visit('/timetables/settings');
    OccasionalSubstitutePeriodForm.getAddOccasionalSubstitutePeriodButton().click();
    OccasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm({
      nth: 0,
      formInfo: {
        name: 'nimi',
        beginDate: '2023-03-18',
        beginTime: '07:00',
        endDate: '2023-03-18',
        endTime: '09:00',
        substituteDay: 'Perjantai',
        lineTypes: ['Peruslinja'],
      },
    });
    OccasionalSubstitutePeriodForm.getSaveButton().click();
    Toast.expectSuccessToast('Tallennus onnistui');

    // Navigate to route's timetable
    Navbar.getTimetablesLink().click();
    TimetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
    SearchResultsPage.getRouteLineTableRowByLabel('901').click();
    ObservationDateControl.setObservationDate('2023-03-18');

    VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
      '901',
      RouteDirectionEnum.Outbound,
    ).within(() => {
      RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
        .should('contain', '18.3.2023 - 18.3.2023')
        .and('contain', '3 lähtöä')
        .and('contain', '07:00 ... 08:40');
    });

    VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
      '901',
      RouteDirectionEnum.Inbound,
    ).within(() => {
      RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
        .should('contain', '18.3.2023 - 18.3.2023')
        .and('contain', '3 lähtöä')
        .and('contain', '07:10 ... 08:55');
    });

    // Check that next Saturday's timetable remains unaffected
    ObservationDateControl.setObservationDate('2023-03-25');

    VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
      '901',
      RouteDirectionEnum.Outbound,
    ).within(() => {
      // Check that next Saturday's timetable remains unaffected
      RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
        .should('contain', '1.1.2023 - 31.12.2023')
        .and('contain', '6 lähtöä')
        .and('contain', '07:05 ... 09:40');
    });

    VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
      '901',
      RouteDirectionEnum.Inbound,
    ).within(() => {
      // Check that next Saturday's timetable remains unaffected
      RouteTimetablesSection.getVehicleServiceTableByDayType('LA')
        .should('contain', '1.1.2023 - 31.12.2023')
        .and('contain', '6 lähtöä')
        .and('contain', '07:30 ... 10:05');
    });
  });

  // TODO: 'Should not let the user create an occasional reference day that overlaps a static reference day'
});
