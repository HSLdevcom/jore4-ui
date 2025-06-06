import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks/redux';
import { closeTimingPlaceModalAction } from '../../../redux/slices/modals';
import { Modal, ModalBody, ModalHeader } from '../../../uiComponents';
import { useWrapInContextNavigation } from '../common/NavigationBlocker';
import { CreateTimingPlaceForm } from './CreateTimingPlaceForm';

const testIds = { modal: 'TimingPlaceModal' };

type TimingPlaceModalProps = {
  readonly onTimingPlaceCreated: (timingPlaceId: UUID) => void;
};

export const TimingPlaceModal: FC<TimingPlaceModalProps> = ({
  onTimingPlaceCreated,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const wrapInContextNavigation = useWrapInContextNavigation(
    'CreateTimingPlaceForm',
  );

  const onCloseModal = () => dispatch(closeTimingPlaceModalAction());
  const onClose = wrapInContextNavigation(onCloseModal);

  const timingPlaceCreated = (timingPlaceId: UUID) => {
    onTimingPlaceCreated(timingPlaceId);
    onCloseModal();
  };

  return (
    <Modal isOpen onClose={onClose} testId={testIds.modal}>
      <ModalHeader onClose={onClose} heading={t('timingPlaces.label')} />
      <ModalBody>
        <CreateTimingPlaceForm
          onCancel={onCloseModal}
          onTimingPlaceCreated={timingPlaceCreated}
        />
      </ModalBody>
    </Modal>
  );
};
