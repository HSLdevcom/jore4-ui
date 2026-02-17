import { gql, useQuery } from '@apollo/client';
import type { Point } from 'geojson';
import { useMemo } from 'react';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { JoreStopRegistryTransportModeType } from '../../../types/stop-registry';

const QUERY_NEARBY_TRANSPORT_MODES = gql`
  query QueryNearbyTransportModes($point: geography!, $maxDistance: Float!) {
    reusable_components_vehicle_submode(
      distinct_on: [belonging_to_vehicle_mode]
      where: {
        vehicle_submode_on_infrastructure_links: {
          infrastructure_link: {
            shape: { _st_d_within: { distance: $maxDistance, from: $point } }
          }
        }
      }
    ) {
      belonging_to_vehicle_mode
    }
  }
`;

const VEHICLE_MODE_TO_TRANSPORT_MODE_MAP: Record<
  ReusableComponentsVehicleModeEnum,
  JoreStopRegistryTransportModeType | null
> = {
  [ReusableComponentsVehicleModeEnum.Bus]:
    JoreStopRegistryTransportModeType.Bus,
  [ReusableComponentsVehicleModeEnum.Ferry]:
    JoreStopRegistryTransportModeType.Water,
  [ReusableComponentsVehicleModeEnum.Metro]:
    JoreStopRegistryTransportModeType.Metro,
  [ReusableComponentsVehicleModeEnum.Train]:
    JoreStopRegistryTransportModeType.Rail,
  [ReusableComponentsVehicleModeEnum.Tram]:
    JoreStopRegistryTransportModeType.Tram,
};

type QueryNearbyTransportModesResponse = {
  reusable_components_vehicle_submode: Array<{
    belonging_to_vehicle_mode: ReusableComponentsVehicleModeEnum;
  }>;
};

export const useNearbyTransportModes = (
  point: Point | null,
  enabled = true,
) => {
  const shouldQuery = Boolean(point && enabled);

  // For geography type, _st_d_within expects distance in METERS, not degrees
  const maxDistanceInMeters = 40;

  const { data, loading } = useQuery<QueryNearbyTransportModesResponse>(
    QUERY_NEARBY_TRANSPORT_MODES,
    {
      variables: {
        point,
        maxDistance: maxDistanceInMeters,
      },
      skip: !shouldQuery,
    },
  );

  const availableTransportModes = useMemo(() => {
    // If query was skipped, return undefined to signal "not queried"
    if (!shouldQuery) {
      return undefined;
    }

    // If still loading, return undefined
    if (loading) {
      return undefined;
    }

    // If query completed but no data, return empty array
    if (!data?.reusable_components_vehicle_submode) {
      return [];
    }

    const vehicleModes = new Set(
      data.reusable_components_vehicle_submode.map(
        (submode) => submode.belonging_to_vehicle_mode,
      ),
    );

    // Convert vehicle modes to transport modes
    const transportModes = Array.from(vehicleModes)
      .map((mode) => VEHICLE_MODE_TO_TRANSPORT_MODE_MAP[mode])
      .filter(
        (mode): mode is JoreStopRegistryTransportModeType => mode !== null,
      );

    return Array.from(new Set(transportModes)).sort();
  }, [data, loading, shouldQuery]);

  return {
    availableTransportModes,
    loading,
  };
};
