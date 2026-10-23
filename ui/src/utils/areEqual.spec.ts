// eslint-disable-next-line no-restricted-imports -- compares against lodash behaviour
import isEqual from 'lodash/isEqual';
import { areEqual } from './areEqual';

describe('areEqual', () => {
  it('equal PlainDates should be equal', () => {
    const a = Temporal.PlainDate.from('2024-02-29');
    const b = Temporal.PlainDate.from('2024-02-29');

    expect(a !== b).toBeTruthy();
    expect(isEqual(a, b)).toBeFalsy();
    expect(areEqual(a, b)).toBeTruthy();
  });

  it('different PlainDates should not be equal', () => {
    const a = Temporal.PlainDate.from('2024-02-29');
    const b = Temporal.PlainDate.from('2024-03-01');

    expect(areEqual(a, b)).toBeFalsy();
  });

  it('should work if the other value is nullish', () => {
    const date = Temporal.PlainDate.from('2024-02-29');
    expect(areEqual({ date }, { date: null })).toBeFalsy();
    expect(areEqual({ date: null }, { date })).toBeFalsy();
    expect(areEqual({ date }, { date: undefined })).toBeFalsy();
    expect(areEqual({ date: undefined }, { date })).toBeFalsy();
    expect(areEqual({ date }, {})).toBeFalsy();
    expect(areEqual({}, { date })).toBeFalsy();
  });

  it('should compare Durations by length', () => {
    const duration = (iso: string) => Temporal.Duration.from(iso);

    expect(areEqual(duration('PT1H'), duration('PT1H'))).toBeTruthy();
    expect(areEqual(duration('PT1H'), duration('PT60M'))).toBeTruthy();
    expect(areEqual(duration('PT1H'), duration('PT2H'))).toBeFalsy();
    expect(areEqual({ time: duration('PT1H') }, { time: null })).toBeFalsy();
  });
});
