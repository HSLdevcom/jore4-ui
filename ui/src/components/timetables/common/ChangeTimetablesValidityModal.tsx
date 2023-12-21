import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAppDispatch,
  useAppSelector,
  useVehicleScheduleFrameValidity,
} from '../../../hooks';
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
import {
  ChangeTimetablesValidityForm,
  FormState,
} from './ChangeTimetablesValidityForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const ChangeTimetablesValidityModal: React.FC<Props> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const { t } = useTranslation();
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

      onClose();
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  if (!vehicleScheduleFrame) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName={className}>
      <ModalHeader
        onClose={onClose}
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
