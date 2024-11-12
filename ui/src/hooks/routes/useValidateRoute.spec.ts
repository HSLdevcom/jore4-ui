import { DateTime } from 'luxon';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import { RouteDirectionEnum } from '../../generated/graphql';
import { mapLineDetailsResult } from '../../graphql';
import { renderHook } from '../../utils/test-utils';
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

jest.mock('../../generated/graphql', () => ({
  ...jest.requireActual('../../generated/graphql'),
  useGetLineDetailsByIdLazyQuery: jest.fn(() => [jest.fn()]),
}));

jest.mock('../../graphql', () => ({
  mapLineDetailsResult: jest.fn(),
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

describe('useValidateRoute', () => {
  const { result } = renderHook(() => useValidateRoute());
  const mockedGetLineDetailsByIdLazyQuery = jest.fn();

  jest
    .requireMock('../../generated/graphql')
    .useGetLineDetailsByIdLazyQuery.mockImplementation(() => {
      return [jest.fn(), jest.fn()];
    });

  mockedGetLineDetailsByIdLazyQuery.mockImplementation(() => [jest.fn()]);
  const mockedMapLineDetailsResult = mapLineDetailsResult as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

      jest
        .requireMock('../../generated/graphql')
        .useGetLineDetailsByIdLazyQuery.mockReturnValue(() => {
          return [jest.fn(() => lineMock)];
        });

      mockedMapLineDetailsResult.mockReturnValue(lineMock);

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

      mockedGetLineDetailsByIdLazyQuery.mockReturnValue([
        () => Promise.resolve(lineMock),
      ]);

      jest
        .requireMock('../../generated/graphql')
        .useGetLineDetailsByIdLazyQuery.mockImplementation(() => {
          return [mockedMapLineDetailsResult];
        });
      mockedMapLineDetailsResult.mockReturnValue(lineMock);

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
