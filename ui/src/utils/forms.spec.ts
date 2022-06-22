import { mapDateInputToValidityEnd } from './forms';

describe(`${mapDateInputToValidityEnd.name}()`, () => {
  const isoDate = '2017-04-20';
  test('Maps ISO date to DateTime at the end of that day', () => {
    const output = mapDateInputToValidityEnd(isoDate)?.toISO();
    expect(output).toBe('2017-04-20T23:59:59.999+03:00');
  });
});
