import {
  GetInfrastructureLinksByExternalIdsResult,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  RouteInsertInput,
  StopInsertInput,
  buildLine,
  buildRoute,
  buildStop,
  buildStopsInJourneyPattern,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  mapToGetInfrastructureLinksByExternalIdsQuery,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import {
  ImportTimetablesPage,
  PreviewTimetablesPage,
  TimetablesMainpage,
  VehicleScheduleDetailsPage,
} from '../pageObjects';
import { RouteTimetablesSectionTwo } from '../pageObjects/RouteTimetablesSectionTwo';
import { VehicleServiceTableTwo } from '../pageObjects/VehicleServiceTableTwo';
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
    line_id: '4b8c8f84-12bc-4716-b15e-476f0efaa645',
  },
];

const timingPlaces = [
  buildTimingPlace('0f61ad5c-9035-4b62-8120-92e39baf3e24', '1AACKT'),
  buildTimingPlace('d631db3e-6501-4d05-812d-937bc6c8423e', '1ELIMK'),
  buildTimingPlace('53285ed7-5ca6-48ce-9853-d9613cc5995f', '1AURLA'),
];

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    scheduled_stop_point_id: '12fe9420-94c5-4619-bb99-541087b542b7',
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
    scheduled_stop_point_id: '9a9cbf66-44ce-4aea-8c2a-23ae963d24fb',
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
    scheduled_stop_point_id: '21ea80fa-9a00-462a-b644-abe7a75597ff',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '99' }),
    route_id: 'c82987b1-87f8-474e-99aa-07350a474efd',
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

const stopsInJourneyPattern = buildStopsInJourneyPattern(
  stopLabels,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  journeyPatterns[0].journey_pattern_id!,
);

describe('Timetable validity period', () => {
  let timetablesMainPage: TimetablesMainpage;
  let importTimetablesPage: ImportTimetablesPage;
  let previewTimetablesPage: PreviewTimetablesPage;
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
    vehicleScheduleDetailsPage = new VehicleScheduleDetailsPage();

    const IMPORT_FILENAME = 'hastusImport.exp';

    cy.setupTests();
    cy.mockLogin();
    cy.visit('/timetables');

    // TODO: Change timetable importing to proper test data generation when it is available
    timetablesMainPage.getImportButton().click();
    importTimetablesPage.selectFileToImport(IMPORT_FILENAME);
    importTimetablesPage.getUploadButton().click();
    cy.wait('@hastusImport').its('response.statusCode').should('equal', 200);
    importTimetablesPage.clickPreviewButton();
    previewTimetablesPage.priorityForm.setAsStandard();
    previewTimetablesPage.blockVehicleJourneysTable
      .getToggleShowTableButton()
      .click();
    previewTimetablesPage.getSaveButton().click();
    importTimetablesPage.toast.checkSuccessToastHasMessage(
      'Aikataulujen tuonti onnistui!',
    );
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
    cy.task('truncateTimetablesDatabase');
  });

  it.only(
    "Should change a timetable's validity period",
    { tags: [Tag.Timetables] },
    () => {
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2023-04-29&routeLabels=${routes[0].label}`,
      );
      const route99InboundTimetableSection = new RouteTimetablesSectionTwo(
        '99',
        'inbound',
      );

      const route99InboundSaturdayVehicleService = new VehicleServiceTableTwo(
        route99InboundTimetableSection,
        'LA',
      );

      route99InboundSaturdayVehicleService.clickChangeValidityDate();

      // vehicleScheduleDetailsPage.vehicleJourneyGroupInfo
      //   .getChangeValidityButton()
      //   .click();
      vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityStartDate(
        '2025-03-03',
      );

      vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityEndDate(
        '2026-03-03',
      );

      vehicleScheduleDetailsPage.changeTimetablesValidityForm
        .getSaveButton()
        .click();

      cy.wait('@gqlUpdateVehicleScheduleFrameValidity')
        .its('response.statusCode')
        .should('equal', 200);

      vehicleScheduleDetailsPage.toast.checkSuccessToastHasMessage(
        'Aikataulun voimassaolo tallennettu',
      );

      route99InboundTimetableSection.assertRouteHasNoSchedules();
      // Check the imported timetable on the first valid Saturday, which is the day type of the imported timetable
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2025-03-08',
      );

      route99InboundSaturdayVehicleService
        .get()
        .should('contain', '2 lähtöä')
        .and('contain', '07:10 ... 08:20');

      // Verify the timetable is not valid on the last Saturday before the validity period has begun
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2025-03-01',
      );
      route99InboundTimetableSection.assertRouteHasNoSchedules();
      // Verify the timetable is not valid on the first Saturday after the validity period has ended
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2026-03-07',
      );
      route99InboundTimetableSection.assertRouteHasNoSchedules();
    },
  );

  it(
    "Should change a timetable's validity period in the passing times view",
    { tags: [Tag.Timetables] },
    () => {
      cy.visit(
        `timetables/lines/${lines[0].line_id}?observationDate=2023-04-29&routeLabels=${routes[0].label}`,
      );
      vehicleScheduleDetailsPage.routeTimetableList.routeTimetablesSection.vehicleServiceTable
        .getHeadingButton('Lauantai')
        .click();
      vehicleScheduleDetailsPage.vehicleJourneyGroupInfo
        .getChangeValidityButton()
        .click();
      vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityStartDate(
        '2025-03-03',
      );
      vehicleScheduleDetailsPage.changeTimetablesValidityForm.setValidityEndDate(
        '2026-03-03',
      );
      vehicleScheduleDetailsPage.changeTimetablesValidityForm
        .getSaveButton()
        .click();
      cy.wait('@gqlUpdateVehicleScheduleFrameValidity')
        .its('response.statusCode')
        .should('equal', 200);
      vehicleScheduleDetailsPage.toast.checkSuccessToastHasMessage(
        'Aikataulun voimassaolo tallennettu',
      );
      vehicleScheduleDetailsPage.routeTimetablesSection.assertRouteHasNoSchedules(
        '99',
      );
      // Check the imported timetable on the first valid Saturday, which is the day type of the imported timetable
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2025-03-08',
      );
      vehicleScheduleDetailsPage.dayTypeDropDown
        .getDayTypeDropdownButton()
        .should('contain', 'Lauantai');
      vehicleScheduleDetailsPage.vehicleJourneyGroupInfo
        .getValidityTimeRange()
        .should('contain', '3.3.2025 - 3.3.2026');
      vehicleScheduleDetailsPage.vehicleJourneyGroupInfo
        .getTripCount()
        .should('contain', '2 lähtöä');
      vehicleScheduleDetailsPage.vehicleJourneyGroupInfo
        .getTripTimeRange()
        .should('contain', '07:10 ... 08:20');
      // Verify the timetable is not valid on the last Saturday before the validity period has begun
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2025-03-01',
      );
      vehicleScheduleDetailsPage.routeTimetablesSection.assertRouteHasNoSchedules(
        '99',
      );
      // Verify the timetable is not valid on the first Saturday after the validity period has ended
      vehicleScheduleDetailsPage.observationDateControl.setObservationDate(
        '2026-03-07',
      );
      vehicleScheduleDetailsPage.routeTimetablesSection.assertRouteHasNoSchedules(
        '99',
      );
    },
  );
});
