import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  selectChangeTimetableValidityModal,
  setChangeTimetableValidityModalSuccessResultAction,
} from '../../../redux';
import { mapToISODate } from '../../../time';
import { Modal, ModalBody, ModalHeader } from '../../../uiComponents';
import {
  showDangerToastWithError,
  showSuccessToast,
} from '../../../utils/toastService';
import { useWrapInContextNavigation } from '../../forms/common/NavigationBlocker';
import {
  ChangeTimetablesValidityForm,
  FormState,
} from './ChangeTimetablesValidityForm';
import { useVehicleScheduleFrameValidity } from './useVehicleScheduleFrameValidity';

type ChangeTimetablesValidityModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onChange?: () => void;
  readonly className?: string;
};

export const ChangeTimetablesValidityModal: FC<
  ChangeTimetablesValidityModalProps
> = ({ isOpen, onClose, onChange, className = '' }) => {
  const { t } = useTranslation();
  const wrappedOnClose = useWrapInContextNavigation(
    'ChangeTimetablesValidityForm',
  )(onClose);

  const dispatch = useAppDispatch();
  const changeTimetableValidityModalState = useAppSelector(
    selectChangeTimetableValidityModal,
  );
  const { vehicleScheduleFrame, affectedRouteLabels, updateValidity } =
    useVehicleScheduleFrameValidity(
      changeTimetableValidityModalState.vehicleScheduleFrameId,
    );

  const onSave = async (state: FormState) => {
    try {
      const { vehicleScheduleFrameId } = changeTimetableValidityModalState;
      await updateValidity(state.validityStart, state.validityEnd);

      showSuccessToast(t('changeTimetablesValidityModal.saveSuccess'));

      if (vehicleScheduleFrameId) {
        dispatch(
          setChangeTimetableValidityModalSuccessResultAction({
            vehicleScheduleFrameId,
            validityStart: state.validityStart,
            validityEnd: state.validityEnd,
          }),
        );
      }
      if (onChange) {
        onChange();
      }
      onClose();
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  if (!vehicleScheduleFrame) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={wrappedOnClose}
      contentClassName={className}
    >
      <ModalHeader
        onClose={wrappedOnClose}
        heading={t('changeTimetablesValidityModal.title')}
      />
      <ModalBody>
        <ChangeTimetablesValidityForm
          onSubmit={onSave}
          onCancel={onClose}
          defaultValues={{
            validityStart: mapToISODate(vehicleScheduleFrame.validity_start),
            validityEnd: mapToISODate(vehicleScheduleFrame.validity_end),
          }}
          affectedRouteLabels={affectedRouteLabels}
        />
      </ModalBody>
    </Modal>
  );
};
