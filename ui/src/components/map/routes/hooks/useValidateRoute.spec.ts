import { renderHook } from '@testing-library/react';
import { DateTime } from 'luxon';
import { RouteDirectionEnum } from '../../../../generated/graphql';
import { RouteFormState } from '../../../forms/route/RoutePropertiesForm.types';
import { useValidateRoute } from './useValidateRoute';

jest.mock('@apollo/client', () => ({
  useLazyQuery: jest.fn(),
  gql: jest.fn(),
}));

jest.mock('i18next', () => ({
  use: jest.fn(() => ({
    init: jest.fn(),
  })),
  t: (key: string) => key,
}));

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

type GetLineDetailsByIdMockData = {
  readonly validity_start: DateTime;
  readonly validity_end: DateTime;
};

type GetLineDetailsByIdMockResponse = {
  readonly data: {
    readonly route_line_by_pk: GetLineDetailsByIdMockData;
  };
};

const mockedGetLineDetailsByIdLazyQuery = jest.fn<
  Promise<GetLineDetailsByIdMockResponse>,
  unknown[],
  unknown
>(() => Promise.reject(new Error('Not mocked!')));

jest.mock('../../../../generated/graphql', () => ({
  ...jest.requireActual('../../../../generated/graphql'),
  useGetLineDetailsByIdLazyQuery: jest.fn(() => [
    mockedGetLineDetailsByIdLazyQuery,
  ]),
}));

const defaultRouteParams: Partial<RouteFormState> = {
  destination: {
    name: { fi_FI: '', sv_FI: '' },
    shortName: { fi_FI: '', sv_FI: '' },
  },
  direction: RouteDirectionEnum.Anticlockwise,
  finnishName: '',
  label: '',
  origin: {
    name: { fi_FI: '', sv_FI: '' },
    shortName: { fi_FI: '', sv_FI: '' },
  },
  priority: 10,
  variant: 1,
};

function mockGetLineDetailsByIdResult(
  line: GetLineDetailsByIdMockData,
): Promise<GetLineDetailsByIdMockResponse> {
  return Promise.resolve({ data: { route_line_by_pk: line } });
}

describe('useValidateRoute', () => {
  const { result } = renderHook(() => useValidateRoute());

  beforeEach(() => mockedGetLineDetailsByIdLazyQuery.mockClear());

  describe('validateStopCount', () => {
    test('should throw an error if there are fewer than 2 stops', () => {
      expect(() => result.current.validateStopCount(['Stop1'])).toThrow(
        'routes.tooFewStops',
      );
    });

    test('should not throw an error if there are 2 or more stops', () => {
      expect(() =>
        result.current.validateStopCount(['Stop1', 'Stop2']),
      ).not.toThrow();
    });
  });

  describe('validateJourneyPattern', () => {
    test('should validate journey pattern by calling validateStopCount', async () => {
      await expect(
        result.current.validateJourneyPattern({
          includedStopLabels: ['Stop1'],
        }),
      ).rejects.toThrow('routes.tooFewStops');
    });
  });

  describe('checkIsRouteValidityInsideLineValidity', () => {
    const line = {
      validity_start: DateTime.local().minus({ days: 1 }),
      validity_end: DateTime.local().plus({ days: 1 }),
    };

    test('should throw an error if route validity start is before line validity start', () => {
      const route = {
        validity_start: DateTime.local().minus({ days: 2 }),
      };

      expect(() =>
        result.current.checkIsRouteValidityInsideLineValidity(route, line),
      ).toThrow('routes.startNotInsideLineValidity');
    });

    test('should throw an error if route validity end is after line validity end', () => {
      const route = {
        validity_start: DateTime.local(),
        validity_end: DateTime.local().plus({ days: 2 }),
      };

      expect(() =>
        result.current.checkIsRouteValidityInsideLineValidity(route, line),
      ).toThrow('routes.endNotInsideLineValidity');
    });

    test('should not throw an error if route validity is within line validity', () => {
      const route = {
        validity_start: DateTime.local(),
        validity_end: DateTime.local(),
      };

      expect(() =>
        result.current.checkIsRouteValidityInsideLineValidity(route, line),
      ).not.toThrow();
    });
  });

  describe('checkIsRouteValidityStartIsBeforeEnd', () => {
    test('should throw an error if route validity start is not before validity end', () => {
      const route = {
        validity_start: DateTime.local().plus({ days: 1 }),
        validity_end: DateTime.local(),
      };

      expect(() =>
        result.current.checkIsRouteValidityStartIsBeforeEnd(route),
      ).toThrow('routes.validityStartIsAfterEnd');
    });

    test('should not throw an error if route validity start is before validity end', () => {
      const route = {
        validity_start: DateTime.local(),
        validity_end: DateTime.local().plus({ days: 1 }),
      };

      expect(() =>
        result.current.checkIsRouteValidityStartIsBeforeEnd(route),
      ).not.toThrow();
    });
  });

  describe('validateMetadata', () => {
    test('should validate metadata with line validity period', async () => {
      const lineMock = {
        validity_start: DateTime.local().minus({ days: 1 }),
        validity_end: DateTime.local().plus({ days: 1 }),
      };

      mockedGetLineDetailsByIdLazyQuery.mockReturnValueOnce(
        mockGetLineDetailsByIdResult(lineMock),
      );

      const routeMetadata: Partial<RouteFormState> = {
        ...defaultRouteParams,
        onLineId: 'line-id',
        validityStart: DateTime.local().toISO(),
        validityEnd: DateTime.local().toISO(),
        indefinite: false,
      };

      await expect(
        result.current.validateMetadata(routeMetadata as RouteFormState),
      ).resolves.toBe(undefined);
    });

    test('should throw an error if route metadata is outside line validity period', async () => {
      const lineMock = {
        validity_start: DateTime.local(),
        validity_end: DateTime.local().plus({ days: 1 }),
      };

      mockedGetLineDetailsByIdLazyQuery.mockReturnValueOnce(
        mockGetLineDetailsByIdResult(lineMock),
      );

      const routeMetadata: Partial<RouteFormState> = {
        ...defaultRouteParams,
        onLineId: 'line-id',
        validityStart: DateTime.local().plus({ days: 2 }).toISO(),
        validityEnd: DateTime.local().plus({ days: 3 }).toISO(),
        indefinite: false,
      };

      await expect(
        result.current.validateMetadata(routeMetadata as RouteFormState),
      ).rejects.toThrow('routes.endNotInsideLineValidity');
    });
  });
});
