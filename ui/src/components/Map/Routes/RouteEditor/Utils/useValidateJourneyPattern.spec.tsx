import { renderHook } from '@testing-library/react';
import { TFunction, keyFromSelector } from 'i18next';
import { useValidateJourneyPattern } from './useValidateJourneyPattern';

function mockT(selector: ExplicitAny, details: unknown) {
  const key = keyFromSelector(selector);

  if (details) {
    return `${key}: ${JSON.stringify(details)}`;
  }

  return key;
}

const t = mockT as unknown as TFunction;

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t }),
}));

describe('useValidateJourneyPattern', () => {
  const { result } = renderHook(() => useValidateJourneyPattern());

  test('should throw an error if there are fewer than 2 stopst', () => {
    expect(() => result.current({ includedStopLabels: ['Stop1'] })).toThrow(
      'routes.tooFewStops',
    );
  });

  test('should not throw an error if there are 2 or more stops', () => {
    expect(() =>
      result.current({ includedStopLabels: ['Stop1', 'Stop2'] }),
    ).not.toThrow();
  });
});
