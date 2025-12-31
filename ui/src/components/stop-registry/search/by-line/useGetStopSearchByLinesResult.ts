import { PagingInfo } from '../../../../types';
import { SortingInfo } from '../types';
import { useStopSearchResults } from '../utils/useStopSearchResults';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';
import { useResolveQuayIdsByLines } from './useResolveQuayIdsByLines';

export function useGetStopSearchByLinesResult(
  lines: ReadonlyArray<FindStopByLineInfo>,
  pagingInfo: PagingInfo,
  sortingInfo: SortingInfo,
) {
  const {
    quayIds,
    loading: resolveStopPlaceIdsLoading,
    error: resolveStopPlaceIdsError,
    refetch: resolveStopPlaceIdsRefetch,
  } = useResolveQuayIdsByLines(lines);

  const {
    stops,
    resultCount,
    loading: resultsLoading,
    error: resultsError,
    refetch: stopsRefetch,
  } = useStopSearchResults({
    where: { netex_id: { _in: quayIds } },
    skip: quayIds.length === 0,
    pagingInfo,
    sortingInfo,
  });

  return {
    stops,
    resultCount,
    quayIds,
    loading: resolveStopPlaceIdsLoading || resultsLoading,
    error: resolveStopPlaceIdsError ?? resultsError,
    resolveStopPlaceIdsInError: !!resolveStopPlaceIdsError,
    stopsInError: !!resultsError,
    resolveStopPlaceIdsRefetch,
    stopsRefetch,
  };
}
