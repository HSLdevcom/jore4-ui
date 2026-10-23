import { mapDateInputToValidityEnd } from './utils';

describe(`${mapDateInputToValidityEnd.name}()`, () => {
  const isoDate = '2017-04-20';

  test('Maps ISO date to a date', () => {
    const output = mapDateInputToValidityEnd(isoDate)?.toString();
    expect(output).toBe('2017-04-20');
  });

  test('Maps indefinite to null', () => {
    expect(mapDateInputToValidityEnd(undefined, true)).toBeNull();
  });
});
