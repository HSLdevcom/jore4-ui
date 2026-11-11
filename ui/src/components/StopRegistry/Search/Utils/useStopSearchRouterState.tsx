import identity from 'lodash/identity';
import { FC, PropsWithChildren, createContext, useContext } from 'react';
import { ZodArray, ZodTypeAny, z } from 'zod';
import { AllOptionEnum, NullOptionEnum } from '../../../../utils';
import {
  SearchPageUrlFlatState,
  makeDefaultValues,
  makeDeserializers,
  makeSerializers,
  useSearchPageRouterState,
} from '../../../common/Search/SearchPageRouterState';
import {
  SEPARATOR,
  UrlStateDeserializers,
  UrlStateSerializers,
  parsePriorities,
  parseZodEnumArray,
  parseZodEnumArrayWithAllOption,
  serializeArray,
  splitString,
  toEnum,
} from '../../../common/Utils/typedRouterState';
import { allKnownPosterSizes } from '../../Components/InfoSpots';
import {
  SearchBy,
  SearchFor,
  SortStopsBy,
  StopSearchFilters,
  defaultFilters,
  defaultSortingInfo,
  stopSearchFiltersSchema,
} from '../Types';

type StopSearchUrlFlatState = SearchPageUrlFlatState<
  StopSearchFilters,
  SortStopsBy
>;

const SIZE_SEPARATOR = '|';

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

export const filterSerializers: UrlStateSerializers<StopSearchFilters> = {
  query: identity,
  elyNumber: identity,
  searchBy: identity,
  searchFor: identity,
  observationDate: (date) => date.toString(),
  municipalities: serializeArray,
  priorities: serializeArray,
  transportationMode: serializeArray,
  stopState: serializeArray,
  shelter: serializeArray,
  electricity: serializeArray,
  infoSpots: serializeInfoSpots,
  stopOwner: serializeArray,

  // Extra filters:
  stopPlaces: serializeArray,
  quayIds: serializeArray,
};

const serializers: UrlStateSerializers<StopSearchUrlFlatState> =
  makeSerializers(filterSerializers);

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

function parseZodEnumArrayWithAllAndNullOptions<
  EnumT extends ZodTypeAny,
  Parser extends ZodArray<EnumT>,
>(parser: Parser): (value: string) => z.output<Parser> {
  return parseZodEnumArray(parser, cleanupEnumArrayWithAllAndNullOptions);
}

const parseMunicipalities = parseZodEnumArrayWithAllOption(
  stopSearchFiltersSchema.shape.municipalities,
);

const parseTransportationMode = parseZodEnumArrayWithAllOption(
  stopSearchFiltersSchema.shape.transportationMode,
);

const parseStopState = parseZodEnumArrayWithAllOption(
  stopSearchFiltersSchema.shape.stopState,
);

const parseShelter = parseZodEnumArrayWithAllAndNullOptions(
  stopSearchFiltersSchema.shape.shelter,
);

const parseElectricity = parseZodEnumArrayWithAllAndNullOptions(
  stopSearchFiltersSchema.shape.electricity,
);

const parseStopOwner = parseZodEnumArrayWithAllOption(
  stopSearchFiltersSchema.shape.stopOwner,
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

export const filterDeserializers: UrlStateDeserializers<StopSearchFilters> = {
  query: identity,
  elyNumber: identity,
  searchBy: toEnum(Object.values(SearchBy)),
  searchFor: toEnum(Object.values(SearchFor)),
  observationDate: (value) => Temporal.PlainDate.from(value),
  municipalities: parseMunicipalities,
  priorities: parsePriorities,
  transportationMode: parseTransportationMode,
  stopState: parseStopState,
  shelter: parseShelter,
  electricity: parseElectricity,
  infoSpots: parseInfoSpots,
  stopOwner: parseStopOwner,

  // Extra filters:
  stopPlaces: splitString,
  quayIds: splitString,
};

const deserializers: UrlStateDeserializers<StopSearchUrlFlatState> =
  makeDeserializers(filterDeserializers, Object.values(SortStopsBy));

const defaultValues: StopSearchUrlFlatState = makeDefaultValues(
  defaultFilters,
  defaultSortingInfo.sortBy,
);

function useStopSearchRouterStateImpl() {
  return useSearchPageRouterState<StopSearchFilters, SortStopsBy>(
    serializers,
    deserializers,
    defaultValues,
  );
}

const stopSearchRouterStateContext = createContext<ReturnType<
  typeof useStopSearchRouterStateImpl
> | null>(null);

export const SearchRouterStateContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <stopSearchRouterStateContext.Provider
      value={useStopSearchRouterStateImpl()}
    >
      {children}
    </stopSearchRouterStateContext.Provider>
  );
};

export function useStopSearchRouterState() {
  const context = useContext(stopSearchRouterStateContext);
  if (!context) {
    throw new Error('StopSearchRouterStateContext not found!');
  }

  return context;
}
