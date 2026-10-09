import { TFunction, keyFromSelector } from 'i18next';
import { DateTime } from 'luxon';
import { mapToValidityPeriod } from './validity';

function mockT(selector: ExplicitAny) {
  return keyFromSelector(selector);
}

const t = mockT as unknown as TFunction;

describe(`${mapToValidityPeriod.name}()`, () => {
  const start = DateTime.fromISO('2021-01-01');
  const end = DateTime.fromISO('2025-12-31');

  test('should format a bounded validity period', () => {
    expect(mapToValidityPeriod(t, start, end)).toBe('1.1.2021 -  31.12.2025');
  });

  test('should present an unbounded end as indefinite', () => {
    expect(mapToValidityPeriod(t, start, null)).toBe(
      '1.1.2021 -  saveChangesModal.indefinite',
    );
  });

  test('should present an unbounded start as indefinite', () => {
    expect(mapToValidityPeriod(t, null, end)).toBe(
      'saveChangesModal.indefinite -  31.12.2025',
    );
  });
});
