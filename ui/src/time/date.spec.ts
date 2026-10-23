import {
  areValidityPeriodsOverlapping,
  findEarliestTime,
  findLatestTime,
  isDateInRange,
  mapToISODate,
  parseDate,
  today,
  tryToParseDate,
} from './date';

const date = (iso: string) => Temporal.PlainDate.from(iso);
const period = (start: string | null, end: string | null) => ({
  validity_start: start ? date(start) : null,
  validity_end: end ? date(end) : null,
});

describe(`${today.name}()`, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each`
    instant                   | expected
    ${'2024-01-15T21:59:59Z'} | ${'2024-01-15'}
    ${'2024-01-15T22:00:00Z'} | ${'2024-01-16'}
    ${'2024-06-15T20:59:59Z'} | ${'2024-06-15'}
    ${'2024-06-15T21:00:00Z'} | ${'2024-06-16'}
    ${'2024-12-31T22:00:00Z'} | ${'2025-01-01'}
  `('is $expected in Helsinki at $instant', ({ instant, expected }) => {
    jest
      .spyOn(Temporal.Now, 'instant')
      .mockReturnValue(Temporal.Instant.from(instant));

    expect(today().toString()).toBe(expected);
  });
});

describe(`${parseDate.name}()`, () => {
  test('parses an ISO date', () => {
    expect(parseDate('2024-02-29').toString()).toBe('2024-02-29');
  });

  test('returns a PlainDate as is', () => {
    const input = date('2024-04-20');

    expect(parseDate(input)).toBe(input);
  });

  test.each([null, undefined, ''])('returns undefined for %p', (input) => {
    expect(parseDate(input)).toBeUndefined();
  });

  test.each(['2023-02-29', '2024-13-01', '2024-04-20T12:00:00Z', '20240420'])(
    'throws for %p',
    (input) => {
      expect(() => parseDate(input)).toThrow(RangeError);
    },
  );
});

describe(`${tryToParseDate.name}()`, () => {
  test('returns undefined for an invalid date', () => {
    expect(tryToParseDate('2023-02-29')).toBeUndefined();
  });
});

describe(`${mapToISODate.name}()`, () => {
  test('maps to an ISO date', () => {
    expect(mapToISODate(date('2024-04-20'))).toBe('2024-04-20');
    expect(mapToISODate('2024-04-20')).toBe('2024-04-20');
    expect(mapToISODate(null)).toBeUndefined();
  });
});

describe(`${isDateInRange.name}()`, () => {
  test.each`
    day             | start           | end             | expected
    ${'2024-01-10'} | ${'2024-01-10'} | ${'2024-01-20'} | ${true}
    ${'2024-01-20'} | ${'2024-01-10'} | ${'2024-01-20'} | ${true}
    ${'2024-01-09'} | ${'2024-01-10'} | ${'2024-01-20'} | ${false}
    ${'2024-01-21'} | ${'2024-01-10'} | ${'2024-01-20'} | ${false}
    ${'2024-01-21'} | ${'2024-01-10'} | ${null}         | ${true}
    ${'2024-01-09'} | ${null}         | ${'2024-01-20'} | ${true}
  `('$day in [$start, $end] is $expected', ({ day, start, end, expected }) => {
    const { validity_start: s, validity_end: e } = period(start, end);

    expect(isDateInRange(date(day), s, e)).toBe(expected);
  });
});

describe(`${areValidityPeriodsOverlapping.name}()`, () => {
  test.each`
    a                               | b                               | expected
    ${['2024-01-01', '2024-01-10']} | ${['2024-01-05', '2024-01-20']} | ${true}
    ${['2024-01-01', '2024-01-10']} | ${['2024-01-10', '2024-01-20']} | ${true}
    ${['2024-01-01', '2024-01-09']} | ${['2024-01-10', '2024-01-20']} | ${false}
    ${[null, '2024-01-10']}         | ${['2024-01-10', null]}         | ${true}
    ${[null, '2024-01-09']}         | ${['2024-01-10', null]}         | ${false}
    ${[null, null]}                 | ${['2024-01-10', '2024-01-10']} | ${true}
  `('$a and $b overlap: $expected', ({ a, b, expected }) => {
    const p1 = period(a[0], a[1]);
    const p2 = period(b[0], b[1]);

    expect(areValidityPeriodsOverlapping(p1, p2)).toBe(expected);
    expect(areValidityPeriodsOverlapping(p2, p1)).toBe(expected);
  });
});

describe(`${findEarliestTime.name}() and ${findLatestTime.name}()`, () => {
  const dates = ['2024-03-01', '2023-12-31', '2024-02-29'].map(date);

  test('find the earliest and the latest date', () => {
    expect(findEarliestTime(dates).toString()).toBe('2023-12-31');
    expect(findLatestTime(dates).toString()).toBe('2024-03-01');
  });
});
