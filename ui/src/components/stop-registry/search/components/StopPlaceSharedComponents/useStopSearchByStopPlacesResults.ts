import { StopsDatabaseQuayNewestVersionBoolExp } from '../../../../../generated/graphql';
import { PagingInfo } from '../../../../../types';
import { SortingInfo } from '../../types';
import { useStopSearchResults } from '../../utils/useStopSearchResults';
import { FindStopPlaceInfo } from './useFindStopPlaces';

function stopPlacesToStopSearchWhere(
  stopPlaces: ReadonlyArray<FindStopPlaceInfo>,
): StopsDatabaseQuayNewestVersionBoolExp {
  return {
    _or: [
      { stop_place_id: { _in: stopPlaces.map((place) => place.id) } },
      {
        stopPlaceParent: {
          stop_place_id: { _in: stopPlaces.map((place) => place.id) },
        },
      },
    ],
  };
}

export function useStopSearchByStopPlacesResults(
  stopPlaces: ReadonlyArray<FindStopPlaceInfo>,
  sortingInfo: SortingInfo,
  pagingInfo: PagingInfo,
) {
  return useStopSearchResults({
    where: stopPlacesToStopSearchWhere(stopPlaces),
    skip: stopPlaces.length === 0,
    sortingInfo,
    pagingInfo,
  });
}
