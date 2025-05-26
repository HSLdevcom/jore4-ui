import { FC } from 'react';
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
import { Modal, ModalBody, ModalHeader } from '../../../uiComponents';
import { showDangerToastWithError, showSuccessToast } from '../../../utils';
import {
  FormState,
  ViaForm,
  mapStopJourneyPatternToFormState,
} from './ViaForm';

type ViaModalProps = {
  readonly className?: string;
};

export const ViaModal: FC<ViaModalProps> = ({ className = '' }) => {
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
    <Modal isOpen onClose={onClose} contentClassName={className}>
      <ModalHeader
        onClose={onClose}
        heading={t('viaModal.viaModalTitle', {
          label: stopInfo?.journey_pattern.journey_pattern_route?.label,
        })}
      />
      {stopInfo && (
        <ModalBody>
          <ViaForm
            onCancel={onClose}
            onSubmit={(formState) => onSubmit(formState, stopInfo)}
            onRemove={() => onRemove(stopInfo)}
            defaultValues={mapStopJourneyPatternToFormState(stopInfo)}
          />
        </ModalBody>
      )}
    </Modal>
  );
};
