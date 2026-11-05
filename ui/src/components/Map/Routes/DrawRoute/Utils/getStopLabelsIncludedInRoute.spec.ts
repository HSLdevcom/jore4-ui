import { RouteStopFieldsFragment } from '../../../../../generated/graphql';
import { StopPlaceState } from '../../../../../types/stop-registry';
import { getStopLabelsIncludedInRoute } from './getStopLabelsIncludedInRoute';

function buildStop(
  label: string,
  stopState?: StopPlaceState,
): RouteStopFieldsFragment {
  return {
    label,
    newest_quay: stopState ? { stop_state: stopState } : null,
  } as unknown as RouteStopFieldsFragment;
}

describe('getStopLabelsIncludedInRoute', () => {
  it('includes stops that are in operation', () => {
    const stops = [
      buildStop('A', StopPlaceState.InOperation),
      buildStop('B', StopPlaceState.InOperation),
    ];

    expect(getStopLabelsIncludedInRoute(stops)).toEqual(['A', 'B']);
  });

  it('treats stops without a quay as in operation', () => {
    expect(getStopLabelsIncludedInRoute([buildStop('A')])).toEqual(['A']);
  });

  it('leaves out stops that are not in operation', () => {
    const stops = [
      buildStop('A', StopPlaceState.InOperation),
      buildStop('B', StopPlaceState.OutOfOperation),
      buildStop('C', StopPlaceState.PermanentlyOutOfOperation),
      buildStop('D', StopPlaceState.Removed),
    ];

    expect(getStopLabelsIncludedInRoute(stops)).toEqual(['A']);
  });

  it('leaves out stops that have been removed from the route', () => {
    const stops = [buildStop('A'), buildStop('B'), buildStop('C')];

    expect(getStopLabelsIncludedInRoute(stops, ['B'])).toEqual(['A', 'C']);
  });
});
