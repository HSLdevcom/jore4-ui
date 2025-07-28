import { gql } from '@apollo/client';
import uniqWith from 'lodash/uniqWith';
import { useMemo } from 'react';
import { useGetInfoSpotSizesQuery } from '../../../../../../generated/graphql';
import { PosterSize, SizedDbItem } from '../types';

const GQL_GET_INFO_SPOT_SIZES = gql`
  query GetInfoSpotSizes {
    stopsDb: stops_database {
      infoSpotSizes: stops_database_info_spot(
        distinct_on: [width, height]
        order_by: [{ width: desc }, { height: desc }]
        where: { width: { _is_null: false }, height: { _is_null: false } }
      ) {
        width
        height
      }

      infoSpotPosterSizes: stops_database_info_spot_poster(
        distinct_on: [width, height]
        order_by: [{ width: desc }, { height: desc }]
        where: { width: { _is_null: false }, height: { _is_null: false } }
      ) {
        width
        height
      }
    }
  }
`;

function cleanupSizes(
  rawSizes: ReadonlyArray<SizedDbItem>,
): ReadonlyArray<PosterSize> {
  return rawSizes.map((raw) => {
    if (process.env.NODE_ENV !== 'production') {
      if (raw.width === null || raw.height === null) {
        throw new Error(
          `Expected width and height to be non null! Raw size: ${JSON.stringify(raw)}`,
        );
      }
    }

    // DB query should filter out nulls.
    return { width: raw.width as number, height: raw.height as number };
  });
}

function comparePosterSizes(a: PosterSize, b: PosterSize): number {
  if (a.width < b.width) {
    return -1;
  }

  if (a.width > b.width) {
    return +1;
  }

  if (a.height < b.height) {
    return -1;
  }

  if (a.height > b.height) {
    return +1;
  }

  return 0;
}

export function useGetInfoSpotSizes() {
  const { data, ...rest } = useGetInfoSpotSizesQuery();

  const sizes: ReadonlyArray<PosterSize> = useMemo(() => {
    const infoSpots = cleanupSizes(data?.stopsDb?.infoSpotSizes ?? []);
    const posters = cleanupSizes(data?.stopsDb?.infoSpotPosterSizes ?? []);

    return uniqWith(
      [...infoSpots, ...posters].sort((a, b) => -1 * comparePosterSizes(a, b)),
      (a, b) => a.width === b.width && a.height === b.height,
    );
  }, [data]);

  return { ...rest, sizes };
}
