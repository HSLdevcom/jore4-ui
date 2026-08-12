import { gql, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import {
  GetOverlappingStopVersionsDocument,
  GetOverlappingStopVersionsQuery,
  GetOverlappingStopVersionsQueryVariables,
  ServicePatternScheduledStopPointBoolExp,
} from '../../../../../../generated/graphql';
import { parseDate } from '../../../../../../time';
import { OverlappingStopVersionResult } from '../types/OverlappingStopVersionResult';

const GQL_GET_OVERLAPPING_STOP_VERSIONS_QUERY = gql`
  query GetOverlappingStopVersions(
    $where: service_pattern_scheduled_stop_point_bool_exp!
  ) {
    ssps: service_pattern_scheduled_stop_point(
      where: $where
      order_by: [{ validity_start: asc }]
    ) {
      ...OverlappingStopVersionsData
    }
  }

  fragment OverlappingStopVersionsData on service_pattern_scheduled_stop_point {
    scheduled_stop_point_id
    label
    priority
    stop_place_ref
    validity_start
    validity_end
    stop_place {
      id
      version
    }
  }
`;

type GetOverlappingStopVersionsParams = {
  readonly stopLabel: string;
  readonly currentStopId: string;
  readonly priority: number;
  readonly fromDate: string;
  readonly toDate: string | undefined;
  readonly indefinite: boolean;
};

function getDateConditions({
  fromDate,
  toDate,
  indefinite,
}: Pick<
  GetOverlappingStopVersionsParams,
  'fromDate' | 'toDate' | 'indefinite'
>): ServicePatternScheduledStopPointBoolExp {
  if (!indefinite && !toDate) {
    throw new Error('If indefinite is false, then toDate must be defined!');
  }

  const parsedFromDate = parseDate(fromDate);
  const parsedToDate = indefinite ? null : parseDate(toDate);

  const dbItemEndsBeforeNew: ServicePatternScheduledStopPointBoolExp = {
    validity_end: { _lt: parsedFromDate },
  };

  if (parsedToDate) {
    const dbItemStartsAfterNew: ServicePatternScheduledStopPointBoolExp = {
      validity_start: { _gt: parsedToDate },
    };

    // If the DB item ends before this new one begins, or if it only starts
    // after the new one ends, then they do not have any overlap.
    // Thus, the negative of that implies an overlap.
    return { _not: { _or: [dbItemEndsBeforeNew, dbItemStartsAfterNew] } };
  }

  // New item does not end before new one.
  // -> So it either begins at or after the new one, which is valid indefinitely.
  return { _not: dbItemEndsBeforeNew };
}

function getWhere({
  stopLabel,
  currentStopId,
  priority,
  ...dateParams
}: GetOverlappingStopVersionsParams): ServicePatternScheduledStopPointBoolExp {
  return {
    label: { _eq: stopLabel },
    stop_place_ref: { _neq: currentStopId },
    priority: { _eq: priority },
    ...getDateConditions(dateParams),
  };
}

export function useGetOverlappingStopVersions() {
  const apollo = useApolloClient();

  return useCallback(
    async (
      params: GetOverlappingStopVersionsParams,
    ): Promise<ReadonlyArray<OverlappingStopVersionResult>> => {
      const { data } = await apollo.query<
        GetOverlappingStopVersionsQuery,
        GetOverlappingStopVersionsQueryVariables
      >({
        query: GetOverlappingStopVersionsDocument,
        fetchPolicy: 'network-only',
        variables: { where: getWhere(params) },
      });

      return data.ssps;
    },
    [apollo],
  );
}
