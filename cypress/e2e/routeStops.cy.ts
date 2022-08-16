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
import { LineDetailsPage } from '../pageObjects';
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
    ...buildLine({ label: '1' }),
    line_id: '5dfa82f1-b3f7-4e26-b31d-0d7bd78da0bf',
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2023-08-11T13:08:43.315+03:00'),
  },
];

const stops: StopInsertInput[] = [
  {
    ...buildStop({
      label: 'E2E001',
      located_on_infrastructure_link_id: infraLinks[0].infrastructure_link_id,
    }),
    scheduled_stop_point_id: '0f6254d9-dc60-4626-a777-ce4d4381d38a',
  },
  {
    ...buildStop({
      label: 'E2E002',
      located_on_infrastructure_link_id: infraLinks[1].infrastructure_link_id,
    }),
    scheduled_stop_point_id: '7e97247d-7750-4d72-b02e-bd4e886357b7',
  },
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
    ...buildRoute({ label: '1' }),
    route_id: '61bef596-84a0-40ea-b818-423d6b9b1fcf',
    on_line_id: lines[0].line_id,
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

describe('Line details page', () => {
  let lineDetailsPage: LineDetailsPage;
  before(() => {
    deleteCreatedResources();
    insertToDbHelper(dbResources);
  });
  beforeEach(() => {
    lineDetailsPage = new LineDetailsPage();
    cy.mockLogin();
    lineDetailsPage.visit(lines[0].line_id);
  });
  after(() => {
    deleteCreatedResources();
  });
  it('Verify that stops of route are shown on its list view', () => {
    lineDetailsPage.toggleRouteSection(routes[0].route_id);

    // verify that stops 0 and 1 are included on route
    lineDetailsPage
      .getStopRow(stops[0].scheduled_stop_point_id)
      .contains(stops[0].label);
    lineDetailsPage
      .getStopRow(stops[1].scheduled_stop_point_id)
      .contains(stops[1].label);

    // stop 2 is not included on route and thus not shown by default
    lineDetailsPage
      .getStopRow(stops[2].scheduled_stop_point_id)
      .should('not.exist');

    // stop 2 can be shown after toggling unused stops to be visible
    lineDetailsPage.toggleUnusedStops();
    lineDetailsPage
      .getStopRow(stops[2].scheduled_stop_point_id)
      .contains(stops[2].label);
  });
});
