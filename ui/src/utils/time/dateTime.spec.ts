import { now, parseDateTime } from './dateTime';

afterEach(() => {
  jest.restoreAllMocks();
});

describe(`${now.name}()`, () => {
  test('returns the current time in Helsinki', () => {
    jest
      .spyOn(Temporal.Now, 'instant')
      .mockReturnValue(Temporal.Instant.from('2024-06-15T09:00:00Z'));

    expect(now().toString()).toBe('2024-06-15T12:00:00+03:00[Europe/Helsinki]');
  });
});

describe(`${parseDateTime.name}()`, () => {
  test.each`
    input                                 | expected
    ${'2017-04-20T11:32:00.000Z'}         | ${'2017-04-20T14:32:00+03:00'}
    ${'2017-04-20T11:32:00.000-04:00'}    | ${'2017-04-20T18:32:00+03:00'}
    ${'2017-04-20T11:32:00.123456+00:00'} | ${'2017-04-20T14:32:00.123456+03:00'}
    ${'2017-01-20T11:32:00'}              | ${'2017-01-20T13:32:00+02:00'}
    ${'2024-03-31T00:59:59Z'}             | ${'2024-03-31T02:59:59+02:00'}
    ${'2024-03-31T01:00:00Z'}             | ${'2024-03-31T04:00:00+03:00'}
    ${'2024-10-27T00:30:00Z'}             | ${'2024-10-27T03:30:00+03:00'}
    ${'2024-10-27T01:30:00Z'}             | ${'2024-10-27T03:30:00+02:00'}
  `('parses $input to $expected in Helsinki', ({ input, expected }) => {
    const output = parseDateTime(input);

    expect(output.timeZoneId).toBe('Europe/Helsinki');
    expect(output.toString({ timeZoneName: 'never' })).toBe(expected);
  });

  test('converts a ZonedDateTime to Helsinki', () => {
    const input = Temporal.ZonedDateTime.from(
      '2017-04-20T11:32:00-04:00[America/New_York]',
    );

    expect(parseDateTime(input).toString()).toBe(
      '2017-04-20T18:32:00+03:00[Europe/Helsinki]',
    );
  });

  test('round-trips through an offset ISO string', () => {
    const input = parseDateTime('2024-10-27T01:30:00Z');

    expect(
      parseDateTime(input.toString({ timeZoneName: 'never' })).equals(input),
    ).toBe(true);
  });

  test.each([null, undefined, ''])('returns undefined for %p', (input) => {
    expect(parseDateTime(input)).toBeUndefined();
  });

  test('throws for a date without a time', () => {
    expect(() => parseDateTime('2017-04-20')).toThrow(RangeError);
  });
});
