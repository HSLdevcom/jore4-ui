import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react';
import { TFunction, keyFromSelector } from 'i18next';
import { DateTime } from 'luxon';
import {
  GetLineValidityByIdDocument,
  LineValidityFragment,
  RouteDirectionEnum,
} from '../../../generated/graphql';
import { RouteFormState } from './RoutePropertiesForm.types';
import {
  assertRouteValidityIsInsideLineValidity,
  assertRouteValidityStartIsBeforeEnd,
  useValidateRouteMetadata,
} from './useValidateRouteMetadata';

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

jest.mock('../../../generated/graphql', () => ({
  ...jest.requireActual('../../../generated/graphql'),
  useGetLineDetailsByIdLazyQuery: jest.fn(() => [
    mockedGetLineDetailsByIdLazyQuery,
  ]),
}));

const defaultRouteParams = {
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
} as const satisfies Partial<RouteFormState>;

describe('useValidateRouteMetadata', () => {
  beforeEach(() => mockedGetLineDetailsByIdLazyQuery.mockClear());

  describe('assertRouteValidityIsInsideLineValidity', () => {
    const line = {
      validity_start: DateTime.local().minus({ days: 1 }),
      validity_end: DateTime.local().plus({ days: 1 }),
    };

    test('should throw an error if route validity start is before line validity start', () => {
      const route = {
        validity_start: DateTime.local().minus({ days: 2 }),
      };

      expect(() =>
        assertRouteValidityIsInsideLineValidity(t, route, line),
      ).toThrow('routes.startNotInsideLineValidity');
    });

    test('should throw an error if route validity end is after line validity end', () => {
      const route = {
        validity_start: DateTime.local(),
        validity_end: DateTime.local().plus({ days: 2 }),
      };

      expect(() =>
        assertRouteValidityIsInsideLineValidity(t, route, line),
      ).toThrow('routes.endNotInsideLineValidity');
    });

    test('should not throw an error if route validity is within line validity', () => {
      const route = {
        validity_start: DateTime.local(),
        validity_end: DateTime.local(),
      };

      expect(() =>
        assertRouteValidityIsInsideLineValidity(t, route, line),
      ).not.toThrow();
    });
  });

  describe('checkIsRouteValidityStartIsBeforeEnd', () => {
    test('should throw an error if route validity start is not before validity end', () => {
      const route = {
        validity_start: DateTime.local().plus({ days: 1 }),
        validity_end: DateTime.local(),
      };

      expect(() => assertRouteValidityStartIsBeforeEnd(t, route)).toThrow(
        'routes.validityStartIsAfterEnd',
      );
    });

    test('should not throw an error if route validity start is before validity end', () => {
      const route = {
        validity_start: DateTime.local(),
        validity_end: DateTime.local().plus({ days: 1 }),
      };

      expect(() => assertRouteValidityStartIsBeforeEnd(t, route)).not.toThrow();
    });
  });

  describe('validateRouteMetadata', () => {
    const lineId = '00000000-0000-0000-0000-000000000000';

    function renderValidationHook(line: LineValidityFragment) {
      return renderHook(() => useValidateRouteMetadata(), {
        wrapper: ({ children }) => (
          <MockedProvider
            mocks={[
              {
                request: {
                  query: GetLineValidityByIdDocument,
                  variables: { lineId },
                },
                result: {
                  data: {
                    line: {
                      ...line,
                      __typename: 'route_line',
                    },
                  },
                },
              },
            ]}
          >
            {children}
          </MockedProvider>
        ),
      }).result.current;
    }

    test('should validate metadata with line validity period', async () => {
      const routeMetadata: RouteFormState = {
        ...defaultRouteParams,
        onLineId: lineId,
        validityStart: DateTime.local().toISO(),
        validityEnd: DateTime.local().toISO(),
        indefinite: false,
      };

      const validateRouteMetadata = renderValidationHook({
        line_id: lineId,
        validity_start: DateTime.local().minus({ days: 1 }),
        validity_end: DateTime.local().plus({ days: 1 }),
      });

      await expect(
        validateRouteMetadata(routeMetadata),
      ).resolves.toBeUndefined();
    });

    test('should throw an error if route metadata is outside line validity period', async () => {
      const routeMetadata: RouteFormState = {
        ...defaultRouteParams,
        onLineId: lineId,
        validityStart: DateTime.local().plus({ days: 2 }).toISO(),
        validityEnd: DateTime.local().plus({ days: 3 }).toISO(),
        indefinite: false,
      };

      const validateRouteMetadata = renderValidationHook({
        line_id: lineId,
        validity_start: DateTime.local(),
        validity_end: DateTime.local().plus({ days: 1 }),
      });

      await expect(validateRouteMetadata(routeMetadata)).rejects.toThrow(
        'routes.endNotInsideLineValidity',
      );
    });
  });
});
