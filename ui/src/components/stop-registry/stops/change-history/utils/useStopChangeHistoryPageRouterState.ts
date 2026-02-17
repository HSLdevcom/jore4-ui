import noop from 'lodash/noop';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { parseDate } from '../../../../../time';
import { SortOrder } from '../../../../../types';
import { Priority } from '../../../../../types/enums';
import { memoizeStatePicker } from '../../../../../utils';
import {
  ChangeHistorySortingInfo,
  SortChangeHistoryBy,
  defaultChangeHistorySortingInfo,
} from '../../../../common/ChangeHistory';
import {
  UrlStateDeserializers,
  UrlStateSerializers,
  toEnum,
  useTypedRouterState,
} from '../../../../common/hooks/typedRouterState';
import { StopChangeHistoryFilters } from '../types';

type HistoryState = Readonly<Record<string, never>>;
const defaultHistoryState: HistoryState = {};

type FlatStopChangeHistoryState = StopChangeHistoryFilters &
  ChangeHistorySortingInfo;

export const defaultValues: FlatStopChangeHistoryState = {
  // Filters
  from: DateTime.now().minus({ months: 6 }).startOf('month').startOf('day'),
  to: DateTime.now().endOf('day'),
  priority: Priority.Standard,

  // Sorting
  ...defaultChangeHistorySortingInfo,
};

const serializers: UrlStateSerializers<FlatStopChangeHistoryState> = {
  // Filters
  from: (v) => v.toISODate(),
  to: (v) => v.toISODate(),
  priority: String,

  // Sorting
  sortBy: String,
  sortOrder: String,
};

const deserializers: UrlStateDeserializers<FlatStopChangeHistoryState> = {
  // Filters
  from: (str) => parseDate(str).startOf('day'),
  to: (str) => parseDate(str).endOf('day'),
  priority: Number,

  // Sorting
  sortBy: toEnum(Object.values(SortChangeHistoryBy)),
  sortOrder: toEnum(Object.values(SortOrder)),
};

export function useStopChangeHistoryPageRouterState() {
  const { state, setSearchState } = useTypedRouterState<
    FlatStopChangeHistoryState,
    HistoryState
  >({
    search: {
      serializers,
      deserializers,
      defaultValues,
    },
    history: {
      defaultValues: defaultHistoryState,
      assertShape: noop,
    },
  });

  const pickers = useMemo(
    () => ({
      filters: memoizeStatePicker(['from', 'to', 'priority'], setSearchState),
      sortingInfo: memoizeStatePicker(['sortBy', 'sortOrder'], setSearchState),
    }),
    [setSearchState],
  );

  return {
    filters: pickers.filters.getPickedState(state.search),
    setFilters: pickers.filters.setPickedState,

    sortingInfo: pickers.sortingInfo.getPickedState(state.search),
    setSortingInfo: pickers.sortingInfo.setPickedState,
  };
}
