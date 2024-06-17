import { gql } from '@apollo/client';
import {
  SearchStopsQueryResult,
  SearchStopsQueryVariables,
  StopTableRowFragment,
  StopTableRowStopPlaceFragment,
  StopsDatabaseStopPlaceNewestVersionBoolExp,
  useSearchStopsQuery,
} from '../../../generated/graphql';
import { StopRegistryMunicipality } from '../../../types/enums';
import {
  AllOptionEnum,
  buildOptionalSearchConditionGqlFilter,
  buildTiamatAddressLikeGqlFilter,
  buildTiamatMunicipalityGqlFilter,
  buildTiamatPrivateCodeLikeGqlFilter,
  buildTiamatStopQuayPublicCodeLikeGqlFilter,
  buildTiamatStopQuayPublicCodeOrNameLikeGqlFilter,
  mapToSqlLikeValue,
  mapToVariables,
} from '../../../utils';
import {
  StopSearchConditions,
  useStopSearchQueryParser,
} from './useStopSearchQueryParser';

const GQL_STOP_TABLE_ROW = gql`
  fragment stop_table_row on service_pattern_scheduled_stop_point {
    scheduled_stop_point_id
    label
    validity_start
    validity_end
    timing_place_id
    timing_place {
      timing_place_id
      label
    }
  }
`;

const GQL_STOP_TABLE_ROW_STOP_PLACE = gql`
  fragment stop_table_row_stop_place on stops_database_stop_place_newest_version {
    id
    name_value
    stop_place_alternative_names {
      alternative_name {
        name_lang
        name_type
        name_value
      }
    }
    scheduled_stop_point_instance {
      ...stop_table_row
    }
  }
`;

const GQL_SEARCH_STOPS = gql`
  query SearchStops(
    $stopFilter: stops_database_stop_place_newest_version_bool_exp
  ) {
    stops_database {
      stops_database_stop_place_newest_version(where: $stopFilter) {
        ...stop_table_row_stop_place
      }
    }
  }
`;

type StopPlaceSearchRowDetails = {
  nameFin?: string | null;
  nameSwe?: string | null;
};

export type StopSearchRow = StopTableRowFragment & {
  stop_place: StopPlaceSearchRowDetails;
};

const buildSearchStopsGqlQueryVariables = (
  searchConditions: StopSearchConditions,
): SearchStopsQueryVariables => {
  const labelOrName = searchConditions.labelOrName ?? '';

  // By design, we only accept search by name when the input is at least 4 characters.
  const labelOrNameFilterToUse =
    labelOrName.length >= 4
      ? buildTiamatStopQuayPublicCodeOrNameLikeGqlFilter
      : buildTiamatStopQuayPublicCodeLikeGqlFilter;

  const labelOrNameFilter = buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseStopPlaceNewestVersionBoolExp
  >(mapToSqlLikeValue(labelOrName), labelOrNameFilterToUse);

  const elyNumberFilter = buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseStopPlaceNewestVersionBoolExp
  >(
    mapToSqlLikeValue(searchConditions.elyNumber),
    buildTiamatPrivateCodeLikeGqlFilter,
  );

  const addressFilter = buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseStopPlaceNewestVersionBoolExp
  >(
    mapToSqlLikeValue(searchConditions.address ?? ''),
    buildTiamatAddressLikeGqlFilter,
  );

  const mapStringToMunicipalityEnums = (value: string) => {
    return value
      .split(',')
      .filter((s) => s !== AllOptionEnum.All)
      .map(
        (v) =>
          StopRegistryMunicipality[v as keyof typeof StopRegistryMunicipality],
      );
  };

  const municipalityFilter = buildOptionalSearchConditionGqlFilter<
    StopRegistryMunicipality[],
    StopsDatabaseStopPlaceNewestVersionBoolExp
  >(
    mapStringToMunicipalityEnums(searchConditions.municipalities),
    buildTiamatMunicipalityGqlFilter,
  );

  const stopFilter = {
    ...labelOrNameFilter,
    ...elyNumberFilter,
    ...addressFilter,
    ...municipalityFilter,
  };

  return {
    stopFilter,
  };
};

const mapResultRowToStopSearchRow = (
  stopPlace: StopTableRowStopPlaceFragment,
) => {
  return {
    ...(stopPlace.scheduled_stop_point_instance as StopTableRowFragment),
    stop_place: {
      nameFin: stopPlace.name_value,
      nameSwe: stopPlace.stop_place_alternative_names.find(
        (alternativeName) =>
          alternativeName.alternative_name.name_lang === 'swe' &&
          alternativeName.alternative_name.name_type === 'TRANSLATION',
      )?.alternative_name.name_value,
    },
  };
};

const mapQueryResultToStopSearchRows = (
  result: SearchStopsQueryResult,
): StopSearchRow[] =>
  result.data?.stops_database?.stops_database_stop_place_newest_version
    // Filter out stops which do not have a matching stop in routes and lines
    .filter((stop) => !!stop.scheduled_stop_point_instance)
    .map(mapResultRowToStopSearchRow) || [];

export const useStopSearchResults = (): {
  loading: boolean;
  resultCount: number;
  stops: Array<StopSearchRow>;
} => {
  const parsedSearchQueryParameters = useStopSearchQueryParser();
  const { searchKey, searchBy } = parsedSearchQueryParameters.search;

  const searchQueryVariables = buildSearchStopsGqlQueryVariables({
    ...parsedSearchQueryParameters.search,
    [searchBy]: searchKey,
  });

  const result = useSearchStopsQuery(mapToVariables(searchQueryVariables));

  const stopSearchRows = mapQueryResultToStopSearchRows(result);

  const { loading } = result;

  return {
    loading,
    resultCount: stopSearchRows.length,
    stops: stopSearchRows,
  };
};
