import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePatchScheduledStopPointDestinationInfoMutation } from '../../../../generated/graphql';
import { DestinationFormState } from './DestinationForm';

const GQL_PATCH_SCHEDULED_STOP_POINT_DESTINATION_INFO = gql`
  mutation PatchScheduledStopPointDestinationInfo(
    $journeyPatternId: uuid!
    $stopLabel: String!
    $patch: journey_pattern_scheduled_stop_point_in_journey_pattern_set_input!
  ) {
    update_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        journey_pattern_id: { _eq: $journeyPatternId }
        scheduled_stop_point_label: { _eq: $stopLabel }
      }
      _set: $patch
    ) {
      affected_rows
      returning {
        ...ScheduledStopPointInJourneyPatternAllFields
      }
    }
  }
`;

type EditParams = {
  readonly form: DestinationFormState;
  readonly journeyPatternId: UUID;
  readonly stopLabel: string;
};

export function useEditDestinationInfo() {
  const { t } = useTranslation();
  const [updateDestinationInfo] =
    usePatchScheduledStopPointDestinationInfoMutation();

  return useCallback(
    async ({ form, journeyPatternId, stopLabel }: EditParams) => {
      const result = await updateDestinationInfo({
        variables: {
          journeyPatternId,
          stopLabel,
          patch: {
            is_destination_point: true,
            destination_point_name_i18n: form.name,
            destination_point_short_name_i18n: form.shortName,
          },
        },
      });
      if (
        !result.data
          ?.update_journey_pattern_scheduled_stop_point_in_journey_pattern
          ?.affected_rows
      ) {
        throw new Error(t(($) => $.destinationModal.stopNotFound));
      }
      return result;
    },
    [updateDestinationInfo, t],
  );
}
