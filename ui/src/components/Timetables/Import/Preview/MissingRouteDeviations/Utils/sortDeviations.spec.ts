import { buildLocalizedString } from '@hsl/jore4-test-db-manager';
import { RouteDirectionEnum } from '../../../../../../generated/graphql';
import { sortDeviations } from './sortDeviations';
import { VehicleScheduleFrameInfo } from './useCreateVehicleScheduleFrameInfo';

describe('sortDeviations', () => {
  test('should sort by label in ascending order', () => {
    const data: VehicleScheduleFrameInfo[] = [
      {
        uniqueLabel: '22',
        lineId: '1',
        direction: RouteDirectionEnum.Inbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
      {
        uniqueLabel: '135',
        lineId: '2',
        direction: RouteDirectionEnum.Inbound,
        routeId: '2',
        routeName: buildLocalizedString('route'),
      },
    ];

    const sortedDeviations = sortDeviations(data);

    expect(sortedDeviations).toEqual([
      {
        uniqueLabel: '135',
        lineId: '2',
        direction: RouteDirectionEnum.Inbound,
        routeId: '2',
        routeName: buildLocalizedString('route'),
      },
      {
        uniqueLabel: '22',
        lineId: '1',
        direction: RouteDirectionEnum.Inbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
    ]);
  });

  test('should sort by direction when label is the same', () => {
    const data: VehicleScheduleFrameInfo[] = [
      {
        uniqueLabel: '22',
        lineId: '1',
        direction: RouteDirectionEnum.Inbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
      {
        uniqueLabel: '22',
        lineId: '2',
        direction: RouteDirectionEnum.Outbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
    ];

    const sortedDeviations = sortDeviations(data);

    expect(sortedDeviations).toEqual([
      {
        uniqueLabel: '22',
        lineId: '2',
        direction: RouteDirectionEnum.Outbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
      {
        uniqueLabel: '22',
        lineId: '1',
        direction: RouteDirectionEnum.Inbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
    ]);
  });

  test('should sort labels without variant first', () => {
    const data: VehicleScheduleFrameInfo[] = [
      {
        uniqueLabel: 'A_3',
        lineId: '1',
        direction: RouteDirectionEnum.Outbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
      {
        uniqueLabel: 'A',
        lineId: '1',
        direction: RouteDirectionEnum.Inbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
      {
        uniqueLabel: 'A',
        lineId: '1',
        direction: RouteDirectionEnum.Outbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
    ];

    const sortedDeviations = sortDeviations(data);

    expect(sortedDeviations).toEqual([
      {
        uniqueLabel: 'A',
        lineId: '1',
        direction: RouteDirectionEnum.Outbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
      {
        uniqueLabel: 'A',
        lineId: '1',
        direction: RouteDirectionEnum.Inbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
      {
        uniqueLabel: 'A_3',
        lineId: '1',
        direction: RouteDirectionEnum.Outbound,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
    ]);
  });
});
