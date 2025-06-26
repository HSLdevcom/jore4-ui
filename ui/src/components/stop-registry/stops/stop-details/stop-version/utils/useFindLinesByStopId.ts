import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useFindLinesByStopQuery } from '../../../../../../generated/graphql';
import { LinesByStop } from '../types/LinesByStopResult';

const GQL_FIND_LINES_BY_STOP_PLACE_REF = gql`
  query FindLinesByStop($stopPlaceId: String!, $validOn: date!) {
    service_pattern_scheduled_stop_point(
      where: {
        stop_place_ref: { _eq: $stopPlaceId }
        validity_start: { _lte: $validOn }
        _or: [
          { validity_end: { _gte: $validOn } }
          { validity_end: { _is_null: true } }
        ]
      }
      distinct_on: [label, priority]
      order_by: { label: asc, priority: desc }
    ) {
      ...StopPointDetails
      ...JourneyRouteInfo
    }
  }

  fragment StopPointDetails on service_pattern_scheduled_stop_point {
    stop_place_ref
    label
    priority
    validity_start
    validity_end
    scheduled_stop_point_id
  }

  fragment JourneyRouteInfo on service_pattern_scheduled_stop_point {
    scheduled_stop_point_in_journey_patterns(
      where: {
        journey_pattern: {
          journey_pattern_route: {
            validity_start: { _lte: $validOn }
            _or: [
              { validity_end: { _gte: $validOn } }
              { validity_end: { _is_null: true } }
            ]
          }
        }
      }
    ) {
      journey_pattern_id
      scheduled_stop_point_sequence
      journey_pattern {
        journey_pattern_id
        journey_pattern_route {
          ...JourneyPatternRoute
        }
      }
    }
  }

  fragment JourneyPatternRoute on route_route {
    label
    priority
    validity_start
    validity_end
    route_id
  }
`;

type FindLinesByStopLabelProps = {
  readonly stopPlaceId: string | null | undefined;
  readonly validOn: DateTime;
  readonly skip: boolean;
};

export function useFindLinesByStopId({
  stopPlaceId,
  validOn,
  skip,
}: FindLinesByStopLabelProps) {
  const { data, ...rest } = useFindLinesByStopQuery(
    stopPlaceId
      ? {
          variables: { stopPlaceId, validOn },
          fetchPolicy: 'network-only',
          skip,
        }
      : { skip: true },
  );

  const stopPoints = data?.service_pattern_scheduled_stop_point;

  if (!stopPoints || stopPoints.length === 0) {
    return { ...rest, lines: [] };
  }

  const highestPriorityStopPoint = stopPoints.reduce(
    (maxPriorityStopPoint, currentStopPoint) => {
      return currentStopPoint.priority > maxPriorityStopPoint.priority
        ? currentStopPoint
        : maxPriorityStopPoint;
    },
  );

  const highestPriorityLinesMap =
    highestPriorityStopPoint.scheduled_stop_point_in_journey_patterns.reduce(
      (acc, stopPointInPattern) => {
        const route = stopPointInPattern.journey_pattern.journey_pattern_route;

        if (route) {
          const existingLine = acc.get(route.label);
          if (!existingLine || route.priority > existingLine.priority) {
            acc.set(route.label, route);
          }
        }

        return acc;
      },
      new Map<string, LinesByStop>(),
    );

  const lines: LinesByStop[] = Array.from(
    highestPriorityLinesMap.values(),
  ).sort((a, b) => {
    const numA = parseInt(a.label, 10);
    const numB = parseInt(b.label, 10);

    // Sort lines so numerically from smallest to largest so that the lines with letters are also sorted correctly
    return numA !== numB ? numA - numB : a.label.localeCompare(b.label);
  });

  return { ...rest, lines };
}
