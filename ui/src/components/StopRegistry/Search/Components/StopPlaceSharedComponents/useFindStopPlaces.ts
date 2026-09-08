import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  FindStopPlaceInfoFragment,
  StopsDatabaseStopPlaceNewestVersionBoolExp,
  useFindStopPlacesQuery,
} from '../../../../../generated/graphql';
import { AllOptionEnum, queryToLike } from '../../../../../utils';
import { StopSearchFilters } from '../../Types';
import { useNumericSortingCollator } from '../../Utils';

const GQL_FIND_STOP_PLACE_INFO_FRAGMENT = gql`
  fragment FindStopPlaceInfo on stops_database_stop_place_newest_version {
    id
    netex_id
    version

    name_lang
    name_value

    private_code: private_code_value

    centroid
  }
`;

const GQL_FIND_STOP_PLACE = gql`
  query FindStopPlaces(
    $where: stops_database_stop_place_newest_version_bool_exp!
  ) {
    stops_database {
      stopPlaces: stops_database_stop_place_newest_version(
        where: $where
        order_by: [{ netex_id: asc }, { version: desc }]
      ) {
        ...FindStopPlaceInfo
      }
    }
  }
`;

type PlaceType = 'area' | 'terminal';

type StopPlaceNewestVersionWhereConditions =
  | StopsDatabaseStopPlaceNewestVersionBoolExp
  | Array<StopsDatabaseStopPlaceNewestVersionBoolExp>;

function toTiamatDBEnumCase(str: string) {
  return str.toUpperCase();
}

function observationDateFilter({
  observationDate,
}: StopSearchFilters): StopPlaceNewestVersionWhereConditions {
  const validOn = observationDate.toISO();

  return [
    { validity_start: { _lte: validOn } },
    {
      _or: [
        { validity_end: { _gte: validOn } },
        { validity_end: { _is_null: true } },
      ],
    },
  ];
}

function queryFilter({
  query,
}: StopSearchFilters): StopPlaceNewestVersionWhereConditions {
  const like = queryToLike(query);

  if (like === null) {
    return [];
  }

  const orConditions: Array<StopsDatabaseStopPlaceNewestVersionBoolExp> = [
    { private_code_value: { _ilike: like } },
    { name_value: { _ilike: like } },
    {
      stop_place_alternative_names: {
        alternative_name: { name_value: { _ilike: like } },
      },
    },
  ];

  return { _or: orConditions };
}

function transportationModeFilter({
  transportationMode,
}: StopSearchFilters): StopPlaceNewestVersionWhereConditions {
  if (transportationMode.includes(AllOptionEnum.All)) {
    return [];
  }

  return {
    transport_mode: {
      _in: transportationMode.sort().map(toTiamatDBEnumCase),
    },
  };
}

const isArea: StopPlaceNewestVersionWhereConditions = {
  is_area: { _eq: true },
};

const isTerminal: StopPlaceNewestVersionWhereConditions = {
  is_terminal: { _eq: true },
};

function filtersToWhere(
  filters: StopSearchFilters,
  placeType: PlaceType,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  return {
    _and: [
      observationDateFilter(filters),
      queryFilter(filters),
      transportationModeFilter(filters),
      placeType === 'area' ? isArea : isTerminal,
    ].flat(1),
  };
}

export function useFindStopPlaces(
  filters: StopSearchFilters,
  placeType: PlaceType,
) {
  const labelSortCollator = useNumericSortingCollator();

  const { data, ...rest } = useFindStopPlacesQuery({
    variables: { where: filtersToWhere(filters, placeType) },
  });

  const rawStopPlaces = data?.stops_database?.stopPlaces;

  const stopPlaces: ReadonlyArray<FindStopPlaceInfoFragment> = useMemo(() => {
    if (!rawStopPlaces) {
      return [];
    }

    return rawStopPlaces.toSorted(
      (a: FindStopPlaceInfoFragment, b: FindStopPlaceInfoFragment) =>
        labelSortCollator.compare(a.private_code ?? '', b.private_code ?? ''),
    );
  }, [rawStopPlaces, labelSortCollator]);

  return { ...rest, stopPlaces };
}
