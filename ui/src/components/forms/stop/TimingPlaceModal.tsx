import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks/redux';
import { closeTimingPlaceModalAction } from '../../../redux/slices/modals';
import { Modal, ModalBody, ModalHeader } from '../../../uiComponents';
import { CreateTimingPlaceForm } from './CreateTimingPlaceForm';

type TimingPlaceModalProps = {
  readonly onTimingPlaceCreated: (timingPlaceId: UUID) => void;
};

export const TimingPlaceModal: FC<TimingPlaceModalProps> = ({
  onTimingPlaceCreated,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeTimingPlaceModalAction());
  };

  const timingPlaceCreated = (timingPlaceId: UUID) => {
    onTimingPlaceCreated(timingPlaceId);
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose}>
      <ModalHeader onClose={onClose} heading={t('timingPlaces.label')} />
      <ModalBody>
        <CreateTimingPlaceForm
          onCancel={onClose}
          onTimingPlaceCreated={timingPlaceCreated}
        />
      </ModalBody>
    </Modal>
  );
};
