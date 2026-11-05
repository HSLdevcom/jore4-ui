import {
  InfraLinkAlongRouteWithStopsFragment,
  InfrastructureNetworkDirectionEnum,
  RouteStopFieldsFragment,
  RouteValidityFragment,
} from '../../../generated/graphql';
import { RouteInfraLink } from '../../../types';
import { Priority } from '../../../types/enums';
import { StopPlaceState } from '../../../types/stop-registry';
import { extractJourneyPatternCandidateStops } from './extractJourneyPatternCandidateStops';

type TestInfraLink = RouteInfraLink<
  InfraLinkAlongRouteWithStopsFragment['infrastructure_link']
>;

const infrastructureLinkId = 'link-1';

const routeValidity = {
  priority: Priority.Standard,
  validity_start: Temporal.PlainDate.from('2024-01-01'),
  validity_end: Temporal.PlainDate.from('2024-12-31'),
} as unknown as RouteValidityFragment;

function buildStop(
  label: string,
  overrides: Partial<RouteStopFieldsFragment> = {},
  stopState?: StopPlaceState,
): RouteStopFieldsFragment {
  return {
    scheduled_stop_point_id: `ssp-${label}`,
    label,
    priority: Priority.Standard,
    direction: InfrastructureNetworkDirectionEnum.Bidirectional,
    validity_start: Temporal.PlainDate.from('2020-01-01'),
    validity_end: Temporal.PlainDate.from('2050-12-31'),
    located_on_infrastructure_link_id: infrastructureLinkId,
    relative_distance_from_infrastructure_link_start: 0,
    other_label_instances: [],
    newest_quay: stopState ? { stop_state: stopState } : null,
    ...overrides,
  } as unknown as RouteStopFieldsFragment;
}

function buildLink(stops: ReadonlyArray<RouteStopFieldsFragment>) {
  return {
    infrastructure_link_id: infrastructureLinkId,
    is_traversal_forwards: true,
    scheduled_stop_points_located_on_infrastructure_link: stops,
  } as unknown as TestInfraLink;
}

function extractLabels(stops: ReadonlyArray<RouteStopFieldsFragment>) {
  return stops.map((stop) => stop.label);
}

describe('extractJourneyPatternCandidateStops', () => {
  it('keeps stops that are not in operation as candidates', () => {
    const stops = [
      buildStop('A'),
      buildStop('B', {}, StopPlaceState.OutOfOperation),
      buildStop('C', {}, StopPlaceState.PermanentlyOutOfOperation),
      buildStop('D', {}, StopPlaceState.Removed),
    ];

    const candidates = extractJourneyPatternCandidateStops(
      [buildLink(stops)],
      routeValidity,
    );

    expect(extractLabels(candidates)).toEqual(['A', 'B', 'C', 'D']);
  });

  it('filters out stops that are on the wrong side of the road', () => {
    const stops = [
      buildStop('A', {
        direction: InfrastructureNetworkDirectionEnum.Forward,
      }),
      buildStop('B', {
        direction: InfrastructureNetworkDirectionEnum.Backward,
      }),
    ];

    const candidates = extractJourneyPatternCandidateStops(
      [buildLink(stops)],
      routeValidity,
    );

    expect(extractLabels(candidates)).toEqual(['A']);
  });

  it('filters out stops that are not valid during the route validity', () => {
    const stops = [
      buildStop('A'),
      buildStop('B', {
        validity_start: Temporal.PlainDate.from('2025-01-01'),
        validity_end: Temporal.PlainDate.from('2025-12-31'),
      }),
    ];

    const candidates = extractJourneyPatternCandidateStops(
      [buildLink(stops)],
      routeValidity,
    );

    expect(extractLabels(candidates)).toEqual(['A']);
  });
});
