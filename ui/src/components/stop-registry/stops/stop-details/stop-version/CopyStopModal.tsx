import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopWithDetails,
  useObservationDateQueryParam,
} from '../../../../../hooks';
import { Modal, ModalHeader } from '../../../../../uiComponents';
import { LoadingWrapper } from '../../../../../uiComponents/LoadingWrapper';
import { ModalBody } from '../../../../map/modal';
import { CopyStopBoilerPlate } from './CopyStopBoilerPlate';
import { CopyStopForm } from './CopyStopForm';
import { CreateStopVersionResult } from './types';

const testIds = {
  loading: 'CopyStopModal::loading',
};

type CopyStopModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly originalStop: StopWithDetails | null;
};

export const CopyStopModal: FC<CopyStopModalProps> = ({
  isOpen,
  onClose,
  originalStop,
}) => {
  const { t } = useTranslation();

  const { setObservationDateToUrl } = useObservationDateQueryParam();

  const onCopyCreated = (result: CreateStopVersionResult) => {
    onClose();
    if (result.stopPointInput.validity_start) {
      setObservationDateToUrl(result.stopPointInput.validity_start);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        onClose={onClose}
        heading={t('stopDetails.version.title.copy')}
      />
      <LoadingWrapper testId={testIds.loading} loading={!originalStop}>
        {originalStop && (
          <ModalBody>
            <CopyStopBoilerPlate originalStop={originalStop} />
            <h4 className="mt-4">
              {t('stopDetails.version.title.copySubTitle')}
            </h4>
            <CopyStopForm
              className="mt-4"
              originalStop={originalStop}
              onCancel={onClose}
              onCopyCreated={onCopyCreated}
            />
          </ModalBody>
        )}
      </LoadingWrapper>
    </Modal>
  );
};
