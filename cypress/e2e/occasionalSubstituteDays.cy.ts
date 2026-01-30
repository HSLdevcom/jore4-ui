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

describe(
  'Occasional substitute operating periods',
  { tags: [Tag.Timetables] },
  () => {
    let dbResources: SupportedResources;
    let substituteDaySettingsPage: SubstituteDaySettingsPage;
    let toast: Toast;
    let vehicleScheduleDetailsPage: VehicleScheduleDetailsPage;
    let routeTimetablesSection: RouteTimetablesSection;
    let navbar: Navbar;
    let searchResultsPage: SearchResultsPage;
    let timetablesMainPage: TimetablesMainPage;

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
      toast = new Toast();
      vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();
      routeTimetablesSection = new RouteTimetablesSection();
      navbar = new Navbar();
      searchResultsPage = new SearchResultsPage();
      timetablesMainPage = new TimetablesMainPage();

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
        substituteDaySettingsPage.observationPeriodForm.setStartDate(
          '2022-01-01',
        );
        substituteDaySettingsPage.observationPeriodForm.setEndDate(
          '2022-12-31',
        );
        // Add an occasional substitute day
        substituteDaySettingsPage.occasionalSubstitutePeriodForm
          .getAddOccasionalSubstitutePeriodButton()
          .click();

        cy.getByTestId('ObservationPeriodForm::warningMessage').shouldHaveText(
          'Tallenna tai hylkää lomakkeen muutokset',
        );

        substituteDaySettingsPage.occasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm(
          {
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
          },
        );
        substituteDaySettingsPage.occasionalSubstitutePeriodForm
          .getSaveButton()
          .click();
        toast.expectSuccessToast('Tallennus onnistui');

        // Navigate to route's timetable
        navbar.getTimetablesLink().click();
        timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
        searchResultsPage.getRouteLineTableRowByLabel('901').click();
        vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
          '2023-03-08',
        );
        vehicleScheduleDetailsPage.getShowAllValidSwitch().click();

        vehicleScheduleDetailsPage
          .getRouteSectionByLabelAndDirection(
            '901',
            RouteDirectionEnum.Outbound,
          )
          .within(() => {
            // Check that the substituteDay (Wed) is matching with the chosen timetable (Sat)
            routeTimetablesSection
              .getVehicleServiceTableByDayType('KE')
              .should('contain', '8.3.2023 - 8.3.2023')
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
            // Check that the substituteDay (Wed) is matching with the chosen timetable (Sat)
            routeTimetablesSection
              .getVehicleServiceTableByDayType('KE')
              .should('contain', '8.3.2023 - 8.3.2023')
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

        // Remove the substitute day
        navbar.getTimetablesLink().click();
        timetablesMainPage.getSettingsButton().click();
        substituteDaySettingsPage.observationPeriodForm.setStartDate(
          '2023-03-08',
        );
        substituteDaySettingsPage.observationPeriodForm.setEndDate(
          '2023-03-08',
        );
        substituteDaySettingsPage.commonSubstitutePeriodForm
          .getSaveButton()
          .shouldBeVisible();

        cy.getByTestId('ObservationPeriodForm::filterButton').click();

        substituteDaySettingsPage.occasionalSubstitutePeriodForm.deleteNthOccasionalSubstituteDay(
          0,
        );
        substituteDaySettingsPage.occasionalSubstitutePeriodForm
          .getSaveButton()
          .click();
        toast.expectSuccessToast('Tallennus onnistui');

        // Navigate to route's timetable
        navbar.getTimetablesLink().click();
        timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
        searchResultsPage.getRouteLineTableRowByLabel('901').click();
        vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
          '2023-03-08',
        );

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

            routeTimetablesSection
              .getVehicleServiceTableByDayType('LA')
              .should('contain', '1.1.2023 - 31.12.2023')
              .and('contain', '6 lähtöä')
              .and('contain', '07:05 ... 09:40');

            // Check that the substituteDay (Wed) is no longer existing
            routeTimetablesSection
              .getVehicleServiceTableByDayType('KE')
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

            // Check that the substituteDay (Wed) is no longer existing
            routeTimetablesSection
              .getVehicleServiceTableByDayType('KE')
              .should('not.exist');
          });
      },
    );

    it("Should create a 'No traffic' day successfully", () => {
      cy.visit('/timetables/settings');
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getAddOccasionalSubstitutePeriodButton()
        .click();
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm(
        {
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
        },
      );
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getSaveButton()
        .click();
      toast.expectSuccessToast('Tallennus onnistui');

      // Navigate to route's timetable
      navbar.getTimetablesLink().click();
      timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
      searchResultsPage.getRouteLineTableRowByLabel('901').click();
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-01-21',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          // Check the timetable on the date when there should be no operation
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '21.1.2023')
            .and('contain', 'Ei liikennöintiä');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          // Check the timetable on the date when there should be no operation
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '21.1.2023')
            .and('contain', 'Ei liikennöintiä');
        });

      // Check that next Saturday's timetable remains unaffected
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-01-28',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
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
    });

    it('Should create a substitute period based on a partial day successfully', () => {
      cy.visit('/timetables/settings');
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getAddOccasionalSubstitutePeriodButton()
        .click();
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.fillNthOccasionalSubstitutePeriodForm(
        {
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
        },
      );
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getSaveButton()
        .click();
      toast.expectSuccessToast('Tallennus onnistui');

      // Navigate to route's timetable
      navbar.getTimetablesLink().click();
      timetablesMainPage.searchContainer.getSearchInput().type('901{enter}');
      searchResultsPage.getRouteLineTableRowByLabel('901').click();
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-03-18',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '18.3.2023 - 18.3.2023')
            .and('contain', '3 lähtöä')
            .and('contain', '07:00 ... 08:40');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '18.3.2023 - 18.3.2023')
            .and('contain', '3 lähtöä')
            .and('contain', '07:10 ... 08:55');
        });

      // Check that next Saturday's timetable remains unaffected
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2023-03-25',
      );

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Outbound)
        .within(() => {
          // Check that next Saturday's timetable remains unaffected
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:05 ... 09:40');
        });

      vehicleScheduleDetailsPage
        .getRouteSectionByLabelAndDirection('901', RouteDirectionEnum.Inbound)
        .within(() => {
          // Check that next Saturday's timetable remains unaffected
          routeTimetablesSection
            .getVehicleServiceTableByDayType('LA')
            .should('contain', '1.1.2023 - 31.12.2023')
            .and('contain', '6 lähtöä')
            .and('contain', '07:30 ... 10:05');
        });
    });

    // TODO: 'Should not let the user create an occasional reference day that overlaps a static reference day'
  },
);
