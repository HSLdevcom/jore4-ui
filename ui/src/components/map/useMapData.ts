import { QueryResult } from '@apollo/client';
import flatten from 'lodash/flatten';
import { useCallback, useEffect, useState } from 'react';
import {
  GetStopPlacesByBoundingBoxesQuery,
  GetStopPlacesByBoundingBoxesQueryVariables,
  QuayDetailsFragment,
  ScheduledStopPointAllFieldsFragment,
  StopPlaceDetailsFragment,
  useGetStopPlacesByBoundingBoxesLazyQuery,
} from '../../generated/graphql';
import { StopPlaceBoundingBox } from '../../graphql/stopPlaceBoundingBox';

export type StopDetails = Readonly<
  QuayDetailsFragment & {
    readonly stopPlace: StopPlaceDetailsFragment;
    readonly stopPoint: ScheduledStopPointAllFieldsFragment;
  }
>;

export type MapData = Readonly<{
  readonly stops: ReadonlyArray<StopDetails>;
  readonly loading: boolean;
  readonly previousData?: MapData;
  readonly refetch: (stopBounds: StopBounds) => void;
}>;

const initialMapData = {
  loading: false,
  stops: [],
};
export type StopBounds = {
  readonly latMax: number;
  readonly latMin: number;
  readonly lonMax: number;
  readonly lonMin: number;
};

const getMapData = (
  stopPlaceBbResults: QueryResult<
    GetStopPlacesByBoundingBoxesQuery,
    GetStopPlacesByBoundingBoxesQueryVariables
  >,
) => {
  const boundingBoxes = stopPlaceBbResults?.data?.stop_registry?.stopPlace?.map(
    (bb) => bb as StopPlaceBoundingBox,
  );
  const stops: ReadonlyArray<StopDetails> = flatten(
    boundingBoxes?.map((stopPlace) =>
      stopPlace.quays.map(
        (quay) =>
          ({
            ...quay,
            stopPoint:
              stopPlace.scheduled_stop_point as ScheduledStopPointAllFieldsFragment,
            stopPlace,
          }) as StopDetails,
      ),
    ),
  );
  return { stops };
};

export const useMapData = (viewport: StopBounds): MapData => {
  const [bounds, setBounds] = useState<StopBounds>(viewport);

  const [getStopPlacesByBoundingBoxes] =
    useGetStopPlacesByBoundingBoxesLazyQuery();

  const refetch = useCallback((stopBounds: StopBounds) => {
    setBounds(stopBounds);
  }, []);

  const [mapData, setMapData] = useState<MapData>({
    ...initialMapData,
    refetch,
    loading: true,
  });

  useEffect(() => {
    if (
      viewport.latMax !== bounds.latMax ||
      viewport.lonMax !== bounds.lonMax ||
      viewport.latMin !== bounds.latMin ||
      viewport.lonMin !== bounds.lonMin
    ) {
      setBounds(viewport);
    }
  }, [bounds.latMax, bounds.latMin, bounds.lonMax, bounds.lonMin, viewport]);

  useEffect(() => {
    getStopPlacesByBoundingBoxes({
      variables: {
        ...bounds,
      },
    }).then((stopPlaceBbResults) => {
      setMapData({
        ...getMapData(stopPlaceBbResults),
        refetch,
        loading: stopPlaceBbResults.loading,
      });
    });
  }, [refetch, getStopPlacesByBoundingBoxes, bounds]);

  return {
    ...mapData,
    refetch,
  };
};
