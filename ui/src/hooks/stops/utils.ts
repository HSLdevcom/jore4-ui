import { GeoJSON } from 'geojson';
import uniqBy from 'lodash/uniqBy';
import { DateTime } from 'luxon';
import { StopDetails } from '../../components/map/useMapData';
import {
  JourneyPatternJourneyPattern,
  ReusableComponentsVehicleModeEnum,
} from '../../generated/graphql';
import { StopWithLocation } from '../../graphql';

// gets the unique list of parent routes for the input journey patterns
export const getRoutesOfJourneyPatterns = (
  journeyPatterns: JourneyPatternJourneyPattern[],
) => {
  const allRoutes = journeyPatterns
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((item) => item.journey_pattern_route!);

  // in the future, multiple journey patterns may have the same route,
  // so let's make sure we only return unique results
  return uniqBy(allRoutes, (route) => route.route_id);
};
export type FilterableStopType = Readonly<StopDetails>;

export class FilterableStop<T extends FilterableStopType> {
  readonly stop: T;

  readonly validity_start: DateTime | undefined;

  readonly validity_end: DateTime | undefined;

  readonly priority: number;

  readonly label: string;

  readonly measured_location: GeoJSON.Point;

  readonly scheduled_stop_point_id: string;

  readonly vehicle_mode_on_scheduled_stop_point: Array<{
    vehicle_mode: ReusableComponentsVehicleModeEnum;
  }>;

  readonly closest_point_on_infrastructure_link: GeoJSON.Point | undefined;

  constructor(entity: T) {
    this.stop = entity as T;

    if (!FilterableStop.isStopDetails(this.stop)) {
      throw new Error(
        `Trying to generate new FilterableStop with invalid entity\n${entity}`,
      );
    } else {
      this.asStopWithLocation = () => {
        return entity.stopPoint as StopWithLocation;
      };

      this.validity_start =
        entity?.scheduled_stop_point?.validity_start ?? undefined;
      this.validity_end =
        entity?.scheduled_stop_point?.validity_end ?? undefined;

      this.priority = entity?.stopPoint?.priority ?? -1;
      this.label = entity?.stopPoint?.label ?? '';

      this.measured_location = entity.stopPoint?.measured_location;

      this.scheduled_stop_point_id = entity?.stopPoint?.scheduled_stop_point_id;

      this.vehicle_mode_on_scheduled_stop_point =
        entity?.stopPoint?.vehicle_mode_on_scheduled_stop_point;

      this.closest_point_on_infrastructure_link =
        entity.stopPoint?.closest_point_on_infrastructure_link ?? undefined;
    }
  }

  asStopWithLocation: () => StopWithLocation;

  private static isStopDetails = (entity: StopDetails): entity is StopDetails =>
    'stopPoint' in entity && 'stopPlace' in entity && !!entity.stopPlace;
}
