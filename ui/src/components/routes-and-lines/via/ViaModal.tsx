import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  JourneyPatternScheduledStopPointInJourneyPattern,
  useGetScheduledStopPointWithViaInfoQuery,
} from '../../../generated/graphql';
import { mapGetScheduledStopPointWithViaInfo as mapGetScheduledStopPointWithViaInfoResult } from '../../../graphql';
import {
  useAppDispatch,
  useAppSelector,
  useEditViaInfo,
  useRemoveViaInfo,
} from '../../../hooks';
import { selectViaModal } from '../../../redux';
import { closeViaModalAction } from '../../../redux/slices/modals';
import { showDangerToastWithError, showSuccessToast } from '../../../utils';
import { ModalHeader } from '../../modal';
import {
  FormState,
  mapStopJourneyPatternToFormState,
  ViaForm,
} from './ViaForm';

interface Props {
  className?: string;
}

export const ViaModal = ({ className = '' }: Props): JSX.Element => {
  const { t } = useTranslation();
  const viaModalState = useAppSelector(selectViaModal);
  const { journeyPatternId, stopLabel } = viaModalState;
  const dispatch = useAppDispatch();

  const { prepareAndExecute: prepareAndExecuteEdit } = useEditViaInfo();
  const { prepareAndExecute: prepareAndExecuteRemove } = useRemoveViaInfo();

  const scheduledStopResult = useGetScheduledStopPointWithViaInfoQuery({
    variables: {
      // if the via modal is open, we know that journeyPatternId and scheduledStopPointSequence are set
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      journeyPatternId: journeyPatternId!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stopLabel: stopLabel!,
    },
  });
  const stopInfo =
    mapGetScheduledStopPointWithViaInfoResult(scheduledStopResult);

  const onSubmit = async (
    form: FormState,
    stopJourneyPattern: JourneyPatternScheduledStopPointInJourneyPattern,
  ) => {
    try {
      await prepareAndExecuteEdit({
        form,
        journeyPatternId: stopJourneyPattern.journey_pattern_id,
        stopLabel: stopJourneyPattern.scheduled_stop_point_label,
      });

      dispatch(closeViaModalAction());
      showSuccessToast(t('viaModal.viaSaveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  const onRemove = async (
    stopJourneyPattern: JourneyPatternScheduledStopPointInJourneyPattern,
  ) => {
    try {
      await prepareAndExecuteRemove({
        journeyPatternId: stopJourneyPattern.journey_pattern_id,
        stopLabel: stopJourneyPattern.scheduled_stop_point_label,
      });

      dispatch(closeViaModalAction());
      showSuccessToast(t('viaModal.viaRemoveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  const onClose = () => {
    dispatch(closeViaModalAction());
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2 overflow-auto overflow-y-auto bg-white drop-shadow-md ${className}`}
    >
      <ModalHeader
        onClose={onClose}
        heading={t('viaModal.viaModalTitle', {
          label: stopInfo?.journey_pattern.journey_pattern_route?.label,
        })}
      />
      {stopInfo && (
        <ViaForm
          className="p-8"
          onCancel={onClose}
          onSubmit={(formState) => onSubmit(formState, stopInfo)}
          onRemove={() => onRemove(stopInfo)}
          defaultValues={mapStopJourneyPatternToFormState(stopInfo)}
        />
      )}
    </div>
  );
};
