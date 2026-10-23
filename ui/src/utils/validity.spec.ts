import { TFunction, keyFromSelector } from 'i18next';
import { isEndingSoon, isPastEntity, mapToValidityPeriod } from './validity';

function mockT(selector: ExplicitAny) {
  return keyFromSelector(selector);
}

const t = mockT as unknown as TFunction;

describe(`${mapToValidityPeriod.name}()`, () => {
  const start = Temporal.PlainDate.from('2021-01-01');
  const end = Temporal.PlainDate.from('2025-12-31');

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

describe(`${isEndingSoon.name}()`, () => {
  beforeEach(() => {
    jest
      .spyOn(Temporal.Now, 'instant')
      .mockReturnValue(Temporal.Instant.from('2024-06-15T09:00:00Z'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each`
    validityEnd     | expected
    ${'2024-06-14'} | ${false}
    ${'2024-06-15'} | ${true}
    ${'2024-07-05'} | ${true}
    ${'2024-07-06'} | ${false}
    ${null}         | ${false}
  `(
    'is $expected for validity ending $validityEnd',
    ({ validityEnd, expected }) => {
      expect(isEndingSoon(validityEnd)).toBe(expected);
    },
  );
});

describe(`${isPastEntity.name}()`, () => {
  const observationDate = Temporal.PlainDate.from('2024-06-15');
  const endingOn = (date: string | null) => ({
    validity_end: date ? Temporal.PlainDate.from(date) : null,
  });

  test('is not past on the last day of validity', () => {
    expect(isPastEntity(observationDate, endingOn('2024-06-15'))).toBe(false);
  });

  test('is past after the last day of validity', () => {
    expect(isPastEntity(observationDate, endingOn('2024-06-14'))).toBe(true);
  });

  test('is never past with an indefinite validity', () => {
    expect(isPastEntity(observationDate, endingOn(null))).toBe(false);
  });
});
