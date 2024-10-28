import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  SearchStopsQuery,
  StopTableRowFragment,
  StopTableRowStopPlaceFragment,
  useSearchStopsQuery,
} from '../../../../generated/graphql';
import {
  StopSearchFilters,
  StopSearchRow,
  hasMeaningfulFilters,
} from '../types';
import { buildSearchStopsGqlQueryVariables } from './filtersToQueryVariables';

const GQL_STOP_TABLE_ROW = gql`
  fragment stop_table_row on service_pattern_scheduled_stop_point {
    scheduled_stop_point_id
    label
    measured_location
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
    netex_id
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

const mapResultRowToStopSearchRow = (
  stopPlace: StopTableRowStopPlaceFragment,
) => {
  return {
    ...(stopPlace.scheduled_stop_point_instance as StopTableRowFragment),
    stop_place: {
      netexId: stopPlace.netex_id,
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
  data: SearchStopsQuery,
): StopSearchRow[] =>
  data.stops_database?.stops_database_stop_place_newest_version
    // Filter out stops which do not have a matching stop in routes and lines
    .filter((stop) => !!stop.scheduled_stop_point_instance)
    .map(mapResultRowToStopSearchRow) ?? [];

export const useStopSearchResults = (filters: StopSearchFilters) => {
  const stopFilter = buildSearchStopsGqlQueryVariables(filters);

  const skip = !hasMeaningfulFilters(filters);
  const { data, ...rest } = useSearchStopsQuery({
    variables: { stopFilter },
    skip,
  });

  const stopSearchRows = useMemo(() => {
    if (!data) {
      return [];
    }

    return mapQueryResultToStopSearchRows(data);
  }, [data]);

  return {
    ...rest,
    resultCount: stopSearchRows.length,
    stops: stopSearchRows,
  };
};
