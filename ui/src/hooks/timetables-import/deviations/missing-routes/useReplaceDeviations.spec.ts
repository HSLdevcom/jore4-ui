import { act, renderHook } from '@testing-library/react';
import { RouteDirectionEnum } from '../../../../generated/graphql';
import { VehicleScheduleVehicleScheduleFrameWithRoutes } from '../useVehicleScheduleFrameWithRouteLabelAndLineId';
import { useReplaceDeviations } from './useReplaceDeviations';
// Make sure I18Next is initialized
import '../../../../i18n';

jest.mock('../../../../utils/toastService', () => ({
  showDangerToastWithError: jest.fn(),
}));
const showDangerToastWithErrorMock = jest.requireMock(
  '../../../../utils/toastService',
).showDangerToastWithError;

const mockFetchReplacedFrames = jest.fn(() =>
  Promise.resolve(['35e94feb-21d0-4418-9c9a-58345066af78']),
);
const mockFetchStagingVehicleFrameIds = jest.fn(() => Promise.resolve([]));

const vsf1: VehicleScheduleVehicleScheduleFrameWithRoutes[] = [
  {
    __typename: 'timetables_vehicle_schedule_vehicle_schedule_frame',
    vehicle_schedule_frame_id: '35e94feb-21d0-4418-9c9a-58345066af78',
    vehicle_services: [
      {
        vehicle_service_id: 'e8a3d1b1-cd6a-41aa-b965-26f78b75c95e',
        journey_patterns_in_vehicle_service: [
          {
            journey_pattern_id: '4b070731-700d-4c4c-8e30-cd177fa80ada',
            journey_pattern_instance: {
              journey_pattern_id: '4b070731-700d-4c4c-8e30-cd177fa80ada',
              journey_pattern_route: {
                route_id: 'c17ebc8e-3922-46b4-9aef-1e59c2ceffc9',
                unique_label: '133',
                direction: RouteDirectionEnum.Outbound,

                name_i18n: {
                  fi_FI: 'Friisilä-Matinkylä (M)-Henttaa',
                },
                route_line: {
                  line_id: '4fdd4b18-8ad0-440b-941c-bebf920b6c63',
                  __typename: 'route_line',
                },
                __typename: 'route_route',
              },
              __typename: 'journey_pattern_journey_pattern',
            },
            __typename:
              'timetables_vehicle_service_journey_patterns_in_vehicle_service',
          },
          {
            journey_pattern_id: '7eb10e90-e6fc-4914-b21a-97b3d538bf86',
            journey_pattern_instance: {
              journey_pattern_id: '7eb10e90-e6fc-4914-b21a-97b3d538bf86',
              journey_pattern_route: {
                route_id: 'f8efd2c4-487d-462d-a97d-984ba99f12aa',
                unique_label: '108N',
                direction: RouteDirectionEnum.Outbound,

                name_i18n: {
                  fi_FI: 'Kamppi-Teekkarikylä-Tapiola(M)-Westendinasema',
                },
                route_line: {
                  line_id: '9d0a1133-8da8-468f-8214-2bdbdeade92a',
                  __typename: 'route_line',
                },
                __typename: 'route_route',
              },
              __typename: 'journey_pattern_journey_pattern',
            },
            __typename:
              'timetables_vehicle_service_journey_patterns_in_vehicle_service',
          },
          {
            journey_pattern_id: 'a32d0747-4716-4d20-99b0-075e8c62cc1a',
            journey_pattern_instance: {
              journey_pattern_id: 'a32d0747-4716-4d20-99b0-075e8c62cc1a',
              journey_pattern_route: {
                route_id: '46ac4353-f968-4575-aa46-dbc2f248967b',
                unique_label: '108N',
                direction: RouteDirectionEnum.Inbound,

                name_i18n: {
                  fi_FI: 'Kamppi-Teekkarikylä-Tapiola(M)-Westendinasema',
                },
                route_line: {
                  line_id: '9d0a1133-8da8-468f-8214-2bdbdeade92a',
                  __typename: 'route_line',
                },
                __typename: 'route_route',
              },
              __typename: 'journey_pattern_journey_pattern',
            },
            __typename:
              'timetables_vehicle_service_journey_patterns_in_vehicle_service',
          },
        ],
        __typename: 'timetables_vehicle_service_vehicle_service',
      },
    ],
  },
];

const vsf2: VehicleScheduleVehicleScheduleFrameWithRoutes[] = [
  {
    vehicle_schedule_frame_id: '77fa8187-9a8e-4ce6-9fe2-5855f438b0e2',
    vehicle_services: [
      {
        vehicle_service_id: 'fb6bc3e2-b63c-47f4-8d79-5ac6e47ea76e',
        journey_patterns_in_vehicle_service: [
          {
            journey_pattern_id: '0d05d12f-cf7b-47f8-961c-edb89b789e1d',
            journey_pattern_instance: {
              journey_pattern_id: '0d05d12f-cf7b-47f8-961c-edb89b789e1d',
              journey_pattern_route: {
                route_id: '0037b7c8-2875-4014-9601-640616398d8e',
                unique_label: '133',
                direction: RouteDirectionEnum.Inbound,

                name_i18n: {
                  fi_FI: 'Friisilä-Matinkylä (M)-Henttaa',
                },
                route_line: {
                  line_id: '4fdd4b18-8ad0-440b-941c-bebf920b6c63',
                  __typename: 'route_line',
                },
                __typename: 'route_route',
              },
              __typename: 'journey_pattern_journey_pattern',
            },
            __typename:
              'timetables_vehicle_service_journey_patterns_in_vehicle_service',
          },
          {
            journey_pattern_id: '4b070731-700d-4c4c-8e30-cd177fa80ada',
            journey_pattern_instance: {
              journey_pattern_id: '4b070731-700d-4c4c-8e30-cd177fa80ada',
              journey_pattern_route: {
                route_id: 'c17ebc8e-3922-46b4-9aef-1e59c2ceffc9',
                unique_label: '133',
                direction: RouteDirectionEnum.Outbound,

                name_i18n: {
                  fi_FI: 'Friisilä-Matinkylä (M)-Henttaa',
                },
                route_line: {
                  line_id: '4fdd4b18-8ad0-440b-941c-bebf920b6c63',
                  __typename: 'route_line',
                },
                __typename: 'route_route',
              },
              __typename: 'journey_pattern_journey_pattern',
            },
            __typename:
              'timetables_vehicle_service_journey_patterns_in_vehicle_service',
          },
        ],
        __typename: 'timetables_vehicle_service_vehicle_service',
      },
    ],
    __typename: 'timetables_vehicle_schedule_vehicle_schedule_frame',
  },
];

describe('replaceDeviations hook', () => {
  it('should return no deviations when there is no staging vehicle frames', async () => {
    const mockFetchVehicleFrames = jest.fn(() => Promise.resolve([]));
    const { result } = renderHook(() =>
      useReplaceDeviations(
        mockFetchReplacedFrames,
        mockFetchVehicleFrames,
        mockFetchStagingVehicleFrameIds,
      ),
    );
    await act(async () => {
      await result.current.fetchRouteDeviations(10);
    });
    expect(result.current.deviations).toEqual([]);
  });

  it('should return deviation', async () => {
    const mockFetchVehicleFrames2 = jest.fn();
    mockFetchVehicleFrames2
      .mockResolvedValueOnce(vsf1)
      .mockResolvedValueOnce(vsf2);

    const { result } = renderHook(() =>
      useReplaceDeviations(
        mockFetchReplacedFrames,
        mockFetchVehicleFrames2,
        mockFetchStagingVehicleFrameIds,
      ),
    );

    await act(async () => {
      await result.current.fetchRouteDeviations(10);
    });

    expect(result.current.deviations).toEqual([
      {
        direction: 'outbound',
        uniqueLabel: '108N',
        lineId: '9d0a1133-8da8-468f-8214-2bdbdeade92a',
        routeId: 'f8efd2c4-487d-462d-a97d-984ba99f12aa',
        routeName: {
          fi_FI: 'Kamppi-Teekkarikylä-Tapiola(M)-Westendinasema',
        },
      },
      {
        direction: 'inbound',
        uniqueLabel: '108N',
        lineId: '9d0a1133-8da8-468f-8214-2bdbdeade92a',
        routeId: '46ac4353-f968-4575-aa46-dbc2f248967b',
        routeName: {
          fi_FI: 'Kamppi-Teekkarikylä-Tapiola(M)-Westendinasema',
        },
      },
    ]);
  });

  it('should call showDangerToastWithError when error is thrown', async () => {
    const mockFetchVehicleFrames = jest.fn(() =>
      Promise.reject(new Error('Some error message')),
    );

    const { result } = renderHook(() =>
      useReplaceDeviations(
        mockFetchReplacedFrames,
        mockFetchVehicleFrames,
        mockFetchStagingVehicleFrameIds,
      ),
    );
    await act(async () => {
      await result.current.fetchRouteDeviations(10);
    });
    expect(showDangerToastWithErrorMock).toHaveBeenCalledWith(
      'Puuttuvien reittien haku epäonnistui',
      new Error('Some error message'),
    );
    expect(result.current.deviations).toEqual([]);
  });
});
