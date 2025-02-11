/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import {
  GeographyComparisonExp,
  GeometryComparisonExp,
  GetQuayStopsByLocationQueryResult,
  GetStopPlaceStopAreasByLocationQueryResult,
  InputMaybe,
  useGetQuayStopsByLocationLazyQuery,
  useGetStopPlaceStopAreasByLocationLazyQuery,
} from '../../generated/graphql';

interface QuaysByStopAreasIds {
  _in: bigint[]; // TypeScript does not support `bigint!` in GraphQL, so use `bigint[]`
}

interface Location {
  id: number;
  centroid: {
    type: 'Point';
    crs: {
      type: 'name';
      properties: {
        name: string;
      };
    };
    coordinates: number[];
  };
}

export type MapItem = {
  id: number;
  netexid_id: string;
  centroid?: Location;
};

export type MapData = {
  stopAreas: MapItem[];
  stops: MapItem[];
  refetch: () => void;
  loading: boolean;
  previousData?: MapData
};

// TODO: Move to stopAreas.
const GQL_QUERY_GET_STOP_PLACE_STOP_AREAS_BY_LOCATION = gql`
  query GetStopPlaceStopAreasByLocation(
    $measured_location_filter: geometry_comparison_exp
  ) {
    stops_database {
      stops_database_stop_place_newest_version(
        where: {
          centroid: $measured_location_filter
          netex_id: { _is_null: false }
        }
      ) {
        id
        netex_id
        centroid
      }
    }
  }
  fragment stop_place_stop_area_minimal on stops_database_group_of_stop_places {
    id
    netex_id
    centroid
  }
`;

// TODO: Move to servicePattern/quays.
const QUERY_GET_QUAY_STOPS_BY_STOP_AREA_IDS = gql`
  query GetQuayStopsByLocation(
    $measured_location_filter: geometry_comparison_exp
    $stop_area_ids: [bigint!]
  ) {
    stops_database {
      stops_database_quay_newest_version(
        where: { stop_place_id: { _in: $stop_area_ids } }
      ) {
        id
        stop_place_id
        netex_id
      }
    }
  }
`;

export const useMapData = (geometryComparison: GeographyComparisonExp): MapData => {
  const [ready, setReady] = useState(false);
  const [getPlaceStopAreasByLocationQuery] =
    useGetStopPlaceStopAreasByLocationLazyQuery();

  const [getQuayStopsByLocationLazyQuery] =
    useGetQuayStopsByLocationLazyQuery();

  const [stopAreasResult, setStopAreaResults] =
    useState<GetStopPlaceStopAreasByLocationQueryResult | null>(null);

  const [stopsResult, setStopsResult] =
    useState<GetQuayStopsByLocationQueryResult | null>(null);

  const [mapData, setMapData] = useState<Partial<MapData> | null>();

  useEffect(() => {
    if (geometryComparison) {
      getPlaceStopAreasByLocationQuery({
        variables: { measured_location_filter: geometryComparison as InputMaybe<GeometryComparisonExp> },
      }).then((result) => setStopAreaResults(result));
    }
  }, [geometryComparison, getPlaceStopAreasByLocationQuery]);

  useEffect(() => {
    if (!stopAreasResult?.loading && !ready) {
      const stopAreas = (stopAreasResult?.data?.stops_database
        ?.stops_database_stop_place_newest_version ?? []) as MapItem[];
      setMapData({ ...mapData, stopAreas });
    }
  }, [mapData, ready, stopAreasResult]);

  useEffect(() => {
    if (
      !ready &&
      mapData &&
      mapData.stopAreas &&
      mapData.stopAreas.length > 0
    ) {
      getQuayStopsByLocationLazyQuery({
        variables: {
          measured_location_filter: geometryComparison as InputMaybe<GeometryComparisonExp> ,
          stop_area_ids: mapData.stopAreas.map((sa) => sa.id) ?? [],
        },
      }).then((q) => {
        setStopsResult(q);
      });
    }
  }, [geometryComparison, getQuayStopsByLocationLazyQuery, mapData, ready]);

  useEffect(() => {
    if (!ready && stopsResult && !stopsResult.loading) {
      const stops = (stopsResult?.data?.stops_database
        ?.stops_database_quay_newest_version ?? []) as MapItem[];
      setMapData({ ...mapData, stops });
      setReady(true);
    }
  }, [mapData, ready, stopsResult]);

  const refetch = useCallback(() => {
    setMapData({...mapData, previousData: mapData as MapData})
    setReady(false);
    stopAreasResult?.refetch();
  }, [mapData, stopAreasResult]);

  return {
    stopAreas: mapData?.stopAreas ?? [],
    stops: mapData?.stops ?? [],
    refetch,
    loading: !ready,
  };
};
