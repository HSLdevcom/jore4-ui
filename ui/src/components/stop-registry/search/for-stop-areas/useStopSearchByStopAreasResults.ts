import { StopsDatabaseStopPlaceNewestVersionBoolExp } from '../../../../generated/graphql';
import { PagingInfo } from '../../../../types';
import { SortingInfo } from '../types';
import { useStopSearchResults } from '../utils/useStopSearchResults';
import { FindStopAreaInfo } from './useFindStopAreas';

function stopAreasToStopSearchWhere(
  stopAreas: ReadonlyArray<FindStopAreaInfo>,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  return {
    group_of_stop_places_members: {
      group_of_stop_places_id: {
        _in: stopAreas.map((area) => area.id),
      },
    },
  };
}

export function useStopSearchByStopAreasResults(
  stopAreas: ReadonlyArray<FindStopAreaInfo>,
  sortingInfo: SortingInfo,
  pagingInfo: PagingInfo,
) {
  return useStopSearchResults({
    where: stopAreasToStopSearchWhere(stopAreas),
    skip: stopAreas.length === 0,
    sortingInfo,
    pagingInfo,
  });
}
