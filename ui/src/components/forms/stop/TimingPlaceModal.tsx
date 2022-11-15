import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks';
import { closeTimingPlaceModalAction } from '../../../redux/slices/modals';
import { ModalHeader } from '../../modal';
import { CreateTimingPlaceForm } from './CreateTimingPlaceForm';

interface Props {
  className?: string;
  onTimingPlaceCreated: (timingPlaceId: UUID) => void;
}

export const TimingPlaceModal = ({
  className = '',
  onTimingPlaceCreated,
}: Props): JSX.Element => {
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
    <div
      className={`fixed top-1/2 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2 overflow-auto overflow-y-auto bg-white drop-shadow-md ${className}`}
    >
      <ModalHeader onClose={onClose} heading={t('timingPlaces.label')} />
      <CreateTimingPlaceForm
        onCancel={onClose}
        onTimingPlaceCreated={timingPlaceCreated}
      />
    </div>
  );
};
