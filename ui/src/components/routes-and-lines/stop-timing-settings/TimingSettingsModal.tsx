import { gql } from '@apollo/client';
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
import { showDangerToastWithError, showSuccessToast } from '../../../utils';
import { ModalHeader } from '../../modal';
import {
  FormState,
  TimingSettingsForm,
  mapStopJourneyPatternToFormState,
} from './TimingSettingsForm';

interface Props {
  className?: string;
}

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

export const TimingSettingsModal = ({ className = '' }: Props): JSX.Element => {
  const { t } = useTranslation();
  const timingSettingsModalState = useAppSelector(selectTimingSettingsModal);
  const { journeyPatternId, stopLabel, sequence } = timingSettingsModalState;
  const dispatch = useAppDispatch();

  const { prepareAndExecute: prepareAndExecuteEdit } =
    useEditStopTimingSetting();

  const scheduledStopResult = useGetScheduledStopPointWithTimingSettingsQuery({
    variables: {
      // if the timing settings modal is open, we know that journeyPatternId, stopLabel and sequence are set
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      journeyPatternId: journeyPatternId!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stopLabel: stopLabel!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      sequence: sequence!,
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
      });

      dispatch(closeTimingSettingsModalAction());
      showSuccessToast(t('timingSettingsModal.saveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  const onClose = () => {
    dispatch(closeTimingSettingsModalAction());
  };

  const stopHasTimingPlace = !!stopInfo?.scheduled_stop_points?.every(
    (stop) => stop.timing_place_id,
  );

  return (
    <div
      className={`fixed top-1/2 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2 overflow-auto overflow-y-auto bg-white shadow-md ${className}`}
    >
      <ModalHeader
        onClose={onClose}
        heading={t('timingSettingsModal.timingSettingsModalTitle', {
          label: stopInfo?.scheduled_stop_point_label,
        })}
      />
      {stopInfo && (
        <TimingSettingsForm
          stopHasTimingPlace={stopHasTimingPlace}
          className="p-8"
          onCancel={onClose}
          onSubmit={(formState) => onSubmit(formState, stopInfo)}
          defaultValues={mapStopJourneyPatternToFormState(stopInfo)}
        />
      )}
    </div>
  );
};
