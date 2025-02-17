import flatten from 'lodash/flatten';
import { useCallback, useEffect, useState } from 'react';
import {
  GetStopPlacesByBoundingBoxesQueryResult,
  QuayDetailsFragment,
  ScheduledStopPointAllFieldsFragment,
  StopPlaceDetailsFragment,
  useGetStopPlacesByBoundingBoxesLazyQuery,
} from '../../generated/graphql';
import { StopPlaceBoundingBox } from '../../graphql/stopPlaceBoundingBox';
import { Viewport } from '../../redux/types';

export type MapData = {
  stopPlaces: StopPlaceDetailsFragment[];
  stopPoints: ScheduledStopPointAllFieldsFragment[];
  quays: QuayDetailsFragment[];
  refetch: () => void;
  loading: boolean;
  previousData?: MapData;
};

const initialMapData = {
  loading: false,
  quays: [],
  refetch: () => {
    // Noop
  },
  stopPlaces: [],
  stopPoints: [],
};

export const useMapData = (viewPort: Viewport): MapData => {
  const [ready, setReady] = useState(false);

  const [getStopPlacesByBBoxes] = useGetStopPlacesByBoundingBoxesLazyQuery();

  const [stopPlaceBbResults, setStopPlaceBbResults] =
    useState<GetStopPlacesByBoundingBoxesQueryResult | null>(null);

  const [mapData, setMapData] = useState<MapData>(initialMapData);

  useEffect(() => {
    if (viewPort) {
      setReady(false);
      getStopPlacesByBBoxes({
        variables: {
          latMax: viewPort.latitude + viewPort.radius,
          lonMax: viewPort.longitude + viewPort.radius,
          latMin: viewPort.latitude - viewPort.radius,
          lonMin: viewPort.longitude - viewPort.radius,
        },
      }).then((result) => setStopPlaceBbResults(result));
    }
  }, [
    getStopPlacesByBBoxes,
    viewPort.radius,
    viewPort.longitude,
    viewPort.latitude,
    viewPort,
  ]);

  useEffect(() => {
    if (!stopPlaceBbResults?.loading && !ready) {
      const boundingBoxes =
        stopPlaceBbResults?.data?.stop_registry?.stopPlace?.map(
          (bb) => bb as StopPlaceBoundingBox,
        );

      const stopPoints = boundingBoxes?.map((bb) => bb.stopPoint) ?? [];

      const quays = flatten(boundingBoxes?.map((bb) => bb.quays));

      const stopPlaces = boundingBoxes?.map((bb) => bb as StopPlaceDetailsFragment) ?? [];

      setMapData({ ...mapData, stopPoints, quays, stopPlaces });
      setReady(true);
    }
  }, [mapData, ready, stopPlaceBbResults]);

  const refetch = useCallback(() => {
    setReady(false);
    setMapData({ ...mapData, previousData: mapData as MapData });
    stopPlaceBbResults?.refetch();
  }, [mapData, stopPlaceBbResults]);

  return {
    ...mapData,
    refetch,
    loading: !ready,
  };
};
