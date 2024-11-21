import identity from 'lodash/identity';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { DateTime } from 'luxon';
import { Dispatch, SetStateAction, useCallback, useRef } from 'react';
import {
  UrlStateDeserializers,
  UrlStateSerializers,
  serializeState,
  toEnum,
  useTypedUrlState,
} from '../../../../hooks';
import { PagingInfo, SortOrder, defaultPagingInfo } from '../../../../types';
import {
  StopRegistryMunicipality,
  knownPriorityValues,
} from '../../../../types/enums';
import {
  AllOptionEnum,
  areEqual,
  memoizeOne,
  numberEnumEntries,
} from '../../../../utils';
import {
  SearchBy,
  SearchFor,
  SortStopsBy,
  SortingInfo,
  StopSearchFilters,
  defaultFilters,
  defaultSortingInfo,
} from '../types';
import {
  handleAllMunicipalities,
  knownMunicipalities,
} from './handleAllMunicipalities';

type StopSearchUrlFlatState = StopSearchFilters & PagingInfo & SortingInfo;

type StopSearchUrlState = {
  readonly filters: StopSearchFilters;
  readonly pagingInfo: PagingInfo;
  readonly sortingInfo: SortingInfo;
};

const SEPRATOR = ',';

const serializers: UrlStateSerializers<StopSearchUrlFlatState> = {
  // Filters
  query: identity,
  elyNumber: identity,
  searchBy: identity,
  searchFor: identity,
  observationDate: (date) => date.toISODate(),
  municipalities: (them) =>
    them
      .map((enumValue) =>
        enumValue === AllOptionEnum.All
          ? enumValue
          : // Reverse mapping for municipality → Enum value (number) to enum Key (string)
            StopRegistryMunicipality[enumValue],
      )
      .join(SEPRATOR),
  priorities: (priorities) => priorities.map(String).join(SEPRATOR),

  // Paging
  page: String,
  pageSize: String,

  // Sorting
  sortBy: identity,
  sortOrder: identity,
};

const lowerCaseMunicipalities: ReadonlyArray<
  [string, StopRegistryMunicipality]
> = numberEnumEntries(StopRegistryMunicipality).map(([key, value]) => [
  key.toLowerCase(),
  value,
]);

function parseMunicipalities(
  value: string,
): Array<StopRegistryMunicipality | AllOptionEnum> {
  const parsed = value.split(SEPRATOR).map((enumKeyOrNumberValue) => {
    if (enumKeyOrNumberValue === AllOptionEnum.All) {
      return AllOptionEnum.All;
    }

    const asNumber = Number(enumKeyOrNumberValue);
    if (knownMunicipalities.includes(asNumber)) {
      return asNumber as StopRegistryMunicipality;
    }

    const lowercased = enumKeyOrNumberValue.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, byName] =
      lowerCaseMunicipalities.find(([key]) => key === lowercased) ?? [];
    if (byName) {
      return byName;
    }

    throw new TypeError(`Value (${value}) is not a valid municipality!`);
  });

  return handleAllMunicipalities(parsed);
}

const toPriority = toEnum(knownPriorityValues);

const deserializers: UrlStateDeserializers<StopSearchUrlFlatState> = {
  // Filters
  query: identity,
  elyNumber: identity,
  searchBy: toEnum(Object.values(SearchBy)),
  searchFor: toEnum(Object.values(SearchFor)),
  observationDate: (value) => DateTime.fromISO(value),
  municipalities: parseMunicipalities,
  priorities: (value) => value.split(SEPRATOR).map(Number).map(toPriority),

  // Paging
  page: Number,
  pageSize: Number,

  // Sorting
  sortBy: toEnum(Object.values(SortStopsBy)),
  sortOrder: toEnum(Object.values(SortOrder)),
};

const defaultValues: StopSearchUrlFlatState = {
  // Filters
  ...defaultFilters,

  // Paging
  ...defaultPagingInfo,

  // Sorting
  ...defaultSortingInfo,
};

function pickFilters(flatState: StopSearchUrlFlatState) {
  return omit(flatState, ['page', 'pageSize', 'sortBy', 'sortOrder']);
}

function pickPagingInfo(flatState: StopSearchUrlFlatState) {
  return pick(flatState, ['page', 'pageSize']);
}

function pickSortingInfo(flatState: StopSearchUrlFlatState) {
  return pick(flatState, ['sortBy', 'sortOrder']);
}

type MemoizedPickers = {
  readonly pickFilters: typeof pickFilters;
  readonly pickPagingInfo: typeof pickPagingInfo;
  readonly pickSortingInfo: typeof pickSortingInfo;
};

function useReconstitutedState(
  flatState: StopSearchUrlFlatState,
): StopSearchUrlState {
  const memoizedPickersRef = useRef<null | MemoizedPickers>(null);

  if (memoizedPickersRef.current === null) {
    memoizedPickersRef.current = {
      pickFilters: memoizeOne(pickFilters, areEqual),
      pickPagingInfo: memoizeOne(pickPagingInfo),
      pickSortingInfo: memoizeOne(pickSortingInfo),
    };
  }

  const memoizedPickers = memoizedPickersRef.current;

  return {
    filters: memoizedPickers.pickFilters(flatState),
    pagingInfo: memoizedPickers.pickPagingInfo(flatState),
    sortingInfo: memoizedPickers.pickSortingInfo(flatState),
  };
}

function useSetter<T extends Readonly<Record<string, unknown>>>(
  setFlatState: Dispatch<SetStateAction<StopSearchUrlFlatState>>,
  pickFields: (flatState: StopSearchUrlFlatState) => T,
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

export function useStopSearchUrlState() {
  const [flatState, setFlatState] = useTypedUrlState<StopSearchUrlFlatState>(
    serializers,
    deserializers,
    defaultValues,
  );

  const state: StopSearchUrlState = useReconstitutedState(flatState);

  const setFilters = useSetter(setFlatState, pickFilters);
  const setPagingInfo = useSetter(setFlatState, pickPagingInfo);
  const setSortingInfo = useSetter(setFlatState, pickSortingInfo);

  return {
    state,
    setFilters,
    setPagingInfo,
    setSortingInfo,
    setFlatState,
  };
}

export function stopSearchUrlStateToSearch(state: StopSearchUrlState): string {
  return serializeState(serializers, defaultValues, {
    ...state.filters,
    ...state.pagingInfo,
    ...state.sortingInfo,
  }).toString();
}
