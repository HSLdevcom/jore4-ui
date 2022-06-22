import { DateTime } from 'luxon';
import { i18n } from './i18n';
import { formatDate, mapToISODate, parseDate } from './time';

describe(`${formatDate.name}()`, () => {
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
