import { PagingInfo } from '../../../../types';
import { buildSearchStopsGqlQueryVariables } from '../Common';
import { SortingInfo, StopSearchFilters, hasMeaningfulFilters } from '../Types';
import { useStopSearchResults } from '../Utils/useStopSearchResults';

export function useStopSearchByStopResults(
  filters: StopSearchFilters,
  sortingInfo: SortingInfo,
  pagingInfo: PagingInfo,
) {
  return useStopSearchResults({
    where: buildSearchStopsGqlQueryVariables(filters),
    skip: !hasMeaningfulFilters(filters),
    sortingInfo,
    pagingInfo,
  });
}
