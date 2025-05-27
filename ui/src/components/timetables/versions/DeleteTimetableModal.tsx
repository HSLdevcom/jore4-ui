import { Dialog } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAppDispatch,
  useAppSelector,
  useVehicleScheduleFrameValidity,
} from '../../../hooks';
import { useDeleteVehicleScheduleFrame } from '../../../hooks/vehicle-schedule-frame/useDeleteVehicleScheduleFrame';
import {
  closeDeleteTimetableModalAction,
  selectDeleteTimetableModal,
} from '../../../redux';
import { ConfirmModal } from '../../../uiComponents/ConfirmModal';
import { AffectedRouteLabels } from '../common/AffectedRouteLabels';

type DeleteTimetableModalProps = {
  readonly fetchTimetableVersions: () => void;
};

const testIds = {
  closeButton: 'DeleteTimetableModal::closeButton',
  confirmButton: 'DeleteTimetableModal::confirmButton',
  description: 'DeleteTimetableModal::description',
};

export const DeleteTimetableModal: FC<DeleteTimetableModalProps> = ({
  fetchTimetableVersions,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { isOpen, vehicleScheduleFrameId } = useAppSelector(
    selectDeleteTimetableModal,
  );

  const { affectedRouteLabels } = useVehicleScheduleFrameValidity(
    vehicleScheduleFrameId,
  );

  const { deleteVehicleScheduleFrameMutation } = useDeleteVehicleScheduleFrame({
    onCompleted: fetchTimetableVersions,
  });

  const onClose = () => {
    dispatch(closeDeleteTimetableModalAction());
  };

  const onConfirm = async (id: string) => {
    await deleteVehicleScheduleFrameMutation({
      vehicle_schedule_frame_id: id,
    });

    dispatch(closeDeleteTimetableModalAction());
  };

  return (
    <ConfirmModal
      heading={t('deleteTimetableModal.title')}
      isOpen={isOpen}
      onCancel={onClose}
      onConfirm={() =>
        vehicleScheduleFrameId && onConfirm(vehicleScheduleFrameId)
      }
      confirmButtonText={t('deleteTimetableModal.confirmText')}
      cancelButtonText={t('deleteTimetableModal.cancelText')}
    >
      <Dialog.Description data-testid={testIds.description}>
        {t('deleteTimetableModal.description')}
      </Dialog.Description>
      <AffectedRouteLabels
        affectedRouteLabels={affectedRouteLabels}
        text={t('deleteTimetableModal.affectedRoutesText')}
      />
    </ConfirmModal>
  );
};
