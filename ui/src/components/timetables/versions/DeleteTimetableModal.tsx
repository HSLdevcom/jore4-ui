import { Dialog } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import {
  useAppDispatch,
  useAppSelector,
  useVehicleScheduleFrameValidity,
} from '../../../hooks';
import { useDeleteVehicleScheduleFrame } from '../../../hooks/vehicle-schedule-frame/useDeleteVehicleScheduleFrame';
import { Visible } from '../../../layoutComponents';
import {
  closeDeleteTimetableModalAction,
  selectDeleteTimetableModal,
} from '../../../redux';
import { ConfirmModal } from '../../../uiComponents/ConfirmModal';
import { AffectedRouteLabels } from '../common/AffectedRouteLabels';

interface Props {
  fetchTimetableVersions: () => void;
}

const testIds = {
  closeButton: 'DeleteTimetableModal::closeButton',
  confirmButton: 'DeleteTimetableModal::confirmButton',
  description: 'DeleteTimetableModal::description',
};

export const DeleteTimetableModal = ({
  fetchTimetableVersions,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const deleteTimetableModalState = useAppSelector(selectDeleteTimetableModal);

  const { isOpen, vehicleScheduleFrameId } = deleteTimetableModalState;

  const { affectedRouteLabels } = useVehicleScheduleFrameValidity(
    vehicleScheduleFrameId,
  );

  const { deleteVehicleScheduleFrameMutation } = useDeleteVehicleScheduleFrame({
    onCompleted: fetchTimetableVersions,
  });

  const onClose = () => {
    dispatch(closeDeleteTimetableModalAction());
  };

  const onConfirm = async () => {
    if (vehicleScheduleFrameId) {
      await deleteVehicleScheduleFrameMutation({
        vehicle_schedule_frame_id: vehicleScheduleFrameId,
      });
      dispatch(closeDeleteTimetableModalAction());
    }
  };

  return (
    <ConfirmModal
      heading={t('deleteTimetableModal.title')}
      isOpen={isOpen}
      onCancel={onClose}
      onConfirm={onConfirm}
      confirmButtonText={t('deleteTimetableModal.confirmText')}
      cancelButtonText={t('deleteTimetableModal.cancelText')}
    >
      <Dialog.Description data-testid={testIds.description}>
        {t('deleteTimetableModal.description')}
      </Dialog.Description>
      <Visible visible={affectedRouteLabels.length > 1}>
        <AffectedRouteLabels
          affectedRouteLabels={affectedRouteLabels}
          text={t('confirmTimetableDeleteDialog.affectedRoutes')}
        />
      </Visible>
    </ConfirmModal>
  );
};
