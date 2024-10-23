import isEqual from 'lodash/isEqual';
import { DateTime } from 'luxon';
import { areEqual } from './areEqual';

describe('areEqual', () => {
  it('cloned valid DateTimes should be equal', () => {
    const now = DateTime.now();
    const cloned = now.plus({ days: 0 });

    expect(now !== cloned).toBeTruthy();
    expect(areEqual(now, cloned)).toBeTruthy();
  });

  it('invalid DateTimes should not be equal', () => {
    const a = DateTime.fromMillis(Number.NaN);
    const b = DateTime.fromMillis(Number.NaN);

    expect(a !== b).toBeTruthy();
    expect(isEqual(a, b)).toBeTruthy();
    expect(areEqual(a, b)).toBeFalsy();
  });

  it('should work if the other value is nullish', () => {
    const now = DateTime.now();
    expect(areEqual({ now }, { now: null })).toBeFalsy();
    expect(areEqual({ now: null }, { now })).toBeFalsy();
    expect(areEqual({ now }, { now: undefined })).toBeFalsy();
    expect(areEqual({ now: undefined }, { now })).toBeFalsy();
    expect(areEqual({ now }, {})).toBeFalsy();
    expect(areEqual({}, { now })).toBeFalsy();
  });
});
