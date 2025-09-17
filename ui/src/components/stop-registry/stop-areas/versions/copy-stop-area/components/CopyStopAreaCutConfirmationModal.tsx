import { Dialog } from '@headlessui/react';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '../../../../../../uiComponents/ConfirmModal';
import { CopyStopAreaCutConfirmationModalState } from '../types';

const testIds = {
  modal: 'CopyStopAreaCutConfirmationModal::modal',
  currentVersion: 'CopyStopAreaCutConfirmationModal::currentVersion',
  newVersion: 'CopyStopAreaCutConfirmationModal::newVersion',
  cutDate: 'CopyStopAreaCutConfirmationModal::cutDate',
};

function modalStateToDisplay(
  modalState?: CopyStopAreaCutConfirmationModalState,
) {
  if (!modalState) {
    return undefined;
  }

  const formatDate = (date?: string) =>
    date ? DateTime.fromISO(date).toFormat('dd.MM.yyyy') : '';

  const currentVersion = !modalState.currentVersion.end
    ? `${formatDate(modalState.currentVersion.start)} -`
    : `${formatDate(modalState.currentVersion.start)} - ${formatDate(modalState.currentVersion.end)}`;

  const newVersion = !modalState.newVersion.end
    ? `${formatDate(modalState.newVersion.start)} -`
    : `${formatDate(modalState.newVersion.start)} - ${formatDate(modalState.newVersion.end)}`;

  const cutDate = modalState.currentVersion.cutVersionToEnd
    ? DateTime.fromISO(modalState.newVersion.start)
        .minus({ days: 1 })
        .toFormat('dd.MM.yyyy')
    : DateTime.fromISO(modalState.newVersion.end ?? '')
        .plus({ days: 1 })
        .toFormat('dd.MM.yyyy');

  return {
    currentVersion,
    newVersion,
    cutDate,
    cutCurrentVersionToEnd: modalState.currentVersion.cutVersionToEnd,
  };
}

type CopyStopAreaCutConfirmationModalProps = {
  readonly onConfirm: () => void;
  readonly onClose: () => void;
  readonly modalState?: CopyStopAreaCutConfirmationModalState;
};

export const CopyStopAreaCutConfirmationModal: FC<
  CopyStopAreaCutConfirmationModalProps
> = ({ onConfirm, onClose, modalState }) => {
  const { t } = useTranslation();

  const displayState = modalStateToDisplay(modalState);

  return (
    <ConfirmModal
      heading={t('stopAreaDetails.version.cutModal.title')}
      isOpen={!!modalState}
      onCancel={onClose}
      onConfirm={onConfirm}
      confirmButtonText={t('cut')}
      cancelButtonText={t('cancel')}
      testId={testIds.modal}
    >
      <Dialog.Description className="text-sm">
        <p data-testid={testIds.currentVersion}>
          <span className="font-bold">
            {t('stopAreaDetails.version.cutModal.currentVersion')}:
          </span>{' '}
          {displayState?.currentVersion}
        </p>
        <p data-testid={testIds.newVersion}>
          <span className="font-bold">
            {t('stopAreaDetails.version.cutModal.newVersion')}:
          </span>{' '}
          {displayState?.newVersion}
        </p>

        <p data-testid={testIds.cutDate} className="mt-4">
          {displayState?.cutCurrentVersionToEnd
            ? t('stopAreaDetails.version.cutModal.cutCurrentVersionToEnd', {
                date: displayState?.cutDate,
              })
            : t('stopAreaDetails.version.cutModal.cutCurrentVersionToStart', {
                date: displayState?.cutDate,
              })}
        </p>
      </Dialog.Description>
    </ConfirmModal>
  );
};
