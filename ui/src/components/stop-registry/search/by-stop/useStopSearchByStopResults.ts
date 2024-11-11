import { PagingInfo } from '../../../../types';
import { SortingInfo, StopSearchFilters, hasMeaningfulFilters } from '../types';
import { useStopSearchResults } from '../utils/useStopSearchResults';
import { buildSearchStopsGqlQueryVariables } from './filtersToQueryVariables';

export const useStopSearchByStopResults = (
  filters: StopSearchFilters,
  sortingInfo: SortingInfo,
  pagingInfo: PagingInfo,
) => {
  return useStopSearchResults({
    where: buildSearchStopsGqlQueryVariables(filters),
    skip: !hasMeaningfulFilters(filters),
    sortingInfo,
    pagingInfo,
  });
};
