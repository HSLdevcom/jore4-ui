import { RouteStopFieldsFragment } from '../../../../../generated/graphql';
import {
  orderIdPairsByQuayNetexIds,
  routeStopsToOrderedQuayNetexIds,
} from './routeReportStops';

function stop(
  label: string,
  quayNetexId: string | null,
): RouteStopFieldsFragment {
  return {
    label,
    newest_quay: quayNetexId ? { netex_id: quayNetexId } : null,
  } as unknown as RouteStopFieldsFragment;
}

describe('routeStopsToOrderedQuayNetexIds', () => {
  it('extracts quay NetexIDs preserving the driving order', () => {
    const stops = [
      stop('A', 'HSL:Quay:A'),
      stop('B', 'HSL:Quay:B'),
      stop('C', 'HSL:Quay:C'),
    ];

    expect(routeStopsToOrderedQuayNetexIds(stops)).toEqual([
      'HSL:Quay:A',
      'HSL:Quay:B',
      'HSL:Quay:C',
    ]);
  });

  it('drops stops without a quay NetexID', () => {
    const stops = [
      stop('A', 'HSL:Quay:A'),
      stop('B', null),
      stop('C', 'HSL:Quay:C'),
    ];

    expect(routeStopsToOrderedQuayNetexIds(stops)).toEqual([
      'HSL:Quay:A',
      'HSL:Quay:C',
    ]);
  });

  it('returns an empty array for no stops', () => {
    expect(routeStopsToOrderedQuayNetexIds([])).toEqual([]);
  });
});

describe('orderIdPairsByQuayNetexIds', () => {
  const pairs = [
    { quayNetexId: 'HSL:Quay:B', stopPlaceNetexId: 'HSL:StopPlace:2' },
    { quayNetexId: 'HSL:Quay:A', stopPlaceNetexId: 'HSL:StopPlace:1' },
    { quayNetexId: 'HSL:Quay:C', stopPlaceNetexId: 'HSL:StopPlace:1' },
  ];

  it('reorders resolved pairs to match the driving order', () => {
    expect(
      orderIdPairsByQuayNetexIds(
        ['HSL:Quay:A', 'HSL:Quay:B', 'HSL:Quay:C'],
        pairs,
      ),
    ).toEqual([
      { quayNetexId: 'HSL:Quay:A', stopPlaceNetexId: 'HSL:StopPlace:1' },
      { quayNetexId: 'HSL:Quay:B', stopPlaceNetexId: 'HSL:StopPlace:2' },
      { quayNetexId: 'HSL:Quay:C', stopPlaceNetexId: 'HSL:StopPlace:1' },
    ]);
  });

  it('drops quay NetexIDs that have no resolved pair', () => {
    expect(
      orderIdPairsByQuayNetexIds(
        ['HSL:Quay:A', 'HSL:Quay:X', 'HSL:Quay:C'],
        pairs,
      ),
    ).toEqual([
      { quayNetexId: 'HSL:Quay:A', stopPlaceNetexId: 'HSL:StopPlace:1' },
      { quayNetexId: 'HSL:Quay:C', stopPlaceNetexId: 'HSL:StopPlace:1' },
    ]);
  });
});
