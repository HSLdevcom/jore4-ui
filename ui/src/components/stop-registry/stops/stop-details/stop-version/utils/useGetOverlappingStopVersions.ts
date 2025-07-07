import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import {
  useGetOverlappingStopVersionsIndefiniteLazyQuery,
  useGetOverlappingStopVersionsLazyQuery,
} from '../../../../../../generated/graphql';
import { OverlappingStopVersionResult } from '../types/overlappingStopVersionsResult';

const GQL_GET_OVERLAPPING_STOP_VERSIONS_QUERY = gql`
  query GetOverlappingStopVersions(
    $stopLabel: String!
    $currentStopId: String!
    $priority: Int!
    $fromDate: date!
    $toDate: date!
  ) {
    service_pattern_scheduled_stop_point(
      where: {
        label: { _eq: $stopLabel }
        stop_place_ref: { _neq: $currentStopId }
        priority: { _eq: $priority }
        validity_start: { _lte: $toDate }
        _or: [
          { validity_end: { _gte: $fromDate } }
          { validity_end: { _is_null: true } }
        ]
      }
    ) {
      ...OverlappingStopVersionsData
    }
  }

  query GetOverlappingStopVersionsIndefinite(
    $stopLabel: String!
    $currentStopId: String!
    $priority: Int!
    $fromDate: date!
  ) {
    service_pattern_scheduled_stop_point(
      where: {
        label: { _eq: $stopLabel }
        stop_place_ref: { _neq: $currentStopId }
        priority: { _eq: $priority }
        _not: { validity_end: { _lt: $fromDate } }
      }
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
    }
  }
`;

export function useGetOverlappingStopVersions() {
  const [getOverlappingStopVersions] = useGetOverlappingStopVersionsLazyQuery();
  const [getOverlappingStopVersionsIndefinite] =
    useGetOverlappingStopVersionsIndefiniteLazyQuery();

  return useCallback(
    async (
      stopLabel: string,
      currentStopId: string,
      priority: number,
      fromDate: string,
      toDate?: string,
      indefinite?: boolean,
    ): Promise<{
      overlappingStopVersions: ReadonlyArray<OverlappingStopVersionResult>;
    }> => {
      let overlappingStopVersions: OverlappingStopVersionResult[] = [];

      const fromDateTime = DateTime.fromISO(fromDate);
      const toDateTime =
        toDate && !indefinite ? DateTime.fromISO(toDate) : undefined;

      if (toDateTime) {
        const { data } = await getOverlappingStopVersions({
          variables: {
            stopLabel,
            currentStopId,
            priority,
            fromDate: fromDateTime,
            toDate: toDateTime,
          },
          fetchPolicy: 'network-only',
        });

        if (data && data?.service_pattern_scheduled_stop_point.length > 0) {
          overlappingStopVersions = data.service_pattern_scheduled_stop_point;
        }
      } else {
        const { data } = await getOverlappingStopVersionsIndefinite({
          variables: {
            stopLabel,
            currentStopId,
            priority,
            fromDate: fromDateTime,
          },
          fetchPolicy: 'network-only',
        });

        if (data && data?.service_pattern_scheduled_stop_point.length > 0) {
          overlappingStopVersions = data.service_pattern_scheduled_stop_point;
        }
      }

      return {
        overlappingStopVersions,
      };
    },
    [getOverlappingStopVersions, getOverlappingStopVersionsIndefinite],
  );
}
