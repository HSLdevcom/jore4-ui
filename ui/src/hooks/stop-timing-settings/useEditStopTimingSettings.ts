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

type EditParams = {
  readonly form: FormState;
  readonly journeyPatternId: UUID;
  readonly stopLabel: string;
  readonly sequence: number;
  readonly stopId: UUID;
};

type EditChanges = {
  readonly journeyPatternId: UUID;
  readonly stopLabel: string;
  readonly sequence: number;
  readonly patch: TimingSettingsPatch;
  readonly stopId: UUID;
  readonly timingPlaceId: UUID | null;
};

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
    stopId,
  }: EditParams): EditChanges => ({
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
  });

  const mapChangesToVariables = ({
    journeyPatternId,
    stopLabel,
    patch,
    sequence,
    stopId,
    timingPlaceId,
  }: EditChanges): PatchScheduledStopPointTimingSettingsMutationVariables => ({
    journeyPatternId,
    stopLabel,
    sequence,
    patch,
    stopId,
    timingPlaceId,
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
