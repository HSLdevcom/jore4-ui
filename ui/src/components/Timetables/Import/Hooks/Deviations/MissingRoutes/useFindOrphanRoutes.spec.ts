import { buildLocalizedString } from '@hsl/jore4-test-db-manager';
import { renderHook } from '@testing-library/react';
import { RouteDirectionEnum } from '../../../../../../generated/graphql';
import { useFindOrphanRoutes } from './useFindOrphanRoutes';

const notUsedPartOfInfoObject = {
  direction: RouteDirectionEnum.Inbound,
  lineId: '0',
  routeName: buildLocalizedString('route'),
};

const testCases = [
  {
    testName: 'should find correct object when uniqueLabel is unique',
    toReplaceRoutes: [
      {
        uniqueLabel: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
      {
        uniqueLabel: 'A',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    stagingRoutes: [
      {
        uniqueLabel: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
    ],
    expected: [
      {
        uniqueLabel: 'A',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
  },
  {
    testName:
      'should find object with unique route id when uniqueLabel is the same',
    toReplaceRoutes: [
      {
        uniqueLabel: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
      {
        uniqueLabel: 'B',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    stagingRoutes: [
      {
        uniqueLabel: 'B',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    expected: [
      {
        uniqueLabel: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
    ],
  },
  {
    testName: 'should return empty list when inputs have same content',
    toReplaceRoutes: [
      {
        uniqueLabel: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
      {
        uniqueLabel: 'B',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    stagingRoutes: [
      {
        uniqueLabel: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
      {
        uniqueLabel: 'B',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    expected: [],
  },
  {
    testName: 'should return empty list when toReplace is empty',
    toReplaceRoutes: [],
    stagingRoutes: [
      {
        uniqueLabel: 'B',
        routeId: '1',
        ...notUsedPartOfInfoObject,
      },
      {
        uniqueLabel: 'B',
        routeId: '2',
        ...notUsedPartOfInfoObject,
      },
    ],
    expected: [],
  },
];

describe('findOrphanRoutes hook', () => {
  testCases.forEach((testArgs) => {
    const { testName, toReplaceRoutes, stagingRoutes, expected } = testArgs;

    test(`${testName}`, () => {
      const { result } = renderHook(() => useFindOrphanRoutes());

      const orphans = result.current.findOrphanRoutes({
        toReplaceRoutes,
        stagingRoutes,
      });

      expect(orphans).toEqual(expected);
    });
  });
});
