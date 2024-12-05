import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../hooks';
import { Modal, ModalHeader } from '../../../../../uiComponents';
import { LoadingWrapper } from '../../../../../uiComponents/LoadingWrapper';
import { ModalBody } from '../../../../map/modal';
import { CreateStopVersionForm } from './CreateStopVersionForm';

const testIds = {
  loading: 'CreateStopVersionModal::loading',
};

export type CreateStopVersionModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly originalStop: StopWithDetails | null;
};

export const CreateStopVersionModal: FC<CreateStopVersionModalProps> = ({
  isOpen,
  onClose,
  originalStop,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        onClose={onClose}
        heading={t('stopDetails.version.title.copy')}
      />
      <LoadingWrapper testId={testIds.loading} loading={!originalStop}>
        {originalStop && (
          <ModalBody>
            <h4>{t('stopDetails.version.title.copySubTitle')}</h4>
            <CreateStopVersionForm
              className="mt-4"
              originalStop={originalStop}
              closeModal={onClose}
            />
          </ModalBody>
        )}
      </LoadingWrapper>
    </Modal>
  );
};
