import { DateTime } from 'luxon';
import {
  findEarliestTime,
  findLatestTime,
  formatDateWithLocale,
  mapToISODate,
  parseDate,
} from './time';

describe(`${formatDateWithLocale.name}()`, () => {
  // These tests temporariry disabled as we had to hard-code
  // used date and datetime formats instead of using localized
  // ones in order to do temporary workaround for flaky
  // snapshot tests that got broke due to various locales (?)
  // of github ci machines that resulted different formattings for dates
  // depending on ci machine that ran the test.
  // eslint-disable-next-line jest/no-commented-out-tests
  /*
  beforeEach(() => {
    i18n.changeLanguage('fi-FI');
  });

  const isoDate = '2017-04-20T11:32:00.000Z';
  test('Should be able to format dates from ISO string inputs', () => {
    const output = formatDate(DateTime.DATETIME_FULL, isoDate);
    expect(output).toBe('20. huhtikuuta 2017 klo 14.32 UTC+3');
  });

  test('Should be able to format dates from luxon inputs', () => {
    const date = DateTime.fromISO(isoDate);
    const output = formatDate(DateTime.DATETIME_FULL, date);
    expect(output).toBe('20. huhtikuuta 2017 klo 14.32 UTC+3');
  });

  test('Should be able to use default locale from i18n', () => {
    i18n.changeLanguage('en-US');
    const output = formatDate(DateTime.DATETIME_FULL, isoDate);
    expect(output).toBe('April 20, 2017, 2:32 PM GMT+3');
  });

  test('Should be able to override default locale from i18n', () => {
    const output = formatDate(DateTime.DATETIME_FULL, isoDate, 'en-US');
    expect(output).toBe('April 20, 2017, 2:32 PM GMT+3');
  });

  test('Should always use Finnish time zone, regardless of the input', () => {
    const date = DateTime.fromISO('2017-04-20T11:32:00.000-04:00');
    const output = formatDate(DateTime.DATETIME_FULL, date);
    expect(output).toBe('20. huhtikuuta 2017 klo 18.32 UTC+3');
  });
  */
});

describe(`${parseDate.name}()`, () => {
  const isoDate = '2017-04-20T11:32:00.000Z';

  test('Maps ISO string to equivalent DateTime object', () => {
    const output = parseDate(isoDate);
    expect(DateTime.isDateTime(output)).toBe(true);
    expect(output?.toUTC().toISO()).toBe(isoDate);
  });
});

describe(`${mapToISODate.name}()`, () => {
  const isoString = '2017-04-20T11:32:00.000Z';

  test('Maps ISO string to ISO date', () => {
    const output = mapToISODate(isoString);
    expect(output).toBe('2017-04-20');
  });
});

const earliest = DateTime.fromISO('2022-08-11T00:00:00.000+03:00');
const middle = DateTime.fromISO('2022-08-12T00:00:00.000+03:00');
const latest = DateTime.fromISO('2022-08-13T00:00:00.000+03:00');

describe('Utils to find earliest/latest times', () => {
  describe(`${findEarliestTime.name}()`, () => {
    test('Finds earliest time when located in middle of input array', () => {
      const output = findEarliestTime([middle, earliest, latest]);
      expect(output.toISODate()).toBe(earliest.toISODate());
    });

    test('Finds earliest time when located at beginning of input array', () => {
      const output = findEarliestTime([earliest, latest, middle]);
      expect(output.toISODate()).toBe(earliest.toISODate());
    });

    test('Finds earliest time when there are only 1 element in input array', () => {
      const output = findEarliestTime([earliest]);
      expect(output.toISODate()).toBe(earliest.toISODate());
    });
  });

  describe(`${findLatestTime.name}()`, () => {
    test('Finds latest time when located in middle of input array', () => {
      const output = findLatestTime([middle, latest, earliest]);
      expect(output.toISODate()).toBe(latest.toISODate());
    });

    test('Finds latest time when located at beginning of input array', () => {
      const output = findLatestTime([latest, earliest, middle]);
      expect(output.toISODate()).toBe(latest.toISODate());
    });

    test('Finds latest time when there are only 1 element in input array', () => {
      const output = findLatestTime([latest]);
      expect(output.toISODate()).toBe(latest.toISODate());
    });
  });
});
