import { gql } from '@apollo/client';
import {
  SearchStopsQueryResult,
  SearchStopsQueryVariables,
  StopTableRowFragment,
  StopTableRowStopPlaceFragment,
  StopsDatabaseStopPlaceNewestVersionBoolExp,
  useSearchStopsQuery,
} from '../../../generated/graphql';
import {
  buildOptionalSearchConditionGqlFilter,
  buildTiamatAddressLikeGqlFilter,
  buildTiamatPrivateCodeLikeGqlFilter,
  buildTiamatStopQuayPublicCodeLikeGqlFilter,
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
  const labelFilter = buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseStopPlaceNewestVersionBoolExp
  >(
    mapToSqlLikeValue(searchConditions.label),
    buildTiamatStopQuayPublicCodeLikeGqlFilter,
  );

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
    mapToSqlLikeValue(searchConditions.address),
    buildTiamatAddressLikeGqlFilter,
  );

  const stopFilter = { ...labelFilter, ...elyNumberFilter, ...addressFilter };

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

  const searchQueryVariables = buildSearchStopsGqlQueryVariables(
    parsedSearchQueryParameters.search,
  );

  const result = useSearchStopsQuery(mapToVariables(searchQueryVariables));

  const stopSearchRows = mapQueryResultToStopSearchRows(result);

  const { loading } = result;

  return {
    loading,
    resultCount: stopSearchRows.length,
    stops: stopSearchRows,
  };
};
