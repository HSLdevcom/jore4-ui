import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import { useCallback } from 'react';
import { RouteDirectionEnum } from '../../generated/graphql';
import { RouteDirection } from '../../types/RouteDirection';
import { VehicleScheduleVehicleScheduleFrameWithRoutes } from './useVehicleScheduleFrameWithRouteLabelAndLineId';

export type VehicleScheduleFrameInfo = {
  label: string;
  lineId: string;
  direction: RouteDirectionEnum;
  variant: number | undefined | null;
  routeId: string;
  routeName: LocalizedString;
};

export const useVehicleScheduleFramesToVehicleScheduleFrameInfo = () => {
  const vehicleScheduleFramesToVehicleScheduleFrameInfo = useCallback(
    (
      vehicleScheduleFrames: VehicleScheduleVehicleScheduleFrameWithRoutes[],
    ): VehicleScheduleFrameInfo[] => {
      if (isEmpty(vehicleScheduleFrames)) {
        return [];
      }
      const items = vehicleScheduleFrames.flatMap((item) =>
        item.vehicle_services
          .map((service) =>
            service.journey_patterns_in_vehicle_service.map((journey) => {
              const journeyPatternRoute =
                journey.journey_pattern_instance?.journey_pattern_route;
              if (!journeyPatternRoute) {
                return undefined;
              }
              return {
                label: journeyPatternRoute.label,
                lineId: journeyPatternRoute.route_line.line_id,
                direction: journeyPatternRoute.direction,
                variant: journeyPatternRoute.variant,
                routeName: journeyPatternRoute.name_i18n,
                routeId: journeyPatternRoute.route_id,
              };
            }),
          )
          .flat(),
      );

      return compact(items)
        .filter((item) => item.label !== undefined && item.lineId !== undefined)
        .map((item) => ({
          label: item.label,
          lineId: item.lineId as string,
          direction: item.direction as RouteDirection,
          variant: item.variant,
          routeName: item.routeName,
          routeId: item.routeId,
        }));
    },
    [],
  );

  return {
    vehicleScheduleFramesToVehicleScheduleFrameInfo,
  };
};
