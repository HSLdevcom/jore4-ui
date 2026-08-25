import compact from 'lodash/compact';
import { DateTime, Duration } from 'luxon';
import { RouteDirectionEnum } from '../../../../../../generated/graphql';
import { RouteDirection } from '../../../../../../types/RouteDirection';
import { VehicleScheduleVehicleScheduleFrameWithJourneys } from '../../../Common/Utils';

export type VehicleJourneyInfo = {
  readonly vehicleJourneyId: UUID;
  readonly startTime: Duration;
  readonly contractNumber: string;
  readonly validityStart: DateTime;
  readonly validityEnd: DateTime;
  readonly dayTypeLabel: string;
  readonly dayTypeName: LocalizedString;
  readonly uniqueLabel: string;
  readonly lineId: UUID;
  readonly direction: RouteDirectionEnum;
  readonly routeName: LocalizedString;
  readonly routeId: UUID;
};

export function createVehicleJourneyInfo(
  vehicleScheduleFrame: VehicleScheduleVehicleScheduleFrameWithJourneys,
): VehicleJourneyInfo[] {
  const mapped = vehicleScheduleFrame.vehicle_services.flatMap((service) =>
    service.blocks.flatMap((block) =>
      block.vehicle_journeys.flatMap<VehicleJourneyInfo | null>((journey) => {
        const journeyPatternRoute =
          journey.journey_pattern_ref.journey_pattern_instance
            ?.journey_pattern_route;

        if (!journeyPatternRoute) {
          return null;
        }

        return {
          vehicleJourneyId: journey.vehicle_journey_id,
          startTime: journey.start_time,
          contractNumber: journey.contract_number,
          validityStart: vehicleScheduleFrame.validity_start,
          validityEnd: vehicleScheduleFrame.validity_end,
          dayTypeLabel: service.day_type.label,
          dayTypeName: service.day_type.name_i18n as LocalizedString, // TODO: why isn't this already a LocalizedString? Some other similar properties are.,
          uniqueLabel: journeyPatternRoute.unique_label,
          lineId: journeyPatternRoute.route_line.line_id,
          direction: journeyPatternRoute.direction as RouteDirection,
          routeName: journeyPatternRoute.name_i18n,
          routeId: journeyPatternRoute.route_id,
        };
      }),
    ),
  );

  return compact(mapped);
}
