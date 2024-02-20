import { gql } from '@apollo/client';
import {
  OrderBy,
  SearchStopsQueryVariables,
  ServicePatternScheduledStopPointBoolExp,
  ServicePatternScheduledStopPointOrderBy,
  StopTableRowFragment,
  StopTableRowStopPlaceFragment,
  useSearchStopsQuery,
} from '../../../generated/graphql';
import {
  StopPlaceEnrichmentProperties,
  buildLabelLikeGqlFilter,
  buildOptionalSearchConditionGqlFilter,
  getStopPlaceDetailsForEnrichment,
  getStopPlaceFromQueryResult,
  mapToSqlLikeValue,
  mapToVariables,
} from '../../../utils';
import {
  StopSearchConditions,
  useStopSearchQueryParser,
} from './useStopSearchQueryParser';

const GQL_STOP_TABLE_ROW_STOP_PLACE = gql`
  fragment stop_table_row_stop_place on stop_registry_StopPlace {
    id
    name {
      lang
      value
    }
    alternativeNames {
      nameType
      name {
        lang
        value
      }
    }
  }
`;

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
    stop_place_ref
    stop_place {
      ...stop_table_row_stop_place
    }
  }
`;

const GQL_SEARCH_STOPS = gql`
  query SearchStops(
    $stopFilter: service_pattern_scheduled_stop_point_bool_exp
    $stopOrderBy: [service_pattern_scheduled_stop_point_order_by!]
  ) {
    service_pattern_scheduled_stop_point(
      where: $stopFilter
      order_by: $stopOrderBy
    ) {
      ...stop_table_row
    }
  }
`;

const buildSearchStopsGqlQueryVariables = (
  searchConditions: StopSearchConditions,
): SearchStopsQueryVariables => {
  const stopFilter = buildOptionalSearchConditionGqlFilter<
    string,
    ServicePatternScheduledStopPointBoolExp
  >(mapToSqlLikeValue(searchConditions.label), buildLabelLikeGqlFilter);

  // TODO: add sorting.
  const stopOrderBy: Array<ServicePatternScheduledStopPointOrderBy> = [
    { label: OrderBy.Asc },
    { validity_start: OrderBy.Asc },
  ];

  return {
    stopFilter,
    stopOrderBy,
  };
};

type EnrichedStopTableRowStopPlace = StopTableRowStopPlaceFragment &
  StopPlaceEnrichmentProperties;

const getEnrichedStopPlace = (
  stopPlace: StopTableRowStopPlaceFragment | null,
): EnrichedStopTableRowStopPlace | null => {
  if (!stopPlace) {
    return null;
  }

  return {
    ...stopPlace,
    ...getStopPlaceDetailsForEnrichment(stopPlace),
  };
};

export type EnrichedStopTableRow = Omit<StopTableRowFragment, 'stop_place'> & {
  stop_place: null | EnrichedStopTableRowStopPlace;
};

export const useStopSearchResults = (): {
  loading: boolean;
  resultCount: number;
  stops: Array<EnrichedStopTableRow>;
} => {
  const parsedSearchQueryParameters = useStopSearchQueryParser();

  const searchQueryVariables = buildSearchStopsGqlQueryVariables(
    parsedSearchQueryParameters.search,
  );

  const result = useSearchStopsQuery(mapToVariables(searchQueryVariables));
  const { loading } = result;
  const stops = result.data?.service_pattern_scheduled_stop_point || [];
  const stopsWithEnrichedDetails = stops.map((stop) => {
    return {
      ...stop,
      stop_place: getEnrichedStopPlace(
        getStopPlaceFromQueryResult<StopTableRowStopPlaceFragment>(
          stop?.stop_place,
        ),
      ),
    };
  });

  return {
    loading,
    resultCount: stops.length,
    stops: stopsWithEnrichedDetails,
  };
};
