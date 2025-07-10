import { Dialog } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../hooks';
import {
  closeCutStopVersionValidityModalAction,
  selectCutStopVersionValidityModal,
} from '../../../../../redux';
import { ConfirmModal } from '../../../../../uiComponents/ConfirmModal';

const testIds = {
  modal: 'OverlappingVersionCutConfirmationModal::modal',
  currentVersion: 'OverlappingVersionCutConfirmationModal::currentVersion',
  newVersion: 'OverlappingVersionCutConfirmationModal::newVersion',
  cutDate: 'OverlappingVersionCutConfirmationModal::cutDate',
};

type OverlappingVersionCutConfirmationModalProps = {
  readonly onConfirm: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export const OverlappingVersionCutConfirmationModal: FC<
  OverlappingVersionCutConfirmationModalProps
> = ({ onConfirm }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const cutModalState = useAppSelector(selectCutStopVersionValidityModal);

  return (
    <ConfirmModal
      heading={t('stopDetails.version.title.cutTitle')}
      isOpen={cutModalState.isOpen}
      onCancel={() => dispatch(closeCutStopVersionValidityModalAction())}
      onConfirm={onConfirm}
      confirmButtonText={t('cut')}
      cancelButtonText={t('cancel')}
      testId={testIds.modal}
    >
      <Dialog.Description className="text-sm">
        <p data-testid={testIds.currentVersion}>
          <span className="font-bold">
            {t('stopDetails.version.cutModal.currentVersion')}:
          </span>{' '}
          {cutModalState.currentVersion}
        </p>
        <p data-testid={testIds.newVersion}>
          <span className="font-bold">
            {t('stopDetails.version.cutModal.newVersion')}:
          </span>{' '}
          {cutModalState.newVersion}
        </p>

        <p data-testid={testIds.cutDate} className="mt-4">
          {cutModalState.isCutToEnd
            ? t('stopDetails.version.cutModal.cutCurrentVersionToEnd', {
                date: cutModalState.cutDate,
              })
            : t('stopDetails.version.cutModal.cutCurrentVersionToStart', {
                date: cutModalState.cutDate,
              })}
        </p>
      </Dialog.Description>
    </ConfirmModal>
  );
};
