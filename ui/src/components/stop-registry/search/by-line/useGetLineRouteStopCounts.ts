import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useGetLineRouteStopCountsQuery } from '../../../../generated/graphql';

const GQL_GET_LINE_ROUTE_STOP_COUNTS = gql`
  query GetLineRouteStopCounts($inboundRoute: uuid!, $outboundRoute: uuid!) {
    combinedStopPoints: service_pattern_scheduled_stop_point_aggregate(
      where: {
        scheduled_stop_point_in_journey_patterns: {
          journey_pattern: {
            on_route_id: { _in: [$inboundRoute, $outboundRoute] }
          }
        }
      }
      distinct_on: [label]
    ) {
      aggregate {
        count
      }
    }

    inboundStopPoints: service_pattern_scheduled_stop_point_aggregate(
      where: {
        scheduled_stop_point_in_journey_patterns: {
          journey_pattern: { on_route_id: { _eq: $inboundRoute } }
        }
      }
      distinct_on: [label]
    ) {
      aggregate {
        count
      }
    }

    outboundStopPoints: service_pattern_scheduled_stop_point_aggregate(
      where: {
        scheduled_stop_point_in_journey_patterns: {
          journey_pattern: { on_route_id: { _eq: $outboundRoute } }
        }
      }
      distinct_on: [label]
    ) {
      aggregate {
        count
      }
    }
  }
`;

// Number.isFinite does not assert type 🤦🏻
function isFiniteNumber(value: unknown): value is number {
  return Number.isFinite(value);
}

type LineRouteStopCounts = {
  readonly all: number;
  readonly inbound: number;
  readonly outbound: number;
};

export function useGetLineRouteStopCounts(
  inboundRoute: UUID | null,
  outboundRoute: UUID | null,
) {
  const { data, ...rest } = useGetLineRouteStopCountsQuery(
    inboundRoute && outboundRoute
      ? { variables: { inboundRoute, outboundRoute } }
      : { skip: true },
  );

  const counts = useMemo<LineRouteStopCounts | null>(() => {
    const all = data?.combinedStopPoints.aggregate?.count;
    const inbound = data?.inboundStopPoints.aggregate?.count;
    const outbound = data?.outboundStopPoints.aggregate?.count;

    if (
      isFiniteNumber(all) &&
      isFiniteNumber(inbound) &&
      isFiniteNumber(outbound)
    ) {
      return { all, inbound, outbound };
    }

    return null;
  }, [data]);

  return { ...rest, counts };
}
