import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { usePatchScheduledStopPointTimingSettingsMutation } from '../../../../generated/graphql';
import { FormState } from './TimingSettingsForm';

const GQL_PATCH_SCHEDULED_STOP_POINT_TIMING_SETTINGS = gql`
  mutation PatchScheduledStopPointTimingSettings(
    $stopLabel: String!
    $journeyPatternId: uuid!
    $sequence: Int!
    $patch: journey_pattern_scheduled_stop_point_in_journey_pattern_set_input!
    $stopId: uuid!
    $timingPlaceId: uuid
  ) {
    update_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stopId } }
      _set: { timing_place_id: $timingPlaceId }
    ) {
      returning {
        scheduled_stop_point_id
        timing_place_id
        timing_place {
          timing_place_id
        }
      }
    }

    update_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        scheduled_stop_point_label: { _eq: $stopLabel }
        scheduled_stop_point_sequence: { _eq: $sequence }
        journey_pattern_id: { _eq: $journeyPatternId }
      }
      _set: $patch
    ) {
      returning {
        ...ScheduledStopPointInJourneyPatternAllFields
      }
    }
  }
`;

type EditParams = {
  readonly form: FormState;
  readonly journeyPatternId: UUID;
  readonly stopLabel: string;
  readonly sequence: number;
  readonly stopId: UUID;
};

export function useEditStopTimingSetting() {
  const [updateTimingSettings] =
    usePatchScheduledStopPointTimingSettingsMutation();

  return useCallback(
    ({ form, journeyPatternId, stopLabel, sequence, stopId }: EditParams) =>
      updateTimingSettings({
        variables: {
          journeyPatternId,
          stopLabel,
          sequence,
          patch: {
            is_used_as_timing_point: form.isUsedAsTimingPoint,
            is_regulated_timing_point: form.isRegulatedTimingPoint,
            is_loading_time_allowed: form.isLoadingTimeAllowed,
          },
          stopId,
          timingPlaceId: form.timingPlaceId,
        },
      }),
    [updateTimingSettings],
  );
}
