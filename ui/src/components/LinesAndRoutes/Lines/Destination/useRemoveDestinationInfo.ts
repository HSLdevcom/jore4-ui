import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRemoveScheduledStopPointDestinationInfoMutation } from '../../../../generated/graphql';

const GQL_REMOVE_SCHEDULED_STOP_POINT_DESTINATION_INFO = gql`
  mutation RemoveScheduledStopPointDestinationInfo(
    $journeyPatternId: uuid!
    $stopLabel: String!
  ) {
    update_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        journey_pattern_id: { _eq: $journeyPatternId }
        scheduled_stop_point_label: { _eq: $stopLabel }
      }
      _set: {
        is_destination_point: false
        destination_point_name_i18n: null
        destination_point_short_name_i18n: null
      }
    ) {
      affected_rows
      returning {
        ...ScheduledStopPointInJourneyPatternAllFields
      }
    }
  }
`;

type RemoveParams = {
  readonly journeyPatternId: UUID;
  readonly stopLabel: string;
};

export function useRemoveDestinationInfo() {
  const { t } = useTranslation();
  const [removeDestinationInfo] =
    useRemoveScheduledStopPointDestinationInfoMutation();

  return useCallback(
    async (variables: RemoveParams) => {
      const result = await removeDestinationInfo({ variables });
      if (
        !result.data
          ?.update_journey_pattern_scheduled_stop_point_in_journey_pattern
          ?.affected_rows
      ) {
        throw new Error(t(($) => $.destinationModal.stopNotFound));
      }
      return result;
    },
    [removeDestinationInfo, t],
  );
}
