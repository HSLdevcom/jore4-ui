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
  SearchResultsPage,
  SubstituteDaySettingsPage,
  TimetablesMainPage,
  Toast,
  VehicleScheduleDetailsPage,
} from '../pageObjects';
import { RouteTimetablesSection } from '../pageObjects/timetables/RouteTimetablesSection';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

describe('Common substitute operating periods', () => {
  let dbResources: SupportedResources;
  let substituteDaySettingsPage: SubstituteDaySettingsPage;
  let vehicleScheduleDetailsPage: VehicleScheduleDetailsPage;
  let routeTimetablesSection: RouteTimetablesSection;
  let timetablesMainPage: TimetablesMainPage;
  let searchResultsPage: SearchResultsPage;
  let navBar: Navbar;
  let toast: Toast;

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

    substituteDaySettingsPage = new SubstituteDaySettingsPage();
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();
    routeTimetablesSection = new RouteTimetablesSection();
    timetablesMainPage = new TimetablesMainPage();
    searchResultsPage = new SearchResultsPage();
    navBar = new Navbar();
    toast = new Toast();

    cy.setupTests();
    cy.mockLogin();
  });

  it(
    'Should create and delete a common substitute operating period successfully',
    { tags: [Tag.Timetables, Tag.Smoke] },
    () => {
      const { searchContainer } = timetablesMainPage;
      cy.visit('/timetables/settings');

      // Make sure the page is clear
      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2023-02-02',
        '2023-02-02',
      );

      cy.getByTestId('ObservationPeriodForm::filterButton').click();

      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2023-01-01',
        '2023-12-31',
      );

      cy.getByTestId('ObservationPeriodForm::filterButton').click();

      // Add a common substitute day
      substituteDaySettingsPage.commonSubstitutePeriodForm.editCommonSubstitutePeriod(
        {
          periodName: 'Tapaninpäivä 2023',
          substituteDay: 'Lauantai',
          lineTypes: ['Peruslinja'],
        },
      );
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .click();
      toast.expectSuccessToast('Tallennus onnistui');

      // Navigate to the vehicleSchedule page
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .should('be.disabled');
      substituteDaySettingsPage.close();

      searchContainer.getSearchInput().type('901{enter}');
      searchResultsPage.getRouteLineTableRowByLabel('901').click();

      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-12-26',
      );

      // Check that the substitute day is the one in effect
      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('TI')
            .should('contain', '26.12.2023 - 26.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:05 ... 09:40');

          routeTimetablesSection
            .getVehicleServiceTableByDayType('MP')
            .should('not.exist');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('TI')
            .should('contain', '26.12.2023 - 26.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:30 ... 10:05');

          routeTimetablesSection
            .getVehicleServiceTableByDayType('MP')
            .should('not.exist');
        });

      vehicleScheduleDetailsPage.getShowAllValidSwitch().click();
      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          // Check that the Boxing day (Tue) is matching with the chosen timetable (Sat)
          routeTimetablesSection
            .getVehicleServiceTableByDayType('TI')
            .should('contain', '26.12.2023 - 26.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:05 ... 09:40');

          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:05 ... 09:40');

          // And check that the Mon-Fri timetable is still visible
          routeTimetablesSection
            .getVehicleServiceTableByDayType('MP')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '06:05 ... 08:40');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          // Check that the Boxing day (Tue) is matching with the chosen timetable (Sat)
          routeTimetablesSection
            .getVehicleServiceTableByDayType('TI')
            .should('contain', '26.12.2023 - 26.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:30 ... 10:05');

          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:30 ... 10:05');

          // And check that the Mon-Fri timetable is still visible
          routeTimetablesSection
            .getVehicleServiceTableByDayType('MP')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '06:30 ... 09:05');
        });

      // Navigate back to timetable settings to remove the added common substitute day
      navBar.getTimetablesLink().click();
      timetablesMainPage.openSettings();

      // Make sure the page is clear
      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2023-02-02',
        '2023-02-02',
      );

      cy.getByTestId('ObservationPeriodForm::filterButton').click();

      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2023-01-01',
        '2023-12-31',
      );

      cy.getByTestId('ObservationPeriodForm::filterButton').click();

      substituteDaySettingsPage.commonSubstitutePeriodForm.removeCommonSubstitutePeriod(
        'Tapaninpäivä 2023',
      );

      toast.expectSuccessToast('Tallennus onnistui');

      // And navigate again to the vehicle schedules
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .should('be.disabled');
      substituteDaySettingsPage.close();

      searchContainer.getSearchInput().type('901{enter}');
      searchResultsPage.getRouteLineTableRowByLabel('901').click();

      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-12-26',
      );

      // Check that on Boxing day the substituteDay (Tue) no longer exists
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

          // Check that the substituteDay (Tue) is no longer existing
          routeTimetablesSection
            .getVehicleServiceTableByDayType('TI')
            .should('not.exist');
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

          // Check that the substituteDay (Tue) is no longer existing
          routeTimetablesSection
            .getVehicleServiceTableByDayType('TI')
            .should('not.exist');
        });

      // Finally check that Mon-Fri is the one in effect on Boxing day by toggling "show all valid" off
      vehicleScheduleDetailsPage.getShowAllValidSwitch().click();

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('MP')
            .shouldBeVisible();
        });
      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('MP')
            .shouldBeVisible();
        });
    },
  );

  it(
    "Should create and delete a 'No traffic' common substitute operating period successfully",
    { tags: [Tag.Timetables, Tag.Smoke] },
    () => {
      const { searchContainer } = timetablesMainPage;
      cy.visit('/timetables/settings');

      // Make sure the page is clear
      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2023-02-02',
        '2023-02-02',
      );

      cy.getByTestId('ObservationPeriodForm::filterButton').click();

      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2023-01-01',
        '2023-12-31',
      );

      cy.getByTestId('ObservationPeriodForm::filterButton').click();

      // Add a common substitute day
      substituteDaySettingsPage.commonSubstitutePeriodForm.editCommonSubstitutePeriod(
        {
          periodName: 'Tapaninpäivä 2023',
          substituteDay: 'Ei liikennöintiä',
          lineTypes: ['Kaikki'],
        },
      );
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .click();
      toast.expectSuccessToast('Tallennus onnistui');

      // Navigate to the vehicleSchedule page
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .should('be.disabled');
      substituteDaySettingsPage.close();

      searchContainer.getSearchInput().type('901{enter}');
      searchResultsPage.getRouteLineTableRowByLabel('901').click();

      // Check that there is no trafficking on boxing day
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-12-26',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('TI')
            .should('contain', '26.12.2023 - 26.12.2023')
            .and('contain', 'Ei liikennöintiä');

          // As we have not toggled the "show all valid", Mon-Fri schedules should not exist
          routeTimetablesSection
            .getVehicleServiceTableByDayType('MP')
            .should('not.exist');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('TI')
            .should('contain', '26.12.2023 - 26.12.2023')
            .and('contain', 'Ei liikennöintiä');

          // As we have not toggled the "show all valid", Mon-Fri schedules should not exist
          routeTimetablesSection
            .getVehicleServiceTableByDayType('MP')
            .should('not.exist');
        });

      // Navigate back to timetable settings
      navBar.getTimetablesLink().click();
      timetablesMainPage.openSettings();

      // Make sure the page is clear
      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2023-02-02',
        '2023-02-02',
      );

      cy.getByTestId('ObservationPeriodForm::filterButton').click();

      // Remove the boxing day substitute day setting
      substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
        '2023-01-01',
        '2023-12-31',
      );

      cy.getByTestId('ObservationPeriodForm::filterButton').click();

      substituteDaySettingsPage.commonSubstitutePeriodForm.removeCommonSubstitutePeriod(
        'Tapaninpäivä 2023',
      );

      // And navigate again to the vehicle schedules
      substituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .should('be.disabled');
      substituteDaySettingsPage.close();

      searchContainer.getSearchInput().type('901{enter}');
      searchResultsPage.getRouteLineTableRowByLabel('901').click();

      // Check that the Boxing day schedule has trafficking
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-12-26',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('MP')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '06:05 ... 08:40');

          routeTimetablesSection
            .getVehicleServiceTableByDayType('TI')
            .should('not.exist');
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
            .getVehicleServiceTableByDayType('TI')
            .should('not.exist');
        });
    },
  );

  describe('Overlapping dates', () => {
    it(
      'Should not let the user create a common substitute day that overlaps an occasional substitute day',
      { tags: [Tag.Timetables] },
      () => {
        cy.visit('/timetables/settings');

        // Add an occasional substitute day
        substituteDaySettingsPage.occasionalSubstitutePeriodForm
          .getAddOccasionalSubstitutePeriodButton()
          .click();
        substituteDaySettingsPage.occasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm(
          {
            nth: 0,
            formInfo: {
              name: 'Poikkeusjakson nimi',
              beginDate: '2023-12-26',
              beginTime: '04:30',
              endDate: '2023-12-26',
              endTime: '28:30',
              substituteDay: 'Sunnuntai',
              lineTypes: ['Peruslinja'],
            },
          },
        );
        substituteDaySettingsPage.occasionalSubstitutePeriodForm
          .getSaveButton()
          .click();

        toast.expectSuccessToast('Tallennus onnistui');

        // Make sure the page is clear
        substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
          '2023-02-02',
          '2023-02-02',
        );

        cy.getByTestId('ObservationPeriodForm::filterButton').click();

        substituteDaySettingsPage.observationPeriodForm.setObservationPeriod(
          '2023-01-01',
          '2023-12-31',
        );

        cy.getByTestId('ObservationPeriodForm::filterButton').click();

        // Try to add a common substitute day
        substituteDaySettingsPage.commonSubstitutePeriodForm.editCommonSubstitutePeriod(
          {
            periodName: 'Tapaninpäivä 2023',
            substituteDay: 'Sunnuntai',
            lineTypes: ['Peruslinja'],
          },
        );

        substituteDaySettingsPage.commonSubstitutePeriodForm
          .getSaveButton()
          .click();
        substituteDaySettingsPage.toast.expectDangerToast(
          'Tallennus epäonnistui: GraphQL errors: Exclusion violation. conflicting key ' +
            'value violates exclusion constraint "substitute_operating_day_by_line_type_no_timespan_overlap"',
        );
      },
    );
  });
});
