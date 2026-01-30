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
  ObservationPeriodForm,
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
describe('Common substitute operating periods', rootTags, () => {
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
    'Should create and delete a common substitute operating period successfully',
    { tags: [Tag.Smoke] },
    () => {
      const { searchContainer } = TimetablesMainPage;
      cy.visit('/timetables/settings');

      // Make sure the page is clear
      ObservationPeriodForm.setObservationPeriod('2023-01-01', '2023-12-31');

      cy.getByTestId('ObservationPeriodForm::filterButton').click();
      SubstituteDaySettingsPage.getLoadingCommonSubstitutePeriods().should(
        'not.exist',
      );

      // Add a common substitute day
      SubstituteDaySettingsPage.commonSubstitutePeriodForm.editCommonSubstitutePeriod(
        {
          periodName: 'Tapaninpäivä 2023',
          substituteDay: 'Lauantai',
          lineTypes: ['Peruslinja'],
        },
      );
      SubstituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .should('be.enabled')
        .click();
      Toast.expectSuccessToast('Tallennus onnistui');

      // Navigate to the vehicleSchedule page
      SubstituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .should('be.disabled');
      SubstituteDaySettingsPage.close();

      searchContainer.getSearchInput().type('901{enter}');
      SearchResultsPage.getRouteLineTableRowByLabel('901').click();

      ObservationDateControl.setObservationDate('2023-12-26');

      // Check that the substitute day is the one in effect
      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Outbound,
      ).within(() => {
        RouteTimetablesSection.getVehicleServiceTableByDayType('TI')
          .should('contain', '26.12.2023 - 26.12.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '07:05 ... 09:40');

        RouteTimetablesSection.getVehicleServiceTableByDayType('MP').should(
          'not.exist',
        );
      });

      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Inbound,
      ).within(() => {
        RouteTimetablesSection.getVehicleServiceTableByDayType('TI')
          .should('contain', '26.12.2023 - 26.12.2023')
          .and('contain', '6 lähtöä')
          .and('contain', '07:30 ... 10:05');

        RouteTimetablesSection.getVehicleServiceTableByDayType('MP').should(
          'not.exist',
        );
      });

      VehicleScheduleDetailsPage.getShowAllValidSwitch().click();
      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Outbound,
      ).within(() => {
        // Check that the Boxing day (Tue) is matching with the chosen timetable (Sat)
        RouteTimetablesSection.getVehicleServiceTableByDayType('TI')
          .should('contain', '26.12.2023 - 26.12.2023')
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
        // Check that the Boxing day (Tue) is matching with the chosen timetable (Sat)
        RouteTimetablesSection.getVehicleServiceTableByDayType('TI')
          .should('contain', '26.12.2023 - 26.12.2023')
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

      // Navigate back to timetable settings to remove the added common substitute day
      Navbar.getTimetablesLink().click();
      TimetablesMainPage.openSettings();

      // Make sure the page is clear
      ObservationPeriodForm.setObservationPeriod('2023-01-01', '2023-12-31');
      cy.getByTestId('ObservationPeriodForm::filterButton').click();
      SubstituteDaySettingsPage.getLoadingCommonSubstitutePeriods().should(
        'not.exist',
      );

      SubstituteDaySettingsPage.commonSubstitutePeriodForm.removeCommonSubstitutePeriod(
        'Tapaninpäivä 2023',
      );

      Toast.expectSuccessToast('Tallennus onnistui');

      // And navigate again to the vehicle schedules
      SubstituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .should('be.disabled');
      SubstituteDaySettingsPage.close();

      searchContainer.getSearchInput().type('901{enter}');
      SearchResultsPage.getRouteLineTableRowByLabel('901').click();

      ObservationDateControl.setObservationDate('2023-12-26');

      // Check that on Boxing day the substituteDay (Tue) no longer exists
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

        // Check that the substituteDay (Tue) is no longer existing
        RouteTimetablesSection.getVehicleServiceTableByDayType('TI').should(
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

        // Check that the substituteDay (Tue) is no longer existing
        RouteTimetablesSection.getVehicleServiceTableByDayType('TI').should(
          'not.exist',
        );
      });

      // Finally check that Mon-Fri is the one in effect on Boxing day by toggling "show all valid" off
      VehicleScheduleDetailsPage.getShowAllValidSwitch().click();

      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Outbound,
      ).within(() => {
        RouteTimetablesSection.getVehicleServiceTableByDayType(
          'MP',
        ).shouldBeVisible();
      });
      VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
        '901',
        RouteDirectionEnum.Inbound,
      ).within(() => {
        RouteTimetablesSection.getVehicleServiceTableByDayType(
          'MP',
        ).shouldBeVisible();
      });
    },
  );

  it("Should create and delete a 'No traffic' common substitute operating period successfully", () => {
    const { searchContainer } = TimetablesMainPage;
    cy.visit('/timetables/settings');

    // Make sure the page is clear
    ObservationPeriodForm.setObservationPeriod('2023-02-02', '2023-02-02');

    cy.getByTestId('ObservationPeriodForm::filterButton').click();

    ObservationPeriodForm.setObservationPeriod('2023-01-01', '2023-12-31');

    cy.getByTestId('ObservationPeriodForm::filterButton').click();

    // Add a common substitute day
    SubstituteDaySettingsPage.commonSubstitutePeriodForm.editCommonSubstitutePeriod(
      {
        periodName: 'Tapaninpäivä 2023',
        substituteDay: 'Ei liikennöintiä',
        lineTypes: ['Kaikki'],
      },
    );
    SubstituteDaySettingsPage.commonSubstitutePeriodForm
      .getSaveButton()
      .click();
    Toast.expectSuccessToast('Tallennus onnistui');

    // Navigate to the vehicleSchedule page
    SubstituteDaySettingsPage.commonSubstitutePeriodForm
      .getSaveButton()
      .should('be.disabled');
    SubstituteDaySettingsPage.close();

    searchContainer.getSearchInput().type('901{enter}');
    SearchResultsPage.getRouteLineTableRowByLabel('901').click();

    // Check that there is no trafficking on boxing day
    ObservationDateControl.setObservationDate('2023-12-26');

    VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
      '901',
      RouteDirectionEnum.Outbound,
    ).within(() => {
      RouteTimetablesSection.getVehicleServiceTableByDayType('TI')
        .should('contain', '26.12.2023 - 26.12.2023')
        .and('contain', 'Ei liikennöintiä');

      // As we have not toggled the "show all valid", Mon-Fri schedules should not exist
      RouteTimetablesSection.getVehicleServiceTableByDayType('MP').should(
        'not.exist',
      );
    });

    VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
      '901',
      RouteDirectionEnum.Inbound,
    ).within(() => {
      RouteTimetablesSection.getVehicleServiceTableByDayType('TI')
        .should('contain', '26.12.2023 - 26.12.2023')
        .and('contain', 'Ei liikennöintiä');

      // As we have not toggled the "show all valid", Mon-Fri schedules should not exist
      RouteTimetablesSection.getVehicleServiceTableByDayType('MP').should(
        'not.exist',
      );
    });

    // Navigate back to timetable settings
    Navbar.getTimetablesLink().click();
    TimetablesMainPage.openSettings();

    // Make sure the page is clear
    ObservationPeriodForm.setObservationPeriod('2023-02-02', '2023-02-02');

    cy.getByTestId('ObservationPeriodForm::filterButton').click();

    // Remove the boxing day substitute day setting
    ObservationPeriodForm.setObservationPeriod('2023-01-01', '2023-12-31');

    cy.getByTestId('ObservationPeriodForm::filterButton').click();

    SubstituteDaySettingsPage.commonSubstitutePeriodForm.removeCommonSubstitutePeriod(
      'Tapaninpäivä 2023',
    );

    // And navigate again to the vehicle schedules
    SubstituteDaySettingsPage.commonSubstitutePeriodForm
      .getSaveButton()
      .should('be.disabled');
    SubstituteDaySettingsPage.close();

    searchContainer.getSearchInput().type('901{enter}');
    SearchResultsPage.getRouteLineTableRowByLabel('901').click();

    // Check that the Boxing day schedule has trafficking
    ObservationDateControl.setObservationDate('2023-12-26');

    VehicleScheduleDetailsPage.getRouteSectionByLabelAndDirection(
      '901',
      RouteDirectionEnum.Outbound,
    ).within(() => {
      RouteTimetablesSection.getVehicleServiceTableByDayType('MP')
        .should('contain', '1.1.2023 - 31.12.2023')
        .and('contain', '6 lähtöä')
        .and('contain', '06:05 ... 08:40');

      RouteTimetablesSection.getVehicleServiceTableByDayType('TI').should(
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

      RouteTimetablesSection.getVehicleServiceTableByDayType('TI').should(
        'not.exist',
      );
    });
  });

  describe('Overlapping dates', () => {
    it('Should not let the user create a common substitute day that overlaps an occasional substitute day', () => {
      cy.visit('/timetables/settings');

      // Add an occasional substitute day
      OccasionalSubstitutePeriodForm.getAddOccasionalSubstitutePeriodButton().click();
      OccasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm({
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
      });
      OccasionalSubstitutePeriodForm.getSaveButton().click();

      Toast.expectSuccessToast('Tallennus onnistui');

      // Make sure the page is clear
      ObservationPeriodForm.setObservationPeriod('2023-02-02', '2023-02-02');

      cy.getByTestId('ObservationPeriodForm::filterButton').click();

      ObservationPeriodForm.setObservationPeriod('2023-01-01', '2023-12-31');

      cy.getByTestId('ObservationPeriodForm::filterButton').click();

      // Try to add a common substitute day
      SubstituteDaySettingsPage.commonSubstitutePeriodForm.editCommonSubstitutePeriod(
        {
          periodName: 'Tapaninpäivä 2023',
          substituteDay: 'Sunnuntai',
          lineTypes: ['Peruslinja'],
        },
      );

      SubstituteDaySettingsPage.commonSubstitutePeriodForm
        .getSaveButton()
        .click();
      Toast.expectDangerToast(
        'Tallennus epäonnistui: GraphQL errors: Exclusion violation. conflicting key ' +
          'value violates exclusion constraint "substitute_operating_day_by_line_type_no_timespan_overlap"',
      );
    });
  });
});
