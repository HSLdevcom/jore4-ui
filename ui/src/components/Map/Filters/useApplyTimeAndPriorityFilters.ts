import { useCallback } from 'react';
import {
  FilterType,
  setTimeAndPriorityFilterAction,
  useAppDispatch,
} from '../../../redux';
import { Priority } from '../../../types/enums';

type ApplyTimeAndPriorityFiltersFn = (
  priorities: ReadonlyArray<Priority>,
  showSelectedDaySituation: boolean,
) => void;

/**
 * Applies the shared time and priority filters so that they match the routes
 * the map is displaying. Every entry point to the map (line view, route view,
 * route creation) has to end up with the same filters as the map URL state,
 * so the mapping lives in a single place.
 */
export function useApplyTimeAndPriorityFilters(): ApplyTimeAndPriorityFiltersFn {
  const dispatch = useAppDispatch();

  return useCallback(
    (priorities, showSelectedDaySituation) => {
      const filters: ReadonlyArray<[FilterType, boolean]> = [
        [FilterType.ShowHighestPriorityCurrent, showSelectedDaySituation],
        [FilterType.ShowCurrent, true],
        [FilterType.ShowFuture, false],
        [FilterType.ShowPast, false],
        [FilterType.ShowStandard, priorities.includes(Priority.Standard)],
        [FilterType.ShowTemporary, priorities.includes(Priority.Temporary)],
        [FilterType.ShowDraft, priorities.includes(Priority.Draft)],
      ];

      filters.forEach(([filterType, isActive]) => {
        dispatch(setTimeAndPriorityFilterAction({ filterType, isActive }));
      });
    },
    [dispatch],
  );
}
