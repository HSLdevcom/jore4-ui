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
import { PagingInfo, defaultPagingInfo } from '../../../../types';
import { StopRegistryMunicipality } from '../../../../types/enums';
import {
  AllOptionEnum,
  areEqual,
  memoizeOne,
  numberEnumEntries,
} from '../../../../utils';
import {
  SearchBy,
  SearchFor,
  StopSearchFilters,
  defaultFilters,
} from '../types';
import {
  handleAllMunicipalities,
  knownMunicipalities,
} from './handleAllMunicipalities';

type StopSearchUrlFlatState = StopSearchFilters & PagingInfo;

type StopSearchUrlState = {
  readonly filters: StopSearchFilters;
  readonly pagingInfo: PagingInfo;
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

  // Paging
  page: String,
  pageSize: String,
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

const deserializers: UrlStateDeserializers<StopSearchUrlFlatState> = {
  // Filters
  query: identity,
  elyNumber: identity,
  searchBy: toEnum(Object.values(SearchBy)),
  searchFor: toEnum(Object.values(SearchFor)),
  observationDate: (value) => DateTime.fromISO(value),
  municipalities: parseMunicipalities,

  // Paging
  page: Number,
  pageSize: Number,
};

const defaultValues: StopSearchUrlFlatState = {
  // Filters
  ...defaultFilters,

  // Paging
  ...defaultPagingInfo,
};

function pickFilters(flatState: StopSearchUrlFlatState) {
  return omit(flatState, ['page', 'pageSize']);
}

function pickPagingInfo(flatState: StopSearchUrlFlatState) {
  return pick(flatState, ['page', 'pageSize']);
}

type MemoizedPickers = {
  readonly pickFilters: typeof pickFilters;
  readonly pickPagingInfo: typeof pickPagingInfo;
};

function useReconstitutedState(
  flatState: StopSearchUrlFlatState,
): StopSearchUrlState {
  const memoizedPickersRef = useRef<null | MemoizedPickers>(null);

  if (memoizedPickersRef.current === null) {
    memoizedPickersRef.current = {
      pickFilters: memoizeOne(pickFilters, areEqual),
      pickPagingInfo: memoizeOne(pickPagingInfo),
    };
  }

  const memoizedPickers = memoizedPickersRef.current;

  return {
    filters: memoizedPickers.pickFilters(flatState),
    pagingInfo: memoizedPickers.pickPagingInfo(flatState),
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

  return {
    state,
    setFilters,
    setPagingInfo,
    setFlatState,
  };
}

export function stopSearchUrlStateToSearch(state: StopSearchUrlState): string {
  return serializeState(serializers, defaultValues, {
    ...state.filters,
    ...state.pagingInfo,
  }).toString();
}
