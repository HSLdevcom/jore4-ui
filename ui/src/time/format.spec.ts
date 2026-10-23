import { parseDateTime } from './dateTime';
import {
  mapDurationToShortTime,
  mapToShortDate,
  mapToShortDateTime,
  mapToShortTime,
} from './format';

describe(`${mapToShortDate.name}()`, () => {
  test('formats as d.M.yyyy', () => {
    expect(mapToShortDate(Temporal.PlainDate.from('2024-02-01'))).toBe(
      '1.2.2024',
    );
    expect(mapToShortDate(Temporal.PlainDate.from('2024-12-31'))).toBe(
      '31.12.2024',
    );
    expect(mapToShortDate(null)).toBeUndefined();
  });

  test('accepts ISO date strings', () => {
    expect(mapToShortDate('2024-02-01')).toBe('1.2.2024');
    expect(mapToShortDate('')).toBeUndefined();
  });
});

describe(`${mapToShortTime.name}()`, () => {
  test('formats as H.mm', () => {
    expect(mapToShortTime(parseDateTime('2024-01-15T07:05:00Z'))).toBe('9.05');
    expect(mapToShortTime(parseDateTime('2024-06-15T21:00:00Z'))).toBe('0.00');
    expect(mapToShortTime(undefined)).toBeUndefined();
  });
});

describe(`${mapToShortDateTime.name}()`, () => {
  test.each`
    input                     | expected
    ${'2024-02-01T07:05:00Z'} | ${'1.2.2024 9.05'}
    ${'2024-03-31T21:30:00Z'} | ${'1.4.2024 0.30'}
    ${'2024-10-27T00:30:00Z'} | ${'27.10.2024 3.30'}
    ${'2024-10-27T01:30:00Z'} | ${'27.10.2024 3.30'}
  `('formats $input as $expected', ({ input, expected }) => {
    expect(mapToShortDateTime(parseDateTime(input))).toBe(expected);
  });
});

describe(`${mapDurationToShortTime.name}()`, () => {
  test.each`
    input        | expected
    ${'PT4H30M'} | ${'04:30'}
    ${'PT28H5M'} | ${'28:05'}
  `('formats $input as $expected', ({ input, expected }) => {
    expect(mapDurationToShortTime(Temporal.Duration.from(input))).toBe(
      expected,
    );
  });
});
