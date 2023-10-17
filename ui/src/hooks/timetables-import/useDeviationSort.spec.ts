import {
  RouteDirectionEnum,
  buildLocalizedString,
} from '@hsl/jore4-test-db-manager';
import { renderHook } from '@testing-library/react';
import { VehicleScheduleFrameInfo } from '../vehicle-schedule-frame/useVehicleScheduleFramesToVehicleScheduleFrameInfo';
import { useDeviationSort } from './useDeviationSort';

const hookForNames = renderHook(useDeviationSort);

describe(`${hookForNames.result.current.sortDeviations.name}`, () => {
  const { result } = renderHook(useDeviationSort);

  test('should sort by label in ascending order', () => {
    const data: VehicleScheduleFrameInfo[] = [
      {
        label: 'B',
        lineId: '1',
        direction: RouteDirectionEnum.Inbound,
        variant: null,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
      {
        label: 'A',
        lineId: '2',
        direction: RouteDirectionEnum.Inbound,
        variant: null,
        routeId: '2',
        routeName: buildLocalizedString('route'),
      },
    ];

    const sortedDeviations = result.current.sortDeviations(data);

    expect(sortedDeviations[0]).toEqual({
      label: 'A',
      lineId: '2',
      direction: RouteDirectionEnum.Inbound,
      variant: null,
      routeId: '2',
      routeName: buildLocalizedString('route'),
    });

    expect(sortedDeviations[1]).toEqual({
      label: 'B',
      lineId: '1',
      direction: RouteDirectionEnum.Inbound,
      variant: null,
      routeId: '1',
      routeName: buildLocalizedString('route'),
    });
  });

  test('should sort by direction when label is the same', () => {
    const data: VehicleScheduleFrameInfo[] = [
      {
        label: 'A',
        lineId: '1',
        direction: RouteDirectionEnum.Inbound,
        variant: null,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
      {
        label: 'A',
        lineId: '2',
        direction: RouteDirectionEnum.Outbound,
        variant: null,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
    ];

    const sortedDeviations = result.current.sortDeviations(data);

    expect(sortedDeviations[0]).toEqual({
      label: 'A',
      lineId: '2',
      direction: RouteDirectionEnum.Outbound,
      variant: null,
      routeId: '1',
      routeName: buildLocalizedString('route'),
    });

    expect(sortedDeviations[1]).toEqual({
      label: 'A',
      lineId: '1',
      direction: RouteDirectionEnum.Inbound,
      variant: null,
      routeId: '1',
      routeName: buildLocalizedString('route'),
    });
  });

  test('should prioritize null variants first when label and direction are the same', () => {
    const data: VehicleScheduleFrameInfo[] = [
      {
        label: 'A',
        lineId: '1',
        direction: RouteDirectionEnum.Inbound,
        variant: 3,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
      {
        label: 'A',
        lineId: '2',
        direction: RouteDirectionEnum.Outbound,
        variant: null,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
    ];

    const sortedDeviations = result.current.sortDeviations(data);

    expect(sortedDeviations[0]).toEqual({
      label: 'A',
      lineId: '2',
      direction: RouteDirectionEnum.Outbound,
      variant: null,
      routeId: '1',
      routeName: buildLocalizedString('route'),
    });

    expect(sortedDeviations[1]).toEqual({
      label: 'A',
      lineId: '1',
      direction: RouteDirectionEnum.Inbound,
      variant: 3,
      routeId: '1',
      routeName: buildLocalizedString('route'),
    });
  });

  test('should prioritize by variants when label and direction are the same', () => {
    const data: VehicleScheduleFrameInfo[] = [
      {
        label: 'A',
        lineId: '1',
        direction: RouteDirectionEnum.Inbound,
        variant: 3,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
      {
        label: 'A',
        lineId: '1',
        direction: RouteDirectionEnum.Outbound,
        variant: 1,
        routeId: '1',
        routeName: buildLocalizedString('route'),
      },
    ];

    const sortedDeviations = result.current.sortDeviations(data);

    expect(sortedDeviations[0]).toEqual({
      label: 'A',
      lineId: '1',
      direction: RouteDirectionEnum.Outbound,
      variant: 1,
      routeId: '1',
      routeName: buildLocalizedString('route'),
    });

    expect(sortedDeviations[1]).toEqual({
      label: 'A',
      lineId: '1',
      direction: RouteDirectionEnum.Inbound,
      variant: 3,
      routeId: '1',
      routeName: buildLocalizedString('route'),
    });
  });
});
