import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useSearchStopsQuery } from '../../../../generated/graphql';
import { StopSearchFilters, hasMeaningfulFilters } from '../types';
import { mapQueryResultToStopSearchRows } from '../utils';
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
