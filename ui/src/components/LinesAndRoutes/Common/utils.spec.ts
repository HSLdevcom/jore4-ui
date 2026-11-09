import { getRouteMeasuredLength } from './utils';

describe('getRouteMeasuredLength', () => {
  test('returns null when the route has no geometry', () => {
    expect(getRouteMeasuredLength(undefined)).toBeNull();
  });

  test('returns route geometry length in meters', () => {
    const geometry: GeoJSON.LineString = {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [0.01, 0],
      ],
    };

    expect(getRouteMeasuredLength(geometry)).toBeCloseTo(1112, 0);
  });
});
