import { gql, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import {
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkInfrastructureLink,
  QueryClosestLinkDocument,
  QueryClosestLinkQuery,
  QueryClosestLinkQueryVariables,
  QueryPointDirectionOnLinkDocument,
  QueryPointDirectionOnLinkQuery,
  QueryPointDirectionOnLinkQueryVariables,
  ReusableComponentsVehicleModeEnum,
  ReusableComponentsVehicleSubmodeEnum,
} from '../../../../generated/graphql';
import {
  DirectionNotResolvedError,
  IncompatibleDirectionsError,
  LinkNotResolvedError,
  illegalOptionalCast,
} from '../../../../utils';

const GQL_QUERY_CLOSEST_LINK = gql`
  query QueryClosestLink($point: geography!, $filter_vehicle_submode: String) {
    infrastructure_network_resolve_point_to_closest_link(
      args: { geog: $point, filter_vehicle_submode: $filter_vehicle_submode }
    ) {
      ...InfrastructureLinkAllFields
    }
  }
`;

const GQL_QUERY_POINT_DIRECTION = gql`
  query QueryPointDirectionOnLink(
    $point_of_interest: geography
    $infrastructure_link_uuid: uuid
    $point_max_distance_in_meters: float8
  ) {
    infrastructure_network_find_point_direction_on_link(
      args: {
        point_of_interest: $point_of_interest
        infrastructure_link_uuid: $infrastructure_link_uuid
        point_max_distance_in_meters: $point_max_distance_in_meters
      }
    ) {
      value
    }
  }
`;

const vehicleModeToSubmode: Record<
  ReusableComponentsVehicleModeEnum,
  ReusableComponentsVehicleSubmodeEnum
> = {
  [ReusableComponentsVehicleModeEnum.Bus]:
    ReusableComponentsVehicleSubmodeEnum.GenericBus,
  [ReusableComponentsVehicleModeEnum.Tram]:
    ReusableComponentsVehicleSubmodeEnum.GenericTram,
  [ReusableComponentsVehicleModeEnum.Metro]:
    ReusableComponentsVehicleSubmodeEnum.GenericMetro,
  [ReusableComponentsVehicleModeEnum.Train]:
    ReusableComponentsVehicleSubmodeEnum.GenericTrain,
  [ReusableComponentsVehicleModeEnum.Ferry]:
    ReusableComponentsVehicleSubmodeEnum.GenericFerry,
};

// based on internal_service_pattern.check_scheduled_stop_point_infrastructure_link_direction()
function areDirectionsCompatible(
  stopDirection: InfrastructureNetworkDirectionEnum,
  linkDirection: InfrastructureNetworkDirectionEnum,
) {
  return !(
    (stopDirection === InfrastructureNetworkDirectionEnum.Forward &&
      linkDirection === InfrastructureNetworkDirectionEnum.Backward) ||
    (stopDirection === InfrastructureNetworkDirectionEnum.Backward &&
      linkDirection === InfrastructureNetworkDirectionEnum.Forward) ||
    (stopDirection === InfrastructureNetworkDirectionEnum.Bidirectional &&
      linkDirection !== InfrastructureNetworkDirectionEnum.Bidirectional)
  );
}

type Params = {
  readonly stopLocation: GeoJSON.Point;
  readonly vehicleMode: ReusableComponentsVehicleModeEnum;
  readonly maxSearchDistance?: number;
};

export function useGetStopLinkAndDirection() {
  const apollo = useApolloClient();

  return useCallback(
    async ({ stopLocation, vehicleMode, maxSearchDistance = 50 }: Params) => {
      // fetch the closest link to the stop location
      const closestLinkResult = await apollo.query<
        QueryClosestLinkQuery,
        QueryClosestLinkQueryVariables
      >({
        query: QueryClosestLinkDocument,
        variables: {
          point: stopLocation,
          filter_vehicle_submode: vehicleModeToSubmode[vehicleMode],
        },
      });
      const closestLink =
        illegalOptionalCast<InfrastructureNetworkInfrastructureLink>(
          closestLinkResult.data.infrastructure_network_resolve_point_to_closest_link.at(
            0,
          ),
        );

      if (!closestLink) {
        throw new LinkNotResolvedError(
          closestLinkResult.error,
          `Could not resolve closest link to point ${stopLocation}`,
        );
      }

      // fetch the direction for the link
      const stopDirectionResult = await apollo.query<
        QueryPointDirectionOnLinkQuery,
        QueryPointDirectionOnLinkQueryVariables
      >({
        query: QueryPointDirectionOnLinkDocument,
        variables: {
          point_of_interest: stopLocation,
          infrastructure_link_uuid: closestLink.infrastructure_link_id,
          point_max_distance_in_meters: maxSearchDistance,
        },
      });
      const direction =
        stopDirectionResult.data.infrastructure_network_find_point_direction_on_link.at(
          0,
        )?.value;

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
    },
    [apollo],
  );
}
