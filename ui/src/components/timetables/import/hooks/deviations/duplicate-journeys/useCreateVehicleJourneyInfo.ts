import compact from 'lodash/compact';
import { DateTime, Duration } from 'luxon';
import { useCallback } from 'react';
import { RouteDirectionEnum } from '../../../../../../generated/graphql';
import { RouteDirection } from '../../../../../../types/RouteDirection';
import { VehicleScheduleVehicleScheduleFrameWithJourneys } from '../useVehicleScheduleFrameWithJourneys';

export type VehicleJourneyInfo = {
  vehicleJourneyId: UUID;
  startTime: Duration;
  contractNumber: string;
  validityStart: DateTime;
  validityEnd: DateTime;
  dayTypeLabel: string;
  dayTypeName: LocalizedString;
  uniqueLabel: string;
  lineId: UUID;
  direction: RouteDirectionEnum;
  routeName: LocalizedString;
  routeId: UUID;
};

export const useCreateVehicleJourneyInfo = () => {
  const createVehicleJourneyInfo = useCallback(
    (
      vehicleScheduleFrame: VehicleScheduleVehicleScheduleFrameWithJourneys,
    ): VehicleJourneyInfo[] => {
      const journeys = vehicleScheduleFrame.vehicle_services.flatMap(
        (service) =>
          service.blocks.flatMap((block) =>
            block.vehicle_journeys.flatMap((journey) => {
              const journeyPatternRoute =
                journey.journey_pattern_ref.journey_pattern_instance
                  ?.journey_pattern_route;
              if (!journeyPatternRoute) {
                return undefined;
              }

              return {
                vehicleJourneyId: journey.vehicle_journey_id,
                startTime: journey.start_time,
                contractNumber: journey.contract_number,
                validityStart: vehicleScheduleFrame.validity_start,
                validityEnd: vehicleScheduleFrame.validity_end,
                dayTypeLabel: service.day_type.label,
                dayTypeName: service.day_type.name_i18n,
                uniqueLabel: journeyPatternRoute.unique_label,
                lineId: journeyPatternRoute.route_line.line_id,
                direction: journeyPatternRoute.direction,
                routeName: journeyPatternRoute.name_i18n,
                routeId: journeyPatternRoute.route_id,
              };
            }),
          ),
      );

      const journeyInfos = compact(journeys).map((item) => ({
        vehicleJourneyId: item.vehicleJourneyId,
        startTime: item.startTime,
        contractNumber: item.contractNumber,
        validityStart: item.validityStart,
        validityEnd: item.validityEnd,
        dayTypeLabel: item.dayTypeLabel,
        dayTypeName: item.dayTypeName as LocalizedString, // TODO: why isn't this already a LocalizedString? Some other similar properties are.
        uniqueLabel: item.uniqueLabel,
        lineId: item.lineId as string,
        direction: item.direction as RouteDirection,
        routeName: item.routeName,
        routeId: item.routeId,
      }));

      return journeyInfos;
    },
    [],
  );

  return {
    createVehicleJourneyInfo,
  };
};
