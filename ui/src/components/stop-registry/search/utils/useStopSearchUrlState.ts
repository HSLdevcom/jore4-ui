import identity from 'lodash/identity';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { DateTime } from 'luxon';
import { Dispatch, SetStateAction, useCallback, useRef } from 'react';
import { ZodArray, ZodTypeAny, z } from 'zod';
import { PagingInfo, SortOrder, defaultPagingInfo } from '../../../../types';
import {
  StopRegistryMunicipality,
  knownPriorityValues,
} from '../../../../types/enums';
import {
  AllOptionEnum,
  NullOptionEnum,
  areEqual,
  memoizeOne,
  numberEnumEntries,
} from '../../../../utils';
import { allKnownPosterSizes } from '../../stops/stop-details/info-spots/types';
import {
  SearchBy,
  SearchFor,
  SortStopsBy,
  SortingInfo,
  StopSearchFilters,
  defaultFilters,
  defaultSortingInfo,
  stopSearchFiltersSchema,
} from '../types';
import {
  handleAllMunicipalities,
  knownMunicipalities,
} from './handleAllMunicipalities';
import {
  UrlStateDeserializers,
  UrlStateSerializers,
  serializeState,
  toEnum,
  useTypedUrlState,
} from './useTypedUrlState';

type StopSearchUrlFlatState = StopSearchFilters & PagingInfo & SortingInfo;

type StopSearchUrlState = {
  readonly filters: StopSearchFilters;
  readonly pagingInfo: PagingInfo;
  readonly sortingInfo: SortingInfo;
};

const SEPARATOR = ',';
const SIZE_SEPARATOR = '|';

function serializeMunicipalities(
  them: StopSearchFilters['municipalities'],
): string {
  return them
    .map((enumValue) =>
      enumValue === AllOptionEnum.All
        ? enumValue
        : // Reverse mapping for municipality → Enum value (number) to enum Key (string)
          StopRegistryMunicipality[enumValue],
    )
    .join(SEPARATOR);
}

function serializeArray<ValueT>(values: ReadonlyArray<ValueT>): string {
  return values.map(String).join(SEPARATOR);
}

function serializeInfoSpots(value: StopSearchFilters['infoSpots']): string {
  return value
    .map((size) => {
      if (typeof size === 'string') {
        return size;
      }

      const knownLabel = allKnownPosterSizes.find(
        (knownPosterSize) =>
          knownPosterSize.size.width === size.width &&
          knownPosterSize.size.height === size.height,
      )?.label;

      if (knownLabel) {
        return knownLabel;
      }

      return `${size.width}${SIZE_SEPARATOR}${size.height}`;
    })
    .join(SEPARATOR);
}

const serializers: UrlStateSerializers<StopSearchUrlFlatState> = {
  // Filters
  query: identity,
  elyNumber: identity,
  searchBy: identity,
  searchFor: identity,
  observationDate: (date) => date.toISODate(),
  municipalities: serializeMunicipalities,
  priorities: serializeArray,
  transportationMode: serializeArray,
  stopState: serializeArray,
  shelter: serializeArray,
  electricity: serializeArray,
  infoSpots: serializeInfoSpots,

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

/**
 * Split string into array on separator, with handling for empty strings.
 *
 * @param value string to split
 * @param separator string to split on
 */
function splitString(
  value: string,
  separator: string = SEPARATOR,
): Array<string> {
  if (value.length === 0) {
    return [];
  }

  return value.split(separator);
}

function parseMunicipalities(
  value: string,
): Array<StopRegistryMunicipality | AllOptionEnum> {
  const parsed = splitString(value).map((enumKeyOrNumberValue) => {
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

/**
 * If All is included -> [All]
 * If empty -> [All]
 * Else -> [input list]
 *
 * @param values
 */
function cleanupEnumArrayWithAllOption<Enum>(
  values: Array<Enum | AllOptionEnum>,
): Array<Enum | AllOptionEnum> {
  if (values.length && !values.includes(AllOptionEnum.All)) {
    return values;
  }

  return [AllOptionEnum.All];
}

/**
 * If All is included -> [All]
 * If empty -> [Null]
 * Else -> [input list]
 *
 * @param values
 */
function cleanupEnumArrayWithAllAndNullOptions<Enum>(
  values: Array<Enum | AllOptionEnum | NullOptionEnum>,
): Array<Enum | AllOptionEnum | NullOptionEnum> {
  if (values.includes(AllOptionEnum.All)) {
    return [AllOptionEnum.All];
  }

  if (values.length === 0) {
    return [NullOptionEnum.Null];
  }

  return values;
}

function parseEnumArray<
  EnumT extends ZodTypeAny,
  Parser extends ZodArray<EnumT>,
>(
  parser: Parser,
  cleanerFn: (dirty: z.output<Parser>) => z.output<Parser>,
): (value: string) => z.output<Parser> {
  return (value) => {
    const splut = splitString(value);
    const parsed = parser.parse(splut);
    return cleanerFn(parsed);
  };
}

function parseEnumArrayWithAllOption<
  EnumT extends ZodTypeAny,
  Parser extends ZodArray<EnumT>,
>(parser: Parser): (value: string) => z.output<Parser> {
  return parseEnumArray(parser, cleanupEnumArrayWithAllOption);
}

function parseEnumArrayWithAllAndNullOptions<
  EnumT extends ZodTypeAny,
  Parser extends ZodArray<EnumT>,
>(parser: Parser): (value: string) => z.output<Parser> {
  return parseEnumArray(parser, cleanupEnumArrayWithAllAndNullOptions);
}

const parseTransportationMode = parseEnumArrayWithAllOption(
  stopSearchFiltersSchema.shape.transportationMode,
);
const parseStopState = parseEnumArrayWithAllOption(
  stopSearchFiltersSchema.shape.stopState,
);
const parseShelter = parseEnumArrayWithAllAndNullOptions(
  stopSearchFiltersSchema.shape.shelter,
);
const parseElectricity = parseEnumArrayWithAllAndNullOptions(
  stopSearchFiltersSchema.shape.electricity,
);

function parseInfoSpots(value: string): StopSearchFilters['infoSpots'] {
  return splitString(value).map((size) => {
    if (size === AllOptionEnum.All || size === NullOptionEnum.Null) {
      return size;
    }

    const knownSize = allKnownPosterSizes.find(
      (known) => known.label === size,
    )?.size;

    if (knownSize) {
      return knownSize;
    }

    const [width = 0, height = 0] = splitString(size, SIZE_SEPARATOR)
      .map(Number)
      .filter(Number.isSafeInteger);

    if (width <= 0 || height <= 0) {
      throw new Error(
        `Found an invalid size (${size}) while parsing InfoSpots filter from value: ${value}`,
      );
    }

    return { width, height };
  });
}

const deserializers: UrlStateDeserializers<StopSearchUrlFlatState> = {
  // Filters
  query: identity,
  elyNumber: identity,
  searchBy: toEnum(Object.values(SearchBy)),
  searchFor: toEnum(Object.values(SearchFor)),
  observationDate: (value) => DateTime.fromISO(value),
  municipalities: parseMunicipalities,
  priorities: (value) => splitString(value).map(Number).map(toPriority),
  transportationMode: parseTransportationMode,
  stopState: parseStopState,
  shelter: parseShelter,
  electricity: parseElectricity,
  infoSpots: parseInfoSpots,

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

  memoizedPickersRef.current ??= {
    pickFilters: memoizeOne(pickFilters, areEqual),
    pickPagingInfo: memoizeOne(pickPagingInfo),
    pickSortingInfo: memoizeOne(pickSortingInfo),
  };

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
