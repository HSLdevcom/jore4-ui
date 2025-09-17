import { Dialog } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapToShortDate, parseDate } from '../../../../../../time';
import { ConfirmModal } from '../../../../../../uiComponents/ConfirmModal';
import { CopyStopAreaCutConfirmationModalState } from '../types';

const testIds = {
  modal: 'CopyStopAreaCutConfirmationModal::modal',
  currentVersion: 'CopyStopAreaCutConfirmationModal::currentVersion',
  newVersion: 'CopyStopAreaCutConfirmationModal::newVersion',
  cutDate: 'CopyStopAreaCutConfirmationModal::cutDate',
};

function modalStateToDisplay(
  modalState: CopyStopAreaCutConfirmationModalState,
) {
  const currentVersion =
    `${mapToShortDate(modalState.currentVersion.start)} - ${mapToShortDate(modalState.currentVersion.end) ?? ''}`.trimEnd();
  const newVersion =
    `${mapToShortDate(modalState.newVersion.start)} - ${mapToShortDate(modalState.newVersion.end) ?? ''}`.trimEnd();

  const startDateMinusOne = mapToShortDate(
    parseDate(modalState.newVersion.start).minus({ days: 1 }),
  );
  const endDatePlusOne = mapToShortDate(
    parseDate(modalState.newVersion.end)?.plus({ days: 1 }),
  );
  const cutDate =
    modalState.currentVersion.cutDirection === 'end'
      ? startDateMinusOne
      : endDatePlusOne;

  return {
    currentVersion,
    newVersion,
    cutDate,
    cutDirection: modalState.currentVersion.cutDirection,
  };
}

type CopyStopAreaCutConfirmationModalProps = {
  readonly onConfirm: () => void;
  readonly onClose: () => void;
  readonly modalState: CopyStopAreaCutConfirmationModalState;
};

export const CopyStopAreaCutConfirmationModal: FC<
  CopyStopAreaCutConfirmationModalProps
> = ({ onConfirm, onClose, modalState }) => {
  const { t } = useTranslation();

  const displayState = modalStateToDisplay(modalState);

  return (
    <ConfirmModal
      heading={t('stopAreaDetails.version.cutModal.title')}
      isOpen
      onCancel={onClose}
      onConfirm={onConfirm}
      confirmButtonText={t('cut')}
      cancelButtonText={t('cancel')}
      testId={testIds.modal}
    >
      <Dialog.Description className="text-sm">
        <p>
          <span className="font-bold">
            {t('stopAreaDetails.version.cutModal.currentVersion')}:
          </span>{' '}
          <span data-testid={testIds.currentVersion}>
            {displayState.currentVersion}
          </span>
        </p>
        <p>
          <span className="font-bold">
            {t('stopAreaDetails.version.cutModal.newVersion')}:
          </span>{' '}
          <span data-testid={testIds.newVersion}>
            {displayState.newVersion}
          </span>
        </p>

        <p data-testid={testIds.cutDate} className="mt-4">
          {displayState.cutDirection === 'end'
            ? t('stopAreaDetails.version.cutModal.cutCurrentVersionToEnd', {
                date: displayState.cutDate,
              })
            : t('stopAreaDetails.version.cutModal.cutCurrentVersionToStart', {
                date: displayState.cutDate,
              })}
        </p>
      </Dialog.Description>
    </ConfirmModal>
  );
};
