import { gql } from '@apollo/client';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScheduledStopPointWithTimingSettingsFragment,
  useGetScheduledStopPointWithTimingSettingsQuery,
} from '../../../generated/graphql';
import {
  useAppDispatch,
  useAppSelector,
  useEditStopTimingSetting,
} from '../../../hooks';
import { selectTimingSettingsModal } from '../../../redux';
import { closeTimingSettingsModalAction } from '../../../redux/slices/modals';
import { Modal, ModalHeader } from '../../../uiComponents';
import { showDangerToastWithError, showSuccessToast } from '../../../utils';
import { useWrapInContextNavigation } from '../../forms/common/NavigationBlocker';
import {
  FormState,
  TimingSettingsForm,
  mapStopJourneyPatternToFormState,
} from './TimingSettingsForm';

const GQL_SCHEDULED_STOP_POINT_WITH_TIMING_SETTINGS = gql`
  fragment scheduled_stop_point_with_timing_settings on journey_pattern_scheduled_stop_point_in_journey_pattern {
    ...scheduled_stop_point_in_journey_pattern_all_fields
    journey_pattern {
      journey_pattern_id
      journey_pattern_route {
        route_id
        label
      }
    }
    scheduled_stop_points {
      scheduled_stop_point_id
      timing_place_id
    }
  }
`;

const GQL_GET_SCHEDULED_STOP_POINT_WITH_TIMING_SETTINGS = gql`
  query GetScheduledStopPointWithTimingSettings(
    $journeyPatternId: uuid!
    $stopLabel: String!
    $sequence: Int!
  ) {
    journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        journey_pattern_id: { _eq: $journeyPatternId }
        scheduled_stop_point_label: { _eq: $stopLabel }
        scheduled_stop_point_sequence: { _eq: $sequence }
      }
    ) {
      ...scheduled_stop_point_with_timing_settings
    }
  }
`;

export const TimingSettingsModal: FC = () => {
  const { t } = useTranslation();
  const wrapInContextNavigation =
    useWrapInContextNavigation('TimingSettingsForm');

  const timingSettingsModalState = useAppSelector(selectTimingSettingsModal);
  const { data: timingSettings } = timingSettingsModalState;
  // if the timing settings modal is open, we know that timingSettings fields are set
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { journeyPatternId, stopLabel, sequence } = timingSettings!;

  const dispatch = useAppDispatch();

  const { prepareAndExecute: prepareAndExecuteEdit } =
    useEditStopTimingSetting();

  const scheduledStopResult = useGetScheduledStopPointWithTimingSettingsQuery({
    variables: {
      journeyPatternId,
      stopLabel,
      sequence,
    },
  });

  const stopInfo =
    scheduledStopResult.data
      ?.journey_pattern_scheduled_stop_point_in_journey_pattern[0];
  const onSubmit = async (
    form: FormState,
    stopJourneyPattern: ScheduledStopPointWithTimingSettingsFragment,
  ) => {
    try {
      await prepareAndExecuteEdit({
        form,
        journeyPatternId: stopJourneyPattern.journey_pattern_id,
        stopLabel: stopJourneyPattern.scheduled_stop_point_label,
        sequence: stopJourneyPattern.scheduled_stop_point_sequence,
        stopId:
          stopJourneyPattern.scheduled_stop_points[0].scheduled_stop_point_id,
      });

      dispatch(closeTimingSettingsModalAction());
      showSuccessToast(t('timingSettingsModal.saveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  const onCancel = () => dispatch(closeTimingSettingsModalAction());
  const onClose = wrapInContextNavigation(onCancel);

  return (
    <Modal isOpen onClose={onClose}>
      <ModalHeader
        onClose={onClose}
        heading={t('timingSettingsModal.timingSettingsModalTitle', {
          label: stopInfo?.scheduled_stop_point_label,
        })}
      />
      {stopInfo && (
        <TimingSettingsForm
          className="p-8"
          onCancel={onCancel}
          onSubmit={(formState) => onSubmit(formState, stopInfo)}
          defaultValues={mapStopJourneyPatternToFormState(stopInfo)}
        />
      )}
    </Modal>
  );
};
