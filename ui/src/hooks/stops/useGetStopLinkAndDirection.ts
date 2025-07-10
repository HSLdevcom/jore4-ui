import {
  InfrastructureNetworkDirectionEnum,
  useQueryClosestLinkLazyQuery,
  useQueryPointDirectionOnLinkLazyQuery,
} from '../../generated/graphql';
import {
  mapClosestLinkResult,
  mapGetPointDirectionOnLinkResult,
} from '../../graphql';
import {
  DirectionNotResolvedError,
  IncompatibleDirectionsError,
  LinkNotResolvedError,
} from '../../utils';

type Params = {
  readonly stopLocation: GeoJSON.Point;
  readonly maxSearchDistance?: number;
};

export const useGetStopLinkAndDirection = () => {
  const [fetchClosestLink] = useQueryClosestLinkLazyQuery();
  const [fetchStopDirection] = useQueryPointDirectionOnLinkLazyQuery();

  // based on internal_service_pattern.check_scheduled_stop_point_infrastructure_link_direction()
  const areDirectionsCompatible = (
    stopDirection: InfrastructureNetworkDirectionEnum,
    linkDirection: InfrastructureNetworkDirectionEnum,
  ) => {
    return !(
      (stopDirection === InfrastructureNetworkDirectionEnum.Forward &&
        linkDirection === InfrastructureNetworkDirectionEnum.Backward) ||
      (stopDirection === InfrastructureNetworkDirectionEnum.Backward &&
        linkDirection === InfrastructureNetworkDirectionEnum.Forward) ||
      (stopDirection === InfrastructureNetworkDirectionEnum.Bidirectional &&
        linkDirection !== InfrastructureNetworkDirectionEnum.Bidirectional)
    );
  };

  const getStopLinkAndDirection = async ({
    stopLocation,
    maxSearchDistance = 50,
  }: Params) => {
    // fetch the closest link to the stop location
    const closestLinkResult = await fetchClosestLink({
      variables: {
        point: stopLocation,
      },
    });
    const closestLink = mapClosestLinkResult(closestLinkResult);

    if (!closestLink) {
      throw new LinkNotResolvedError(
        closestLinkResult.error,
        `Could not resolve closest link to point ${stopLocation}`,
      );
    }

    // fetch the direction for the link
    const stopDirectionResult = await fetchStopDirection({
      variables: {
        point_of_interest: stopLocation,
        infrastructure_link_uuid: closestLink.infrastructure_link_id,
        point_max_distance_in_meters: maxSearchDistance,
      },
    });
    const direction = mapGetPointDirectionOnLinkResult(stopDirectionResult);

    if (!direction) {
      throw new DirectionNotResolvedError(
        stopDirectionResult.error,
        `Could not resolve direction for link ${closestLink.infrastructure_link_id}`,
      );
    }

    if (!areDirectionsCompatible(direction, closestLink.direction)) {
      throw new IncompatibleDirectionsError(
        `Stop direction '${direction}' is not compatible with link direction '${closestLink.direction}'`,
      );
    }

    return {
      closestLink,
      direction,
    };
  };

  return [getStopLinkAndDirection];
};
