import { gql } from '@apollo/client';
import type { Point } from 'geojson';
import { useMemo } from 'react';
import {
  ReusableComponentsVehicleModeEnum,
  useQueryNearbyTransportModesQuery,
} from '../../../generated/graphql';
import { JoreStopRegistryTransportModeType } from '../../../types/stop-registry';

const GQL_QUERY_NEARBY_TRANSPORT_MODES = gql`
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

export const useNearbyTransportModes = (
  point: Point | null,
  enabled = true,
) => {
  const shouldQuery = point !== null && enabled;

  const maxDistanceInMeters = 40;

  const { data, loading } = useQueryNearbyTransportModesQuery({
    ...(shouldQuery
      ? {
          variables: {
            point,
            maxDistance: maxDistanceInMeters,
          },
        }
      : { skip: true }),
  });

  const rawVehicleSubmodes =
    data?.reusable_components_vehicle_submode;

  const availableTransportModes = useMemo(() => {
    // If query has no data yet, return empty array
    if (!rawVehicleSubmodes) {
      return [];
    }

    const vehicleModes = rawVehicleSubmodes.map(
      (submode) => submode.belonging_to_vehicle_mode,
    );

    // Convert vehicle modes to transport modes
    const transportModes = vehicleModes
      .map((mode) => VEHICLE_MODE_TO_TRANSPORT_MODE_MAP[mode])
      .filter(
        (mode): mode is JoreStopRegistryTransportModeType => mode !== null,
      );

    return transportModes.sort();
  }, [rawVehicleSubmodes]);

  return {
    availableTransportModes,
    loading,
  };
};
