import identity from 'lodash/identity';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { Dispatch, SetStateAction, useCallback, useRef } from 'react';
import { PagingInfo, SortOrder, defaultPagingInfo } from '../../../../types';
import { areEqual, memoizeOne } from '../../../../utils';
import {
  SimpleRecord,
  TypedRouterHistoryStateShapeError,
  UrlStateDeserializers,
  UrlStateSerializers,
  toEnum,
  useTypedRouterState,
} from '../../Utils/typedRouterState';
import {
  assertIsAKnownIds,
  assertIsAResultSelection,
  assertIsAnArrayOfStrings,
  defaultResultSelection,
} from '../ResultSelection';
import {
  FiltersShape,
  SearchPageHistoryState,
  SearchPageSearchState,
  SearchPageSortingInfo,
  SearchPageUrlFlatState,
} from './types';

export function makeSerializers<
  Filters extends FiltersShape,
  SortBy extends string,
>(
  filterSerializers: UrlStateSerializers<Filters>,
): UrlStateSerializers<SearchPageUrlFlatState<Filters, SortBy>> {
  return {
    // Filters
    ...filterSerializers,

    // Paging
    page: String,
    pageSize: String,

    // Sorting
    sortBy: identity,
    sortOrder: identity,
  };
}

export function makeDeserializers<
  Filters extends FiltersShape,
  SortBy extends string,
>(
  filterDeserializers: UrlStateDeserializers<Filters>,
  knownSortByValues: ReadonlyArray<SortBy>,
): UrlStateDeserializers<SearchPageUrlFlatState<Filters, SortBy>> {
  const pagingDeserializers: UrlStateDeserializers<PagingInfo> = {
    page: Number,
    pageSize: Number,
  };

  const sortingDeserializers: UrlStateDeserializers<
    SearchPageSortingInfo<SortBy>
  > = {
    sortBy: toEnum(knownSortByValues),
    sortOrder: toEnum(Object.values(SortOrder)),
  };

  return {
    // Filters
    ...filterDeserializers,

    // Paging
    ...pagingDeserializers,

    // Sorting
    ...sortingDeserializers,
  } as unknown as UrlStateDeserializers<
    SearchPageUrlFlatState<Filters, SortBy>
  >;
}

export function makeDefaultValues<
  Filters extends FiltersShape,
  SortBy extends string,
>(filters: Filters, sortBy: SortBy): SearchPageUrlFlatState<Filters, SortBy> {
  return {
    // Filters,
    ...filters,

    // Paging
    ...defaultPagingInfo,

    // Sorting
    sortBy,
    sortOrder: SortOrder.ASCENDING,
  };
}

export const defaultSearchPageHistoryState: SearchPageHistoryState = {
  searchIsExpanded: false,
  selectedGroups: [],
  resultSelection: defaultResultSelection,
  knownStopIds: { listingMode: 'flat', ids: [] },
};

export function assertHistoryStateShape(
  state: SimpleRecord,
): asserts state is SearchPageHistoryState {
  if (typeof state.searchIsExpanded !== 'boolean') {
    throw new TypedRouterHistoryStateShapeError(
      'searchIsExpanded',
      state.searchIsExpanded,
      `Expected boolean value for SearchPageHistoryState's searchIsExpanded field, but value was (${String(state.searchIsExpanded)})!`,
    );
  }

  assertIsAKnownIds('knownStopIds', state.knownStopIds);

  assertIsAnArrayOfStrings('selectedGroups', state.selectedGroups);

  assertIsAResultSelection('resultSelection', state.resultSelection);
}

function pickFilters<Filters extends FiltersShape, SortBy extends string>(
  flatState: SearchPageUrlFlatState<Filters, SortBy>,
): Filters {
  return omit(flatState, [
    'page',
    'pageSize',
    'sortBy',
    'sortOrder',
  ]) as unknown as Filters;
}

function pickPagingInfo<Filters extends FiltersShape, SortBy extends string>(
  flatState: SearchPageUrlFlatState<Filters, SortBy>,
): PagingInfo {
  return pick(flatState, ['page', 'pageSize']);
}

function pickSortingInfo<Filters extends FiltersShape, SortBy extends string>(
  flatState: SearchPageUrlFlatState<Filters, SortBy>,
): SearchPageSortingInfo<SortBy> {
  return pick(flatState, ['sortBy', 'sortOrder']);
}

type MemoizedPickers = {
  readonly pickFilters: typeof pickFilters;
  readonly pickPagingInfo: typeof pickPagingInfo;
  readonly pickSortingInfo: typeof pickSortingInfo;
};

function useReconstitutedState<
  Filters extends FiltersShape,
  SortBy extends string,
>(
  flatState: SearchPageUrlFlatState<Filters, SortBy>,
): SearchPageSearchState<Filters, SortBy> {
  const memoizedPickersRef = useRef<null | MemoizedPickers>(null);

  memoizedPickersRef.current ??= {
    pickFilters: memoizeOne(pickFilters, areEqual),
    pickPagingInfo: memoizeOne(pickPagingInfo, areEqual),
    pickSortingInfo: memoizeOne(pickSortingInfo, areEqual),
  };

  const memoizedPickers = memoizedPickersRef.current;

  return {
    filters: memoizedPickers.pickFilters(flatState),
    pagingInfo: memoizedPickers.pickPagingInfo(flatState),
    sortingInfo: memoizedPickers.pickSortingInfo(flatState),
  };
}

function useSetter<
  Filters extends FiltersShape,
  SortBy extends string,
  T extends Readonly<Record<string, unknown>>,
>(
  setFlatState: Dispatch<
    SetStateAction<SearchPageUrlFlatState<Filters, SortBy>>
  >,
  pickFields: (flatState: SearchPageUrlFlatState<Filters, SortBy>) => T,
): Dispatch<SetStateAction<T>> {
  return useCallback(
    (nextState) => {
      if (typeof nextState === 'function') {
        setFlatState((p) => ({ ...p, ...nextState(pickFields(p)) }));
      } else {
        setFlatState((p) => ({ ...p, ...nextState }));
      }
    },
    [setFlatState, pickFields],
  );
}

export function useSearchPageRouterState<
  Filters extends FiltersShape,
  SortBy extends string,
>(
  serializers: UrlStateSerializers<SearchPageUrlFlatState<Filters, SortBy>>,
  deserializers: UrlStateDeserializers<SearchPageUrlFlatState<Filters, SortBy>>,
  defaultValues: SearchPageUrlFlatState<Filters, SortBy>,
) {
  const {
    state: { search, history },
    setSearchState,
    setHistoryState,
  } = useTypedRouterState<
    SearchPageUrlFlatState<Filters, SortBy>,
    SearchPageHistoryState
  >({
    search: {
      serializers,
      deserializers,
      defaultValues,
    },
    history: {
      defaultValues: defaultSearchPageHistoryState,
      assertShape: assertHistoryStateShape,
    },
  });

  const state: SearchPageSearchState<Filters, SortBy> =
    useReconstitutedState(search);

  const setFilters = useSetter(setSearchState, pickFilters);
  const setPagingInfo = useSetter(setSearchState, pickPagingInfo);
  const setSortingInfo = useSetter(setSearchState, pickSortingInfo);

  return {
    state,
    historyState: history,
    setFilters,
    setPagingInfo,
    setSortingInfo,
    setSearchState,
    setHistoryState,
  };
}
