import { buildLocalizedString } from '@hsl/jore4-test-db-manager';
import { RouteDirectionEnum } from '../../generated/graphql';
import { renderHook } from '../../utils/test-utils/renderer';
import { useFindOrpanRoutes } from './useFindOrphanroutes';

const hookForNames = renderHook(useFindOrpanRoutes);

const notUsedPartOfInfoObject = {
  direction: RouteDirectionEnum.Inbound,
  variant: null,
  lineId: '0',
  routeName: buildLocalizedString('route'),
};

const testCases = [
  {
    testName: 'should find correct object when label is unique',
    toReplaceRoutes: [
      {
        label: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
      {
        label: 'A',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    stagingRoutes: [
      {
        label: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
    ],
    expected: [
      {
        label: 'A',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
  },
  {
    testName: 'should find object with unique route id when label is the same',
    toReplaceRoutes: [
      {
        label: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
      {
        label: 'B',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    stagingRoutes: [
      {
        label: 'B',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    expected: [
      {
        label: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
    ],
  },
  {
    testName: 'should return empty list when inputs have same content',
    toReplaceRoutes: [
      {
        label: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
      {
        label: 'B',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    stagingRoutes: [
      {
        label: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
      {
        label: 'B',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    expected: [],
  },
  {
    testName: 'when toReplace is empty',
    toReplaceRoutes: [],
    stagingRoutes: [
      {
        label: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
      {
        label: 'B',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    expected: [],
  },
];

describe(`${hookForNames.result.current.findOrphanRoutes.name}`, () => {
  testCases.forEach((testArgs) => {
    const { testName, toReplaceRoutes, stagingRoutes, expected } = testArgs;

    test(`${testName}`, () => {
      const { result } = renderHook(() => useFindOrpanRoutes());

      const orphans = result.current.findOrphanRoutes(
        toReplaceRoutes,
        stagingRoutes,
      );

      expect(orphans).toEqual(expected);
    });
  });
});
