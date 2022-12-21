import { gql } from '@apollo/client';
import { FormState } from '../../components/routes-and-lines/stop-timing-settings/TimingSettingsForm';
import {
  JourneyPatternScheduledStopPointInJourneyPatternSetInput,
  PatchScheduledStopPointTimingSettingsMutationVariables,
  usePatchScheduledStopPointTimingSettingsMutation,
} from '../../generated/graphql';
import { MutationHook, extendHook } from '../mutationHook';

type TimingSettingsPatch = Pick<
  JourneyPatternScheduledStopPointInJourneyPatternSetInput,
  | 'is_loading_time_allowed'
  | 'is_regulated_timing_point'
  | 'is_used_as_timing_point'
>;

interface EditParams {
  form: FormState;
  journeyPatternId: UUID;
  stopLabel: string;
  sequence: number;
}

interface EditChanges {
  journeyPatternId: UUID;
  stopLabel: string;
  sequence: number;
  patch: TimingSettingsPatch;
}

const GQL_PATCH_SCHEDULED_STOP_POINT_TIMING_SETTINGS = gql`
  mutation PatchScheduledStopPointTimingSettings(
    $stopLabel: String!
    $journeyPatternId: uuid!
    $sequence: Int!
    $patch: journey_pattern_scheduled_stop_point_in_journey_pattern_set_input!
  ) {
    update_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        scheduled_stop_point_label: { _eq: $stopLabel }
        scheduled_stop_point_sequence: { _eq: $sequence }
        journey_pattern_id: { _eq: $journeyPatternId }
      }
      _set: $patch
    ) {
      returning {
        ...scheduled_stop_point_in_journey_pattern_all_fields
      }
    }
  }
`;

const useEditStopTimingSettingsHook: MutationHook<
  EditParams,
  EditChanges,
  PatchScheduledStopPointTimingSettingsMutationVariables
> = () => {
  const [updateTimingSettings] =
    usePatchScheduledStopPointTimingSettingsMutation();

  const prepare = ({
    form,
    journeyPatternId,
    stopLabel,
    sequence,
  }: EditParams): EditChanges => ({
    journeyPatternId,
    stopLabel,
    sequence,
    patch: {
      is_used_as_timing_point: form.isUsedAsTimingPoint,
      is_regulated_timing_point: form.isRegulatedTimingPoint,
      is_loading_time_allowed: form.isLoadingTimeAllowed,
    },
  });

  const mapChangesToVariables = ({
    journeyPatternId,
    stopLabel,
    patch,
    sequence,
  }: EditChanges): PatchScheduledStopPointTimingSettingsMutationVariables => ({
    journeyPatternId,
    stopLabel,
    sequence,
    patch,
  });

  const executeMutation = (
    variables: PatchScheduledStopPointTimingSettingsMutationVariables,
  ) =>
    updateTimingSettings({
      variables,
    });

  return {
    prepare,
    mapChangesToVariables,
    executeMutation,
  };
};

export const useEditStopTimingSetting = extendHook(
  useEditStopTimingSettingsHook,
);
