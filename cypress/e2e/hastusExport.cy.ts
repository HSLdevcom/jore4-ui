import {
  GetInfrastructureLinksByExternalIdsResult,
  buildLine,
  buildRoute,
  buildStop,
  buildStopsInJourneyPattern,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  RouteInsertInput,
  StopInsertInput,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import { RoutesAndLinesPage } from '../pageObjects';
import { UUID } from '../types';
import {
  insertToDbHelper,
  removeFromDbHelper,
  SupportedResources,
} from '../utils';

// These external IDs exist in the infralink seed data.
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
    line_id: '08d1fa6b-440c-421e-ad4d-0778d65afe60',
  },
];

const timingPlaces = [
  buildTimingPlace('78ee94c3-e856-4fdc-89ad-10b72cadb444', '1AACKT'),
  buildTimingPlace('f8a93c6f-5ef7-4b09-ae5e-0a04ea8597e9', '1ELIMK'),
  buildTimingPlace('5240633b-5c94-49c1-b1c2-26e9d61a01cd', '1AURLA'),
];

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    scheduled_stop_point_id: '7ef42a37-142d-44be-9b69-dbe6adca7f34',
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
    scheduled_stop_point_id: '4f8df0bc-a5cb-4fbe-a6dc-0425d55be382',
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
    scheduled_stop_point_id: '322a32cc-7a50-402b-9c01-5dc6a6b39af6',
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '99' }),
    route_id: '829e9d55-aa25-4ab9-858b-f2a5aa81d931',
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
    journey_pattern_id: '6cae356b-20f4-4e04-a969-097999b351f0',
    on_route_id: routes[0].route_id,
  },
];

const stopsInJourneyPattern = buildStopsInJourneyPattern(
  stopLabels,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  journeyPatterns[0].journey_pattern_id!,
);

describe('Hastus export', () => {
  let routesAndLinesPage: RoutesAndLinesPage;

  const exportDate = DateTime.now().toISODate();
  const exportFilePath = `${Cypress.config(
    'downloadsFolder',
  )}/jore4-export-${exportDate}.csv`;
  const comparisonExportFilePath = `${Cypress.config(
    'fixturesFolder',
  )}/hastusExport/comparison-export-1.csv`;
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
    removeFromDbHelper(dbResources);
    insertToDbHelper(dbResources);

    routesAndLinesPage = new RoutesAndLinesPage();

    cy.setupTests();
    cy.mockLogin();
    cy.visit('/routes');
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
    cy.task('deleteFile', exportFilePath);
  });

  // Disable until Hastus changes are finished
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip(
    'Should export a line',
    { tags: [Tag.Lines, Tag.HastusExport, Tag.Smoke] },
    () => {
      // Search and export a line
      routesAndLinesPage.searchContainer.getChevron().click();
      // Uncheck Temporary priority button so that only Standard priority is shown
      // and exporting works
      routesAndLinesPage.searchContainer.priorityCondition
        .getTemporaryPriorityConditionButton()
        .click();
      routesAndLinesPage.searchContainer.getSearchInput().type('1234{enter}');
      routesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
      routesAndLinesPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('1234')
        .check();
      routesAndLinesPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);
      cy.readFile(exportFilePath).then((exportedFile) => {
        cy.readFile(comparisonExportFilePath).should('eq', exportedFile);
      });
    },
  );

  // Disable until Hastus changes are finished
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip(
    'Should export a route',
    { tags: [Tag.Routes, Tag.HastusExport] },
    () => {
      // Skip searching via UI
      cy.visit('/routes/search?label=99&priorities=10&displayedType=routes');
      routesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
      routesAndLinesPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('99')
        .check();
      routesAndLinesPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);
      cy.readFile(exportFilePath).then((exportedFile) => {
        cy.readFile(comparisonExportFilePath).should('eq', exportedFile);
      });
    },
  );
});
