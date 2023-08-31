import {
  GetInfrastructureLinksByExternalIdsResult,
  InfraLinkAlongRouteInsertInput,
  LineInsertInput,
  RouteInsertInput,
  StopInJourneyPatternInsertInput,
  StopInsertInput,
  buildLine,
  buildRoute,
  buildStop,
  buildStopInJourneyPattern,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  infrastructureLinkAlongRoute,
  journeyPatterns,
  mapToGetInfrastructureLinksByExternalIdsQuery,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import { LineDetailsPage, RouteStopsTable, Toast } from '../pageObjects';
import { UUID } from '../types';
import {
  SupportedResources,
  insertToDbHelper,
  removeFromDbHelper,
} from '../utils';

const infrastructureLinkExternalIds = ['445156', '442424', '442325'];
const stopLabels = ['E2E001', 'E2E002', 'E2E003'];

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '1' }),
    line_id: '5dfa82f1-b3f7-4e26-b31d-0d7bd78da0bf',
  },
];

const timingPlaces = [
  buildTimingPlace('757dbd98-83c7-462b-961e-8111e37e6561', '1AACKT'),
  buildTimingPlace('adc99d5e-e49f-4910-a0dc-81eb69698cc9', '1AURLA'),
];

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  // included on route
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    scheduled_stop_point_id: '0f6254d9-dc60-4626-a777-ce4d4381d38a',
    timing_place_id: timingPlaces[0].timing_place_id,
  },
  // included on route, has a timing place
  {
    ...buildStop({
      label: stopLabels[1],
      located_on_infrastructure_link_id: infrastructureLinkIds[1],
    }),
    scheduled_stop_point_id: '7e97247d-7750-4d72-b02e-bd4e886357b7',
  },
  // not included on route
  {
    ...buildStop({
      label: stopLabels[2],
      located_on_infrastructure_link_id: infrastructureLinkIds[1],
    }),
    scheduled_stop_point_id: '318861b2-440e-4f4d-b75e-fdf812697c35',
    timing_place_id: timingPlaces[1].timing_place_id,
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '1' }),
    route_id: '61bef596-84a0-40ea-b818-423d6b9b1fcf',
    on_line_id: lines[0].line_id,
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2043-08-11T13:08:43.315+03:00'),
  },
];

const buildInfraLinksAlongRoute = (
  infrastructureLinkIds: UUID[],
): InfraLinkAlongRouteInsertInput[] => [
  {
    ...infrastructureLinkAlongRoute[0],
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[0],
    infrastructure_link_sequence: 0,
    is_traversal_forwards: true,
  },
  {
    ...infrastructureLinkAlongRoute[1],
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[1],
    infrastructure_link_sequence: 1,
    is_traversal_forwards: true,
  },
  {
    ...infrastructureLinkAlongRoute[2],
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[2],
    infrastructure_link_sequence: 2,
    is_traversal_forwards: true,
  },
];

describe('Line details page: stops on route', () => {
  let lineDetailsPage: LineDetailsPage;
  let toast: Toast;
  let routeStopsTable: RouteStopsTable;
  const baseDbResources = {
    lines,
    routes,
    journeyPatterns,
    timingPlaces,
  };
  let dbResources: SupportedResources;

  before(() => {
    let infraLinkIds: UUID[] = [];

    cy.task<GetInfrastructureLinksByExternalIdsResult>(
      'hasuraAPI',
      mapToGetInfrastructureLinksByExternalIdsQuery(
        infrastructureLinkExternalIds,
      ),
    ).then((res) => {
      infraLinkIds = extractInfrastructureLinkIdsFromResponse(res);

      const stops = buildStopsOnInfrastrucureLinks(infraLinkIds);

      // Include only first 2 stops on route
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
      ];

      dbResources = {
        ...baseDbResources,
        stops,
        stopsInJourneyPattern,
        infraLinksAlongRoute: buildInfraLinksAlongRoute(infraLinkIds),
      };

      removeFromDbHelper(dbResources);
    });
  });

  beforeEach(() => {
    lineDetailsPage = new LineDetailsPage();
    toast = new Toast();
    routeStopsTable = new RouteStopsTable();

    insertToDbHelper(dbResources);

    cy.setupTests();
    cy.mockLogin();
    lineDetailsPage.visit(lines[0].line_id);
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
  });

  it(
    'Verify that stops of route are shown on its list view',
    { tags: [Tag.Stops, Tag.Routes, Tag.Smoke] },
    () => {
      routeStopsTable.toggleRouteSection(routes[0].label);

      // verify that stops 0 and 1 are included on route
      routeStopsTable.getStopRow(stopLabels[0]).contains(stopLabels[0]);
      routeStopsTable.getStopRow(stopLabels[1]).contains(stopLabels[1]);

      // stop 2 is not included on route and thus not shown by default
      routeStopsTable.getStopRow(stopLabels[2]).should('not.exist');

      // stop 2 can be shown after toggling unused stops to be visible
      routeStopsTable.toggleUnusedStops();
      routeStopsTable.getStopRow(stopLabels[2]).contains(stopLabels[2]);
    },
  );

  it(
    'User can add stops to route and remove those',
    { tags: Tag.Stops },
    () => {
      routeStopsTable.toggleRouteSection(routes[0].label);

      routeStopsTable.toggleUnusedStops();

      routeStopsTable.addStopToRoute(stopLabels[2]);
      cy.wait('@gqlUpdateRouteJourneyPattern')
        .its('response.statusCode')
        .should('equal', 200);
      // Wait until cache is updated and UI notices that this stop is
      // now included on route
      routeStopsTable
        .getStopRow(stopLabels[2])
        .contains('Ei reitin käytössä')
        .should('not.exist');

      routeStopsTable.removeStopFromRoute(stopLabels[1]);
      cy.wait('@gqlUpdateRouteJourneyPattern')
        .its('response.statusCode')
        .should('equal', 200);

      routeStopsTable.getStopRow(stopLabels[1]).contains('Ei reitin käytössä');
    },
  );

  it(
    'User cannot delete too many stops from route',
    { tags: Tag.Stops },
    () => {
      routeStopsTable.toggleRouteSection(routes[0].label);
      // Route has only 2 stops so user shouldn't be able to remove either of those
      routeStopsTable.removeStopFromRoute(stopLabels[0]);
      toast
        .getDangerToast()
        .contains('Reitillä on oltava ainakin kaksi pysäkkiä.')
        .should('be.visible');
    },
  );

  it(
    'Should add Via info to a stop and then remove it',
    { tags: Tag.Stops },
    () => {
      routeStopsTable.toggleRouteSection(routes[0].label);
      // Open via point creation modal
      routeStopsTable.openCreateViaPointModal(stopLabels[0]);
      // Input via info to form
      routeStopsTable.viaForm.getViaFinnishNameInput().type('Via-piste');
      routeStopsTable.viaForm.getViaSwedishNameInput().type('Via punkt');
      routeStopsTable.viaForm.getViaFinnishShortNameInput().type('Lyhyt nimi');
      routeStopsTable.viaForm.getViaSwedishShortNameInput().type('Kort namn');
      // Save via info form
      routeStopsTable.viaForm.getSaveButton().click();
      cy.wait('@gqlPatchScheduledStopPointViaInfo');
      toast.checkSuccessToastHasMessage('Via-tieto asetettu');
      // Verify info was saved
      routeStopsTable.openEditViaPointModal(stopLabels[0]);
      routeStopsTable.viaForm
        .getViaFinnishNameInput()
        .should('have.value', 'Via-piste');
      routeStopsTable.viaForm
        .getViaSwedishNameInput()
        .should('have.value', 'Via punkt');
      routeStopsTable.viaForm
        .getViaFinnishShortNameInput()
        .should('have.value', 'Lyhyt nimi');
      routeStopsTable.viaForm
        .getViaSwedishShortNameInput()
        .should('have.value', 'Kort namn');
      // Delete via info
      routeStopsTable.viaForm.getRemoveButton().click();
      cy.wait('@gqlRemoveScheduledStopPointViaInfo');
      // Verify that createViaPoint selection is available instead of editViaPoint
      routeStopsTable.getStopDropdown(stopLabels[0]).should('be.visible');
    },
  );

  it(
    'Checking "Use Hastus place" should not be possible when the stop has no timing place',
    { tags: Tag.Stops },
    () => {
      routeStopsTable.toggleRouteSection(routes[0].label);
      // This stop does not have a timing place
      // so it should not be possible to enable 'Use Hastus place'
      routeStopsTable.openTimingSettingsForm(stopLabels[1]);
      routeStopsTable.timingSettingsForm
        .getIsUsedAsTimingPointCheckbox()
        .should('be.disabled');
    },
  );

  it(
    'Should set stop as timing place, regulated timing place and allow loading time',
    { tags: Tag.Stops },
    () => {
      routeStopsTable.toggleRouteSection(routes[0].label);
      // Open timing settings modal
      routeStopsTable.openTimingSettingsForm(stopLabels[0]);
      // Unchecking IsUsedAsTimingPointCheckbox should disable IsRegulatedTimingPointCheckbox
      routeStopsTable.timingSettingsForm
        .getIsUsedAsTimingPointCheckbox()
        .uncheck();
      // Check and set timing settings
      routeStopsTable.timingSettingsForm
        .getIsRegulatedTimingPointCheckbox()
        .should('be.disabled');
      routeStopsTable.timingSettingsForm
        .getIsLoadingTimeAllowedCheckbox()
        .should('be.disabled');
      routeStopsTable.timingSettingsForm
        .getIsUsedAsTimingPointCheckbox()
        .check();
      routeStopsTable.timingSettingsForm
        .getIsRegulatedTimingPointCheckbox()
        .should('be.enabled');
      routeStopsTable.timingSettingsForm
        .getIsLoadingTimeAllowedCheckbox()
        .should('be.disabled');
      routeStopsTable.timingSettingsForm
        .getIsRegulatedTimingPointCheckbox()
        .check();
      routeStopsTable.timingSettingsForm
        .getIsLoadingTimeAllowedCheckbox()
        .check();
      routeStopsTable.timingSettingsForm.getSavebutton().click();
      toast.checkSuccessToastHasMessage('Aika-asetusten tallennus onnistui');
      // Check that timing settings are set
      routeStopsTable.openTimingSettingsForm(stopLabels[0]);
      routeStopsTable.timingSettingsForm
        .getIsUsedAsTimingPointCheckbox()
        .should('be.checked');
      routeStopsTable.timingSettingsForm
        .getIsRegulatedTimingPointCheckbox()
        .should('be.checked');
      routeStopsTable.timingSettingsForm
        .getIsLoadingTimeAllowedCheckbox()
        .should('be.checked');
    },
  );
});
