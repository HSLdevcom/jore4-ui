import {
  GetInfrastructureLinksByExternalIdsResult,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  Priority,
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
  mapToGetInfrastructureLinksByExternalIdsQuery,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import {
  EditRoutePage,
  LineDetailsPage,
  RoutesAndLinesPage,
  SearchResultsPage,
  TerminusValues,
  Toast,
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

const stopLabels = ['Test stop 1', 'Test stop 2'];

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '1 Test line 1' }),
    line_id: '88f8f9fe-058b-49a2-ac8d-42d13488c7fb',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
  },
  {
    ...buildLine({ label: '2 Test line 2' }),
    line_id: 'a7107e50-7c9b-4788-b874-906d9f637eb9',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
  },
];

const timingPlaces = [
  buildTimingPlace('378b663f-f40a-44a4-aa2c-d6359fbe6a63', '1AACKT'),
  buildTimingPlace('e6b5caf0-39b0-4fa8-b537-de1dd7333148', '1AURLA'),
];

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    validity_start: DateTime.fromISO('2020-03-20T22:00:00+00:00'),
    scheduled_stop_point_id: 'd4e6478a-adce-4c76-8579-c8ca2a6bb70f',
    timing_place_id: timingPlaces[0].timing_place_id,
    priority: Priority.Draft,
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
    validity_start: DateTime.fromISO('2020-03-20T22:00:00+00:00'),
    scheduled_stop_point_id: '3354eef5-0eaf-4b43-8b2f-14c867633342',
    timing_place_id: timingPlaces[0].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[1].coordinates,
    },
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: 'T-reitti 1' }),
    route_id: '7961d12f-26cc-4e0f-b6a7-845bc334df63',
    on_line_id: lines[0].line_id,
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2032-08-11T13:08:43.315+03:00'),
  },
  {
    ...buildRoute({ label: 'Draft route' }),
    route_id: '6c85285a-e3ec-4889-914c-f60bac08d9f2',
    priority: Priority.Draft,
    on_line_id: lines[1].line_id,
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2032-08-11T13:08:43.315+03:00'),
  },
];

const buildInfraLinksAlongRoute = (
  infrastructureLinkIds: UUID[],
): InfraLinkAlongRouteInsertInput[] => [
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[0],
    infrastructure_link_sequence: 0,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[1],
    infrastructure_link_sequence: 1,
    is_traversal_forwards: true,
  },
];

const journeyPatterns: JourneyPatternInsertInput[] = [
  {
    journey_pattern_id: '224d4ea8-ff9b-41d8-a4f2-42e89b329cec',
    on_route_id: routes[1].route_id,
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
    isUsedAsTimingPoint: true,
  }),
];

const originTestInputs: TerminusValues = {
  finnishName: 'Muokattu lähtöpaikka FIN',
  finnishShortName: 'Muokattu lähtöpaikka FIN lyhennys',
  swedishName: 'Muokattu lähtöpaikka SWE',
  swedishShortName: 'Muokattu lähtöpaikka SWE lyhennys',
};

const destinationTestInputs: TerminusValues = {
  finnishName: 'Muokattu määränpää FIN',
  finnishShortName: 'Muokattu määränpää FIN lyhennys',
  swedishName: 'Muokattu määränpää SWE',
  swedishShortName: 'Muokattu määränpää SWE lyhennys',
};

const routeFormTestInputs = {
  finnishName: 'Muokattu reitin nimi',
  label: 'Muokattu label',
  variant: '9191',
  direction: RouteDirectionEnum.Outbound,
  origin: originTestInputs,
  destination: destinationTestInputs,
};

describe('Route editing', () => {
  let editRoutePage: EditRoutePage;
  let lineDetailsPage: LineDetailsPage;
  let toast: Toast;
  let routesAndLinesPage: RoutesAndLinesPage;
  let searchResultsPage: SearchResultsPage;
  const baseDbResources = {
    lines,
    routes,
    journeyPatterns,
    stopsInJourneyPattern,
    timingPlaces,
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
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  beforeEach(() => {
    removeFromDbHelper(dbResources);
    insertToDbHelper(dbResources);

    editRoutePage = new EditRoutePage();
    lineDetailsPage = new LineDetailsPage();
    toast = new Toast();
    routesAndLinesPage = new RoutesAndLinesPage();
    searchResultsPage = new SearchResultsPage();

    cy.setupTests();
    cy.mockLogin();
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
  });

  it("Should edit a routes's information", { tags: Tag.Routes }, () => {
    editRoutePage.visit(routes[0].route_id);
    // Edit the route's information
    editRoutePage.routePropertiesForm.fillRouteProperties(routeFormTestInputs);
    editRoutePage.priorityForm.setAsTemporary();
    editRoutePage.changeValidityForm.getIndefiniteCheckbox().click();
    editRoutePage.changeValidityForm.setStartDate('2022-01-01');
    editRoutePage.changeValidityForm.setEndDate('2030-12-31');

    editRoutePage.getSaveRouteButton().click();

    // Verify information after transitioning to the line details page
    lineDetailsPage.routeStopsTable.expandableRouteRow
      .getRouteName()
      .should('contain', routeFormTestInputs.finnishName);
    lineDetailsPage.routeStopsTable.expandableRouteRow.getRouteHeaderRow(
      routeFormTestInputs.label,
    );
    lineDetailsPage.routeStopsTable.assertRouteDirection(
      routeFormTestInputs.label,
      RouteDirectionEnum.Outbound,
    );
    lineDetailsPage.routeStopsTable.expandableRouteRow
      .getRouteValidityPeriod(routeFormTestInputs.label)
      .should('contain', '1.1.2022 - 31.12.2030');

    // Verify rest of the information from the edit route page
    editRoutePage.visit(routes[0].route_id);
    editRoutePage.routePropertiesForm
      .getVariantInput()
      .should('have.value', '9191');
    editRoutePage.terminusNamesInputs.verifyOriginValues(originTestInputs);
    editRoutePage.terminusNamesInputs.verifyDestinationValues(
      destinationTestInputs,
    );
  });

  it('Should delete a route', { tags: Tag.Routes }, () => {
    editRoutePage.visit(routes[0].route_id);
    editRoutePage.routePropertiesForm.getForm().should('be.visible');
    editRoutePage.getDeleteRouteButton().click();
    editRoutePage.confirmationDialog.getConfirmButton().click();
    cy.wait('@gqlDeleteRoute').its('response.statusCode').should('equal', 200);
    toast.checkSuccessToastHasMessage('Reitti poistettu');
    editRoutePage.visit(routes[0].route_id);
    editRoutePage.routePropertiesForm.getForm().should('not.exist');
    cy.visit('/routes');
    routesAndLinesPage.searchContainer
      .getSearchInput()
      .type(`${routes[0].label}{enter}`);
    cy.wait('@gqlSearchLinesAndRoutes');
    searchResultsPage.getRoutesResultsButton().click();
    searchResultsPage
      .getSearchResultsContainer()
      .should('contain', '0 hakutulosta');
  });

  it(
    'Should show a warning when trying to change the priority of a draft route that has draft stops',
    { tags: Tag.Routes },
    () => {
      editRoutePage.visit(routes[1].route_id);
      editRoutePage.priorityForm.setAsStandard();
      editRoutePage.getSaveRouteButton().click();
      editRoutePage.routeDraftStopsConfirmationDialog
        .getTextContent()
        .should(
          'contain',
          'Jos haluat pysäkit mukaan reitille, säädä ensin niiden prioriteetti vastaamaan reittiä.',
        );
    },
  );
});
