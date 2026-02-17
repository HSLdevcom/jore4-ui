import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { JoreStopRegistryTransportModeType } from '../../../types/stop-registry';

const QUERY_NEARBY_TRANSPORT_MODES = gql`
  query QueryNearbyTransportModes($point: geography!, $maxDistance: Float!) {
    infrastructure_network_infrastructure_link(
      where: {
        shape: { _st_d_within: { distance: $maxDistance, from: $point } }
      }
      limit: 50
    ) {
      infrastructure_link_id
      vehicle_submode_on_infrastructure_link {
        vehicle_submode
        vehicleSubmodeByVehicleSubmode {
          belonging_to_vehicle_mode
        }
      }
    }
  }
`;

const VEHICLE_MODE_TO_TRANSPORT_MODE_MAP: Record<
  ReusableComponentsVehicleModeEnum,
  JoreStopRegistryTransportModeType | null
> = {
  [ReusableComponentsVehicleModeEnum.Bus]: JoreStopRegistryTransportModeType.Bus,
  [ReusableComponentsVehicleModeEnum.Ferry]: JoreStopRegistryTransportModeType.Water,
  [ReusableComponentsVehicleModeEnum.Metro]: JoreStopRegistryTransportModeType.Metro,
  [ReusableComponentsVehicleModeEnum.Train]: JoreStopRegistryTransportModeType.Rail,
  [ReusableComponentsVehicleModeEnum.Tram]: JoreStopRegistryTransportModeType.Tram,
};

type InfrastructureLink = {
  infrastructure_link_id: string;
  vehicle_submode_on_infrastructure_link: Array<{
    vehicle_submode: string;
    vehicleSubmodeByVehicleSubmode: {
      belonging_to_vehicle_mode: ReusableComponentsVehicleModeEnum;
    };
  }>;
};

type QueryNearbyTransportModesResponse = {
  infrastructure_network_infrastructure_link: InfrastructureLink[];
};

export const useNearbyTransportModes = (
  latitude?: number,
  longitude?: number,
  enabled = true,
) => {

  const point = useMemo(() => {
    if (latitude === undefined || longitude === undefined) {
      return undefined;
    }
    // Use GeoJSON.Point format (same as QueryClosestLink does)
    const geoJsonPoint: GeoJSON.Point = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
    return geoJsonPoint;
  }, [latitude, longitude]);

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
    if (!data?.infrastructure_network_infrastructure_link) {
      return [];
    }

    // Extract all vehicle modes from nearby infrastructure links
    const vehicleModes = new Set<ReusableComponentsVehicleModeEnum>();

    data.infrastructure_network_infrastructure_link.forEach((link) => {
      link.vehicle_submode_on_infrastructure_link.forEach((vehicleSubmode) => {
        const vehicleMode =
          vehicleSubmode.vehicleSubmodeByVehicleSubmode
            .belonging_to_vehicle_mode;
        vehicleModes.add(vehicleMode);
      });
    });

    // Convert vehicle modes to transport modes
    const transportModes = Array.from(vehicleModes)
      .map((mode) => VEHICLE_MODE_TO_TRANSPORT_MODE_MAP[mode])
      .filter((mode): mode is JoreStopRegistryTransportModeType => mode !== null);

    return Array.from(new Set(transportModes)).sort();
  }, [data, loading, shouldQuery]);

  return {
    availableTransportModes,
    loading,
  };
};
