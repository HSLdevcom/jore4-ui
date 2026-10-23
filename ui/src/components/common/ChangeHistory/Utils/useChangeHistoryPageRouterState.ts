import noop from 'lodash/noop';
import { useMemo } from 'react';
import { today } from '../../../../time/date';
import { PagingInfo, SortOrder } from '../../../../types';
import { Priority } from '../../../../types/enums';
import { memoizeStatePicker } from '../../../../utils';
import {
  UrlStateDeserializers,
  UrlStateSerializers,
  toEnum,
  useTypedRouterState,
} from '../../Utils/typedRouterState';
import {
  ChangeHistoryFilters,
  ChangeHistorySortingInfo,
  SortChangeHistoryBy,
  defaultChangeHistorySortingInfo,
} from '../Types';

type HistoryState = Readonly<Record<string, never>>;
const defaultHistoryState: HistoryState = {};

type FlatChangeHistoryState = ChangeHistoryFilters &
  ChangeHistorySortingInfo &
  PagingInfo;

export const defaultValues: FlatChangeHistoryState = {
  // Filters
  from: today().subtract({ months: 6 }).with({ day: 1 }),
  to: today(),
  priority: Priority.Standard,

  // Sorting
  ...defaultChangeHistorySortingInfo,

  // Paging
  page: 1,
  pageSize: 20,
};

const serializers: UrlStateSerializers<FlatChangeHistoryState> = {
  // Filters
  from: (v) => v.toString(),
  to: (v) => v.toString(),
  priority: String,

  // Sorting
  sortBy: String,
  sortOrder: String,

  // Paging
  page: String,
  pageSize: String,
};

const deserializers: UrlStateDeserializers<FlatChangeHistoryState> = {
  // Filters
  from: (str) => Temporal.PlainDate.from(str),
  to: (str) => Temporal.PlainDate.from(str),
  priority: Number,

  // Sorting
  sortBy: toEnum(Object.values(SortChangeHistoryBy)),
  sortOrder: toEnum(Object.values(SortOrder)),

  // Paging
  page: Number,
  pageSize: Number,
};

export function useChangeHistoryPageRouterState() {
  const { state, setSearchState } = useTypedRouterState<
    FlatChangeHistoryState,
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
      pagingInfo: memoizeStatePicker(['page', 'pageSize'], setSearchState),
      sortingInfo: memoizeStatePicker(['sortBy', 'sortOrder'], setSearchState),
    }),
    [setSearchState],
  );

  return {
    filters: pickers.filters.getPickedState(state.search),
    setFilters: pickers.filters.setPickedState,

    pagingInfo: pickers.pagingInfo.getPickedState(state.search),
    setPagingInfo: pickers.pagingInfo.setPickedState,

    sortingInfo: pickers.sortingInfo.getPickedState(state.search),
    setSortingInfo: pickers.sortingInfo.setPickedState,
  };
}
