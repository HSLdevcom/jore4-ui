import {
  GetInfrastructureLinksByExternalIdsResult,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  RouteInsertInput,
  RouteTypeOfLineEnum,
  StopInJourneyPatternInsertInput,
  StopInsertInput,
  buildLine,
  buildRoute,
  buildStop,
  buildStopInJourneyPattern,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  mapToGetInfrastructureLinksByExternalIdsQuery,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import {
  ImportTimetablesPage,
  PreviewTimetablesPage,
  RouteTimetablesSection,
  SubstituteDaySettingsPage,
  TimetablesMainpage,
  Toast,
  VehicleScheduleDetailsPage,
  VehicleServiceTable,
} from '../pageObjects';
import { UUID } from '../types';
import {
  SupportedResources,
  insertToDbHelper,
  removeFromDbHelper,
} from '../utils';

// These infralink IDs exist in the 'infraLinks.sql' test data file.
// These form a straight line on Eerikinkatu in Helsinki.
// Coordinates are partial since they are needed only for the stop creation.

const testInfraLinks = [
  {
    externalId: '445156',
    coordinates: [24.926699622176628, 60.164181083308065, 10.0969999999943],
  },
  {
    externalId: '442424',
    coordinates: [24.92904198486008, 60.16490775039894, 0],
  },
  {
    externalId: '442325',
    coordinates: [24.932072417514647, 60.166003223527824, 0],
  },
];

const stopLabels = ['H1234', 'H1235', 'H1236'];

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '1234' }),
    line_id: '417e85bd-c9cb-48f5-8562-f5e2ec3f8d8c',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService, // Peruslinja
  },
];

const timingPlaces = [
  buildTimingPlace('6fb2ea98-21a8-470e-8647-47d7e6045b9c', '1AACKT'),
  buildTimingPlace('fc924d71-e22f-4816-8934-1e0079809dab', '1AURLA'),
];

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    scheduled_stop_point_id: '536631c5-968f-4ac9-9b89-874679922ed9',
    timing_place_id: timingPlaces[0].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[0].coordinates,
    },
  },
  {
    ...buildStop({
      label: stopLabels[1],
      located_on_infrastructure_link_id: infrastructureLinkIds[1],
    }),
    scheduled_stop_point_id: 'c7bb1d58-c7eb-4c36-aa97-46c6bc7c8b65',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[1].coordinates,
    },
  },
  {
    ...buildStop({
      label: stopLabels[2],
      located_on_infrastructure_link_id: infrastructureLinkIds[2],
    }),
    scheduled_stop_point_id: '18f3fe57-ca16-4fa3-9781-ea4df196017e',
    timing_place_id: timingPlaces[1].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '99' }),
    route_id: '25a391a2-91c7-42ce-8e97-253dffc3f40b',
    on_line_id: lines[0].line_id,
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2032-08-11T13:08:43.315+03:00'),
  },
];

const buildInfraLinksAlongRoute = (
  infrastructureLinkIds: UUID[],
): InfraLinkAlongRouteInsertInput[] => [
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[0],
    infrastructure_link_sequence: 0,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[1],
    infrastructure_link_sequence: 1,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[2],
    infrastructure_link_sequence: 2,
    is_traversal_forwards: true,
  },
];

const journeyPatterns: JourneyPatternInsertInput[] = [
  {
    journey_pattern_id: 'a7f7a166-0b12-474b-940b-a5d2da9ad24b',
    on_route_id: routes[0].route_id,
  },
];

const stopsInJourneyPattern: StopInJourneyPatternInsertInput[] = [
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: stopLabels[0],
    scheduledStopPointSequence: 0,
    isUsedAsTimingPoint: true,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: stopLabels[1],
    scheduledStopPointSequence: 1,
    isUsedAsTimingPoint: false,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: stopLabels[2],
    scheduledStopPointSequence: 2,
    isUsedAsTimingPoint: true,
  }),
];

describe('Substitute operating periods', () => {
  let timetablesMainPage: TimetablesMainpage;
  let importTimetablesPage: ImportTimetablesPage;
  let previewTimetablesPage: PreviewTimetablesPage;
  let substituteDaySettingsPage: SubstituteDaySettingsPage;
  let toast: Toast;
  let vehicleScheduleDetailsPage: VehicleScheduleDetailsPage;

  const baseDbResources = {
    lines,
    routes,
    journeyPatterns,
    stopsInJourneyPattern,
  };
  let dbResources: SupportedResources;

  before(() => {
    cy.task<GetInfrastructureLinksByExternalIdsResult>(
      'hasuraAPI',
      mapToGetInfrastructureLinksByExternalIdsQuery(
        testInfraLinks.map((infralink) => infralink.externalId),
      ),
    ).then((res) => {
      const infraLinkIds = extractInfrastructureLinkIdsFromResponse(res);
      const stops = buildStopsOnInfrastrucureLinks(infraLinkIds);
      const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);
      dbResources = {
        ...baseDbResources,
        timingPlaces,
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  beforeEach(() => {
    cy.task('truncateTimetablesDatabase');
    removeFromDbHelper(dbResources);
    insertToDbHelper(dbResources);

    timetablesMainPage = new TimetablesMainpage();
    importTimetablesPage = new ImportTimetablesPage();
    previewTimetablesPage = new PreviewTimetablesPage();
    substituteDaySettingsPage = new SubstituteDaySettingsPage();
    toast = new Toast();
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();

    const IMPORT_FILENAME = 'hastusImportSaturday.exp';
    const IMPORT_FILENAME_2 = 'hastusImportSunday.exp';

    cy.setupTests();
    cy.mockLogin();
    cy.visit('/timetables');

    // TODO: Change timetable importing to proper test data generation when it is available
    timetablesMainPage.getImportButton().click();
    importTimetablesPage.selectFilesToImport([
      IMPORT_FILENAME,
      IMPORT_FILENAME_2,
    ]);
    importTimetablesPage.getUploadButton().click();
    cy.wait('@hastusImport').its('response.statusCode').should('equal', 200);
    importTimetablesPage.clickPreviewButton();
    previewTimetablesPage.priorityForm.setAsStandard();
    previewTimetablesPage.getSaveButton().click();
    importTimetablesPage.toast.checkSuccessToastHasMessage(
      'Aikataulujen tuonti onnistui!',
    );
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');
  });

  it(
    'Should create and delete an occasional substitute operating period successfully',
    { tags: [Tag.Timetables, Tag.Smoke] },
    () => {
      const route99InboundTimetableSection = new RouteTimetablesSection(
        '99',
        'inbound',
      );

      const route99InboundSaturdayVehicleService = new VehicleServiceTable(
        route99InboundTimetableSection,
        'LA',
      );

      const route99InboundSundayVehicleService = new VehicleServiceTable(
        route99InboundTimetableSection,
        'SU',
      );

      cy.visit('/timetables');

      timetablesMainPage.getSettingsButton().click();
      // Clicking the '+' button does not always work without some waiting
      cy.wait([
        '@gqlGetSubstituteOperatingPeriods',
        '@gqlGetSubstituteOperatingPeriods',
      ]);

      // Add an occasional substitute day
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.openOccasionalSubstitutePeriodForm();
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.fillOccasionalSubstitutePeriodForm(
        {
          name: 'nimi',
          beginDate: '2025-03-08',
          beginTime: '04:30',
          endDate: '2025-03-08',
          endTime: '28:30',
          substituteDay: 'Sunnuntai',
          lineType: 'Peruslinja',
        },
      );
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getSaveButton()
        .click();
      cy.wait('@gqlCreateSubstituteOperatingPeriod')
        .its('response.statusCode')
        .should('equal', 200);
      toast.checkWarningToastHasMessage('Suodatusjaksoa muutettu');

      // Check that the Saturday schedule is the same as the Sunday schedule
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2025-03-08&routeLabels=${routes[0].label}`,
      );
      vehicleScheduleDetailsPage.showAllValidSwitch().click();
      route99InboundSaturdayVehicleService
        .get()
        .should('contain', '8.3.2025 - 8.3.2025')
        .and('contain', '4 lähtöä')
        .and('contain', '09:10 ... 11:20');
      route99InboundSundayVehicleService
        .get()
        .should('contain', '1.1.2023 - 30.6.2043')
        .and('contain', '4 lähtöä')
        .and('contain', '09:10 ... 11:20');

      // Remove the substitute day
      cy.visit('/timetables/settings');
      substituteDaySettingsPage.observationPeriodForm.setStartDate(
        '2025-03-08',
      );
      substituteDaySettingsPage.observationPeriodForm.setEndDate('2025-03-08');
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getRemoveOccasionalSubstitutePeriodButton()
        .click();
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getSaveButton()
        .click();

      // Check that the Saturday schedule is not the same as the Sunday schedule
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2025-03-08&routeLabels=${routes[0].label}`,
      );
      vehicleScheduleDetailsPage.showAllValidSwitch().click();
      route99InboundSaturdayVehicleService
        .get()
        .should('contain', '1.1.2023 - 30.6.2043')
        .and('contain', '2 lähtöä')
        .and('contain', '07:10 ... 08:20');
      route99InboundSundayVehicleService
        .get()
        .should('contain', '1.1.2023 - 30.6.2043')
        .and('contain', '4 lähtöä')
        .and('contain', '09:10 ... 11:20');
    },
  );

  it(
    "Should create a 'No traffic' day successfully",
    { tags: [Tag.Timetables] },
    () => {
      const route99InboundTimetableSection = new RouteTimetablesSection(
        '99',
        'inbound',
      );

      const route99InboundSaturdayVehicleService = new VehicleServiceTable(
        route99InboundTimetableSection,
        'LA',
      );

      // Create a "No traffic" day
      cy.visit('/timetables');
      timetablesMainPage.getSettingsButton().click();
      // Clicking the '+' button does not always work without some waiting
      cy.wait([
        '@gqlGetSubstituteOperatingPeriods',
        '@gqlGetSubstituteOperatingPeriods',
      ]);
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.openOccasionalSubstitutePeriodForm();
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.fillOccasionalSubstitutePeriodForm(
        {
          name: 'Ei liikennöintiä -päivä',
          beginDate: '2024-01-20',
          beginTime: '04:30',
          endDate: '2024-01-20',
          endTime: '28:30',
          substituteDay: 'Ei liikennöintiä',
          lineType: 'Peruslinja',
        },
      );
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getSaveButton()
        .click();
      cy.wait('@gqlCreateSubstituteOperatingPeriod')
        .its('response.statusCode')
        .should('equal', 200);

      // Check the timetable on the date when there should be no operation
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2024-01-20&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService
        .get()
        .should('contain', 'Ei liikennöintiä');
    },
  );

  it(
    'Should create a substitute period based on a partial day successfully',
    // TODO: Refactor this spec to use timetables data inserter, create timetable data with a longer time span
    // and create the occasional test day so that it omits traffic both from the beginning and end of the day
    { tags: [Tag.Timetables] },
    () => {
      const route99InboundTimetableSection = new RouteTimetablesSection(
        '99',
        'inbound',
      );

      const route99InboundSaturdayVehicleService = new VehicleServiceTable(
        route99InboundTimetableSection,
        'LA',
      );

      cy.visit('/timetables');
      timetablesMainPage.getSettingsButton().click();
      // Clicking the '+' button does not always work without some waiting
      cy.wait([
        '@gqlGetSubstituteOperatingPeriods',
        '@gqlGetSubstituteOperatingPeriods',
      ]);
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.openOccasionalSubstitutePeriodForm();
      substituteDaySettingsPage.occasionalSubstitutePeriodForm.fillOccasionalSubstitutePeriodForm(
        {
          name: 'nimi',
          beginDate: '2025-03-15',
          beginTime: '10:00',
          endDate: '2025-03-15',
          endTime: '12:00',
          substituteDay: 'Sunnuntai',
          lineType: 'Peruslinja',
        },
      );
      substituteDaySettingsPage.occasionalSubstitutePeriodForm
        .getSaveButton()
        .click();
      cy.wait('@gqlCreateSubstituteOperatingPeriod')
        .its('response.statusCode')
        .should('equal', 200);

      // Check that the setting was applied to the selected date
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2025-03-15&routeLabels=${routes[0].label}`,
      );
      route99InboundSaturdayVehicleService
        .get()
        .should('contain', '15.3.2025 - 15.3.2025')
        .and('contain', '2 lähtöä')
        .and('contain', '10:20 ... 11:20');
    },
  );

  // TODO: 'Should not let the user create an occasional reference day that overlaps a static reference day'
});
