import {
  GetInfrastructureLinksByExternalIdsResult,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  RouteDirectionEnum,
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
  infrastructureLinkAlongRoute,
  mapToGetInfrastructureLinksByExternalIdsQuery,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import { LineDetailsPage, LineRouteList, Toast } from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

const infrastructureLinkExternalIds = ['445156', '442424', '442325'];
const stopLabels = ['E2E001', 'E2E002', 'E2E003', 'E2E004'];

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '1' }),
    line_id: '5dfa82f1-b3f7-4e26-b31d-0d7bd78da0bf',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
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
      located_on_infrastructure_link_id: infrastructureLinkIds[2],
    }),
    scheduled_stop_point_id: '318861b2-440e-4f4d-b75e-fdf812697c35',
  },
  {
    ...buildStop({
      label: stopLabels[3],
      located_on_infrastructure_link_id: infrastructureLinkIds[2],
    }),
    scheduled_stop_point_id: '86382fd2-80f1-4006-9314-2c74a4273883',
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

const journeyPatterns: JourneyPatternInsertInput[] = [
  {
    journey_pattern_id: '61d3356e-80d7-4866-a64a-30177c3749f2',
    on_route_id: routes[0].route_id,
  },
];

describe('Line details page: stops on route', () => {
  let lineDetailsPage: LineDetailsPage;
  let toast: Toast;
  let lineRouteList: LineRouteList;
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

      // Stop label E2E003 is not included in the route
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
          stopLabel: stopLabels[3],
          scheduledStopPointSequence: 2,
          isUsedAsTimingPoint: true,
        }),
      ];

      dbResources = {
        ...baseDbResources,
        stops,
        stopsInJourneyPattern,
        infraLinksAlongRoute: buildInfraLinksAlongRoute(infraLinkIds),
      };
    });
  });

  beforeEach(() => {
    cy.task('resetDbs');
    insertToDbHelper(dbResources);

    lineDetailsPage = new LineDetailsPage();
    toast = new Toast();
    lineRouteList = new LineRouteList();

    cy.setupTests();
    cy.mockLogin();
    lineDetailsPage.visit(lines[0].line_id);
  });

  it(
    'Verify that stops of route are shown on its list view',
    { tags: [Tag.Stops, Tag.Routes, Tag.Smoke] },
    () => {
      lineRouteList.routeRow.toggleRouteSection(
        routes[0].label,
        RouteDirectionEnum.Inbound,
      );

      // verify that stops 0, 1 and 3 are included on route
      lineRouteList.routeStopListItem.getStopRow(stopLabels[0]);
      lineRouteList.routeStopListItem.getStopRow(stopLabels[1]);
      lineRouteList.routeStopListItem.getStopRow(stopLabels[3]);

      // stop 2 is not included on route and thus not shown by default
      lineRouteList.routeStopListItem
        .getStopRow(stopLabels[2])
        .should('not.exist');

      // stop 2 can be shown after toggling unused stops to be visible
      lineRouteList.toggleShowUnusedStops();
      lineRouteList.routeStopListItem.getStopRow(stopLabels[2]);
    },
  );

  it(
    'User can add stops to the route and remove them from the route',
    { tags: Tag.Stops },
    () => {
      lineRouteList.routeRow.toggleRouteSection(
        routes[0].label,
        RouteDirectionEnum.Inbound,
      );

      lineRouteList.toggleShowUnusedStops();

      lineRouteList.routeStopListItem.addStopToRoute(stopLabels[2]);
      cy.wait('@gqlUpdateRouteJourneyPattern')
        .its('response.statusCode')
        .should('equal', 200);
      // Wait until cache is updated and UI notices that this stop is
      // now included on route
      lineRouteList.routeStopListItem
        .getStopRow(stopLabels[2])
        .contains('Ei reitin käytössä')
        .should('not.exist');

      lineRouteList.routeStopListItem.removeStopFromRoute(stopLabels[1]);
      cy.wait('@gqlUpdateRouteJourneyPattern')
        .its('response.statusCode')
        .should('equal', 200);

      lineRouteList.routeStopListItem
        .getStopRow(stopLabels[1])
        .contains('Ei reitin käytössä');
    },
  );

  it(
    'User cannot delete too many stops from route',
    { tags: Tag.Stops },
    () => {
      lineRouteList.routeRow.toggleRouteSection(
        routes[0].label,
        RouteDirectionEnum.Inbound,
      );
      // Route has to have at least two stops
      lineRouteList.routeStopListItem.removeStopFromRoute(stopLabels[3]);
      toast.checkSuccessToastHasMessage('Reitti tallennettu');
      lineRouteList.routeStopListItem.removeStopFromRoute(stopLabels[0]);
      toast.checkDangerToastHasMessage(
        'Reitillä on oltava ainakin kaksi pysäkkiä.',
      );
    },
  );

  it(
    'Should add Via info to a stop and then remove it',
    { tags: Tag.Stops },
    () => {
      lineRouteList.routeRow.toggleRouteSection(
        routes[0].label,
        RouteDirectionEnum.Inbound,
      );
      // Open via point creation modal
      lineRouteList.routeStopListItem.openCreateViaPointModal(stopLabels[0]);
      // Input via info to form
      lineRouteList.viaForm.getViaFinnishNameInput().type('Via-piste');
      lineRouteList.viaForm.getViaSwedishNameInput().type('Via punkt');
      lineRouteList.viaForm.getViaFinnishShortNameInput().type('Lyhyt nimi');
      lineRouteList.viaForm.getViaSwedishShortNameInput().type('Kort namn');
      // Save via info form
      lineRouteList.viaForm.getSaveButton().click();
      cy.wait('@gqlPatchScheduledStopPointViaInfo');
      toast.checkSuccessToastHasMessage('Via-tieto asetettu');
      // Verify info was saved
      lineRouteList.routeStopListItem.openEditViaPointModal(stopLabels[0]);
      lineRouteList.viaForm
        .getViaFinnishNameInput()
        .should('have.value', 'Via-piste');
      lineRouteList.viaForm
        .getViaSwedishNameInput()
        .should('have.value', 'Via punkt');
      lineRouteList.viaForm
        .getViaFinnishShortNameInput()
        .should('have.value', 'Lyhyt nimi');
      lineRouteList.viaForm
        .getViaSwedishShortNameInput()
        .should('have.value', 'Kort namn');
      // Delete via info
      lineRouteList.viaForm.getRemoveButton().click();
      cy.wait('@gqlRemoveScheduledStopPointViaInfo');
      // Verify that createViaPoint selection is available instead of editViaPoint
      lineRouteList.routeStopListItem
        .getStopDropdown(stopLabels[0])
        .should('be.visible');
    },
  );

  it(
    'Checking "Use Hastus place" should not be possible when the stop has no timing point',
    { tags: Tag.Stops },
    () => {
      lineRouteList.routeRow.toggleRouteSection(
        routes[0].label,
        RouteDirectionEnum.Inbound,
      );
      // This stop does not have a timing point
      // so it should not be possible to click 'Use Hastus place'
      lineRouteList.routeStopListItem.openTimingSettingsForm(stopLabels[1]);
      lineRouteList.timingSettingsForm
        .getIsUsedAsTimingPointCheckbox()
        .should('be.disabled');
    },
  );

  it(
    "Should check stop's 'Use Hastus place', 'Is regulated timing point' and 'Is loading time allowed' checkboxes and add a timing point",
    { tags: Tag.Stops },
    () => {
      lineRouteList.routeRow.toggleRouteSection(
        routes[0].label,
        RouteDirectionEnum.Inbound,
      );
      // Open timing settings modal
      lineRouteList.routeStopListItem.openTimingSettingsForm(stopLabels[0]);
      // Unchecking IsUsedAsTimingPointCheckbox should disable IsRegulatedTimingPointCheckbox
      lineRouteList.timingSettingsForm
        .getIsUsedAsTimingPointCheckbox()
        .uncheck();
      // Check and set timing settings
      lineRouteList.timingSettingsForm
        .getIsRegulatedTimingPointCheckbox()
        .should('be.disabled');
      lineRouteList.timingSettingsForm
        .getIsLoadingTimeAllowedCheckbox()
        .should('be.disabled');
      lineRouteList.timingSettingsForm.getIsUsedAsTimingPointCheckbox().check();
      lineRouteList.timingSettingsForm
        .getIsRegulatedTimingPointCheckbox()
        .should('be.enabled');
      lineRouteList.timingSettingsForm
        .getIsLoadingTimeAllowedCheckbox()
        .should('be.disabled');
      lineRouteList.timingSettingsForm
        .getIsRegulatedTimingPointCheckbox()
        .check();
      lineRouteList.timingSettingsForm
        .getIsLoadingTimeAllowedCheckbox()
        .check();
      lineRouteList.timingSettingsForm.selectTimingPlace('1AURLA');
      lineRouteList.timingSettingsForm.getSavebutton().click();
      toast.checkSuccessToastHasMessage('Aika-asetusten tallennus onnistui');
      // Check that timing settings are set
      lineRouteList.routeStopListItem.openTimingSettingsForm(stopLabels[0]);
      lineRouteList.timingSettingsForm
        .getIsUsedAsTimingPointCheckbox()
        .should('be.checked');
      lineRouteList.timingSettingsForm
        .getIsRegulatedTimingPointCheckbox()
        .should('be.checked');
      lineRouteList.timingSettingsForm
        .getIsLoadingTimeAllowedCheckbox()
        .should('be.checked');
      lineRouteList.timingSettingsForm
        .getTimingPlaceDropdown()
        .should('contain', '1AURLA');
    },
  );
});
