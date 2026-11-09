import { getRouteMeasuredLength } from './utils';

describe('getRouteMeasuredLength', () => {
  test('returns null when the route has no infrastructure links', () => {
    expect(getRouteMeasuredLength(undefined)).toBeNull();
  });

  test('returns the sum of infrastructure link lengths in meters', () => {
    const infraLinks = [
      { estimated_length_in_metres: 1200 },
      { estimated_length_in_metres: 1100 },
      { estimated_length_in_metres: 1600 },
    ];

    expect(getRouteMeasuredLength(infraLinks)).toBe(3900);
  });

  test('treats missing infrastructure link lengths as zero', () => {
    expect(
      getRouteMeasuredLength([
        { estimated_length_in_metres: 1200 },
        { estimated_length_in_metres: null },
      ]),
    ).toBe(1200);
  });
});
