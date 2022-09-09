import {
  buildLine,
  buildRoute,
  buildStop,
  buildStopsInJourneyPattern,
  infrastructureLinkAlongRoute,
  infrastructureLinks,
  journeyPatterns,
  Priority,
  RouteDirectionEnum,
  RouteInfrastructureLinkAlongRouteInsertInput,
  vehicleSubmodeOnInfrastructureLink,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import {
  RoutesAndLinesSearchResultsPage,
  RoutesAndLinesPage,
} from '../pageObjects';
import {
  InfraLinkInsertInput,
  LineInsertInput,
  RouteInsertInput,
  StopInsertInput,
} from '../types';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const infraLinks: InfraLinkInsertInput[] = [
  {
    ...(infrastructureLinks[0] as InfraLinkInsertInput),
  },
  {
    ...(infrastructureLinks[1] as InfraLinkInsertInput),
  },
  {
    ...(infrastructureLinks[2] as InfraLinkInsertInput),
  },
];

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '1666' }),
    line_id: '5dfa82f1-b3f7-4e26-b31d-0d7bd78da0bf',
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2023-08-11T13:08:43.315+03:00'),
  },
  {
    ...buildLine({ label: '2666' }),
    line_id: '4dfa82f1-b3f7-4e26-b31d-0d7bd78da0bf',
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2023-08-11T13:08:43.315+03:00'),
  },
  {
    ...buildLine({ label: '1777' }),
    line_id: '3dfa82f1-b3f7-4e26-b31d-0d7bd78da0bf',
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2023-08-11T13:08:43.315+03:00'),
  },
];

const stops: StopInsertInput[] = [
  // included on route
  {
    ...buildStop({
      label: 'E2E001',
      located_on_infrastructure_link_id: infraLinks[0].infrastructure_link_id,
    }),
    scheduled_stop_point_id: '0f6254d9-dc60-4626-a777-ce4d4381d38a',
  },
  // included on route
  {
    ...buildStop({
      label: 'E2E002',
      located_on_infrastructure_link_id: infraLinks[1].infrastructure_link_id,
    }),
    scheduled_stop_point_id: '7e97247d-7750-4d72-b02e-bd4e886357b7',
  },
  // not included on route
  {
    ...buildStop({
      label: 'E2E003',
      located_on_infrastructure_link_id: infraLinks[1].infrastructure_link_id,
    }),
    scheduled_stop_point_id: '318861b2-440e-4f4d-b75e-fdf812697c35',
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '3777' }),
    route_id: '61bef596-84a0-40ea-b818-423d6b9b1fcf',
    on_line_id: lines[0].line_id,
    direction: RouteDirectionEnum.Inbound,
    priority: Priority.Standard,
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2023-08-11T13:08:43.315+03:00'),
  },
  {
    ...buildRoute({ label: '3666' }),
    route_id: '51bef596-84a0-40ea-b818-423d6b9b1fcf',
    on_line_id: lines[1].line_id,
    direction: RouteDirectionEnum.Inbound,
    priority: Priority.Standard,
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2023-08-11T13:08:43.315+03:00'),
  },
];

const infraLinksAlongRoute: RouteInfrastructureLinkAlongRouteInsertInput[] = [
  {
    ...infrastructureLinkAlongRoute[0],
    route_id: routes[0].route_id,
    infrastructure_link_id: infraLinks[0].infrastructure_link_id,
    infrastructure_link_sequence: 0,
    is_traversal_forwards: true,
  },
  {
    ...infrastructureLinkAlongRoute[1],
    route_id: routes[0].route_id,
    infrastructure_link_id: infraLinks[1].infrastructure_link_id,
    infrastructure_link_sequence: 1,
    is_traversal_forwards: true,
  },
  {
    ...infrastructureLinkAlongRoute[2],
    route_id: routes[0].route_id,
    infrastructure_link_id: infraLinks[2].infrastructure_link_id,
    infrastructure_link_sequence: 2,
    is_traversal_forwards: true,
  },
];

const stopsInJourneyPattern = buildStopsInJourneyPattern(
  // Include only first 2 stops on route
  [stops[0].label, stops[1].label],
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  journeyPatterns[0].journey_pattern_id!,
);

const dbResources = {
  infraLinks,
  vehicleSubmodeOnInfrastructureLink,
  lines,
  stops,
  routes,
  infraLinksAlongRoute,
  journeyPatterns,
  stopsInJourneyPattern,
};

const deleteCreatedResources = () => {
  removeFromDbHelper(dbResources);
};

describe('Verify route and line search works', () => {
  let searchResultsPage: RoutesAndLinesSearchResultsPage;
  let routesAndLinesPage: RoutesAndLinesPage;

  beforeEach(() => {
    searchResultsPage = new RoutesAndLinesSearchResultsPage();
    routesAndLinesPage = new RoutesAndLinesPage();
    deleteCreatedResources();
    insertToDbHelper(dbResources);
    cy.setupTests();
    cy.mockLogin();
    cy.visit('/routes');
  });
  afterEach(() => {
    deleteCreatedResources();
  });
  it('Searches line with exact ID', () => {
    routesAndLinesPage.getRoutesAndLinesSearchInput().type('1666{enter}');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('contain', 'line 1666');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('not.contain', 'line 1777');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('not.contain', 'line 2666');
  });

  it('Searches line with asterisk', () => {
    routesAndLinesPage.getRoutesAndLinesSearchInput().type('1*{enter}');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('contain', 'line 1666');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('contain', 'line 1777');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('not.contain', 'line 2666');
  });
});
