import { gql } from '@apollo/client';
import { useGetScheduledStopPointsInJourneyPatternsUsedAsTimingPointsLazyQuery } from '../../../../generated/graphql';
import {
  TimingPlaceRequiredError,
  getRouteLabelVariantText,
} from '../../../../utils';

const GQL_GET_SCHEDULED_STOP_POINTS_IN_JOURNEY_PATTERNS_USED_AS_TIMING_POINTS = gql`
  query GetScheduledStopPointsInJourneyPatternsUsedAsTimingPoints(
    $label: String!
  ) {
    journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        is_used_as_timing_point: { _eq: true }
        scheduled_stop_points: { label: { _eq: $label } }
      }
    ) {
      journey_pattern_id
      scheduled_stop_point_label
      scheduled_stop_point_sequence
      journey_pattern {
        journey_pattern_id
        on_route_id
        journey_pattern_route {
          route_id
          label
          variant
        }
      }
    }
  }
`;

type Params = {
  readonly stopLabel: string;
  readonly timingPlaceId?: UUID | null;
};

/**
 * Hook for validating timing settings (is used as timing place?) for each journey pattern that
 * the stop belongs to.
 * E.g. if the stop is used as timing point in a journey pattern but user tries to remove timing place
 * attached to the stop, an error will be thrown. Only stops that have timing place can be used as timing place.
 */
export const useValidateTimingSettings = () => {
  const [getScheduledStopPointsInJourneyPatternsUsedAsTimingPoints] =
    useGetScheduledStopPointsInJourneyPatternsUsedAsTimingPointsLazyQuery();

  const validateTimingSettings = async ({
    stopLabel,
    timingPlaceId,
  }: Params) => {
    // If timing place is set, no error can happen here, just return
    if (timingPlaceId) {
      return;
    }

    const timingPointScheduledStopPoints =
      await getScheduledStopPointsInJourneyPatternsUsedAsTimingPoints({
        variables: {
          label: stopLabel,
        },
      });

    const routesUsingStopAsTimingPoint =
      timingPointScheduledStopPoints.data?.journey_pattern_scheduled_stop_point_in_journey_pattern.map(
        // journey pattern and route info is always defined and fetched for a stop in journey pattern
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (stop) => stop.journey_pattern.journey_pattern_route!,
      );

    // As timing place has been set to null and there are routes using stop as timing point, throw an error
    if (routesUsingStopAsTimingPoint?.length) {
      throw new TimingPlaceRequiredError(
        routesUsingStopAsTimingPoint
          .map((route) => getRouteLabelVariantText(route))
          .join(', '),
      );
    }
  };

  return [validateTimingSettings];
};
