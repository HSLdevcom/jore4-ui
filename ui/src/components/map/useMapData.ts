import flatten from 'lodash/flatten';
import { useCallback, useEffect, useState } from 'react';
import {
  GetStopPlacesByBoundingBoxesQueryResult,
  QuayDetailsFragment,
  ScheduledStopPointAllFieldsFragment,
  StopPlaceDetailsFragment,
  useGetStopPlacesByBoundingBoxesQuery,
} from '../../generated/graphql';
import { StopPlaceBoundingBox } from '../../graphql/stopPlaceBoundingBox';
import { Viewport } from '../../redux/types';

export type StopDetails = Readonly<
  QuayDetailsFragment & {
    readonly stopPlace: StopPlaceDetailsFragment;
    readonly stopPoint: ScheduledStopPointAllFieldsFragment;
  }
>;

export type MapData = Readonly<{
  readonly stops: ReadonlyArray<StopDetails>;
  readonly refetch: () => void;
  readonly loading: boolean;
  readonly previousData?: MapData;
}>;

const initialMapData = {
  loading: false,
  refetch: () => {
    // Noop
  },
  stops: [],
};

export const useMapData = (viewPort: Viewport): MapData => {
  const [ready, setReady] = useState(false);

  const [stopPlaceBbResults] =
    useState<GetStopPlacesByBoundingBoxesQueryResult | null>(
      useGetStopPlacesByBoundingBoxesQuery({
        variables: {
          latMax: viewPort.latitude + viewPort.radius,
          lonMax: viewPort.longitude + viewPort.radius,
          latMin: viewPort.latitude - viewPort.radius,
          lonMin: viewPort.longitude - viewPort.radius,
        },
      }),
    );

  const [mapData, setMapData] = useState<MapData>(initialMapData);

  useEffect(() => {
    if (!stopPlaceBbResults?.loading && !ready) {
      const boundingBoxes =
        stopPlaceBbResults?.data?.stop_registry?.stopPlace?.map(
          (bb) => bb as StopPlaceBoundingBox,
        );
      const stops: ReadonlyArray<StopDetails> = flatten(
        boundingBoxes?.map((stopPlace) =>
          stopPlace.quays.map(
            (quay) =>
              ({
                ...quay,
                stopPoint:
                  quay?.scheduled_stop_point as ScheduledStopPointAllFieldsFragment,
                stopPlace,
              }) as StopDetails,
          ),
        ),
      );

      setMapData((prevState) => ({
        ...prevState,
        stops,
      }));

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
