import { useMemo } from 'react';
import { PagingInfo } from '../../../../../types';
import { buildSearchStopsGqlQueryVariables } from '../../by-stop/filtersToQueryVariables';
import { PgIdType, SortingInfo, defaultFilters } from '../../types';
import { useStopSearchResults } from '../../utils/useStopSearchResults';

export function useStopSearchByStopPlacesResults(
  stopPlaceIds: ReadonlyArray<PgIdType>,
  sortingInfo: SortingInfo,
  pagingInfo: PagingInfo,
) {
  const where = useMemo(
    () =>
      buildSearchStopsGqlQueryVariables({
        ...defaultFilters,
        stopPlaces: stopPlaceIds.slice(),
      }),
    [stopPlaceIds],
  );

  return useStopSearchResults({
    where,
    skip: stopPlaceIds.length === 0,
    sortingInfo,
    pagingInfo,
  });
}
