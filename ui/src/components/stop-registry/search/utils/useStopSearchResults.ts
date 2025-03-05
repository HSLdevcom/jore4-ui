import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  OrderBy,
  StopsDatabaseQuayNewestVersionBoolExp,
  StopsDatabaseQuayNewestVersionOrderBy,
  useSearchStopsQuery,
} from '../../../../generated/graphql';
import { PagingInfo, SortOrder } from '../../../../types';
import { SortStopsBy, SortingInfo, StopSearchRow } from '../types';
import { mapQueryResultToStopSearchRows } from './resultMappers';

const GQL_STOP_TABLE_ROW = gql`
  fragment stop_table_row on service_pattern_scheduled_stop_point {
    scheduled_stop_point_id
    label
    measured_location
    validity_start
    validity_end
    timing_place_id
    priority
    timing_place {
      timing_place_id
      label
    }
  }
`;

const GQL_STOP_TABLE_ROW_QUAY_BASE_DETAILS = gql`
  fragment stop_table_row_quay_base_details on stops_database_quay_newest_version {
    id
    netex_id

    stop_place {
      name_lang
      name_value

      stop_place_alternative_names {
        alternative_name {
          name_lang
          name_type
          name_value
        }
      }
    }
  }
`;

const GQL_STOP_TABLE_ROW_QUAY = gql`
  fragment stop_table_row_quay on stops_database_quay_newest_version {
    ...stop_table_row_quay_base_details
    scheduled_stop_point_instance {
      ...stop_table_row
    }
  }
`;

const GQL_SEARCH_STOPS = gql`
  query SearchStops(
    $where: stops_database_quay_newest_version_bool_exp
    $orderBy: [stops_database_quay_newest_version_order_by!]!
    $offset: Int!
    $limit: Int!
  ) {
    stops_database {
      stops: stops_database_quay_newest_version(
        where: $where
        order_by: $orderBy
        offset: $offset
        limit: $limit
      ) {
        ...stop_table_row_quay
      }

      resultCount: stops_database_quay_newest_version_aggregate(where: $where) {
        aggregate {
          count
        }
      }
    }
  }
`;

function sortOrderToOrderBy(sortOrder: SortOrder) {
  if (sortOrder === SortOrder.ASCENDING) {
    return OrderBy.Asc;
  }

  return OrderBy.Desc;
}

function getOrderBy({
  sortBy,
  sortOrder,
}: SortingInfo): Array<StopsDatabaseQuayNewestVersionOrderBy> {
  const direction = sortOrderToOrderBy(sortOrder);
  const byPublicCode: StopsDatabaseQuayNewestVersionOrderBy = {
    public_code: direction,
  };

  switch (sortBy) {
    case SortStopsBy.DEFAULT:
    case SortStopsBy.LABEL:
      return [byPublicCode];

    case SortStopsBy.ADDRESS:
      return [{ street_address: direction }, byPublicCode];

    case SortStopsBy.NAME:
      return [{ stop_place: { name_value: direction } }, byPublicCode];

    default:
      return [{ id: direction }];
  }
}

type LimitAndOffset = {
  readonly limit: number;
  readonly offset: number;
};

function pagingInfoToLimitAndOffset({
  page,
  pageSize,
}: PagingInfo): LimitAndOffset {
  return {
    limit: pageSize,
    offset: (page - 1) * pageSize,
  };
}

type UseStopSearchResultsParams = {
  readonly pagingInfo: PagingInfo;
  readonly skip: boolean;
  readonly sortingInfo: SortingInfo;
  readonly where: StopsDatabaseQuayNewestVersionBoolExp;
};

export const useStopSearchResults = ({
  pagingInfo,
  skip,
  sortingInfo,
  where,
}: UseStopSearchResultsParams) => {
  const { data, ...rest } = useSearchStopsQuery({
    variables: {
      where,
      orderBy: getOrderBy(sortingInfo),
      ...pagingInfoToLimitAndOffset(pagingInfo),
    },
    skip,
  });

  const stopSearchRows: ReadonlyArray<StopSearchRow> = useMemo(() => {
    if (!data?.stops_database?.stops) {
      return [];
    }

    return mapQueryResultToStopSearchRows(data.stops_database.stops);
  }, [data]);

  return {
    ...rest,
    resultCount: data?.stops_database?.resultCount.aggregate?.count ?? 0,
    stops: stopSearchRows,
  };
};
