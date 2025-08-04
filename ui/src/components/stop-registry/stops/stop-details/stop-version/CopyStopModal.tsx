import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { StopWithDetails } from '../../../../../types';
import { Modal, ModalHeader } from '../../../../../uiComponents';
import { LoadingWrapper } from '../../../../../uiComponents/LoadingWrapper';
import { useWrapInContextNavigation } from '../../../../forms/common/NavigationBlocker';
import { ModalBody } from '../../../../map/modal';
import { CopyStopBoilerPlate } from './CopyStopBoilerPlate';
import { CopyStopForm } from './CopyStopForm';
import { CreateStopVersionResult } from './types';
import { useResolveExistingStopValidityRanges } from './utils';

const testIds = {
  modal: 'CopyStopModal::modal',
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
  const wrappedOnClose = useWrapInContextNavigation('CopyStopForm')(onClose);

  const navigate = useNavigate();

  const { ranges, loading: loadingExistingValidityRanges } =
    useResolveExistingStopValidityRanges({
      stopPlaceId: originalStop?.stop_place_ref,
      skip: !isOpen,
    });

  const onCopyCreated = (result: CreateStopVersionResult) => {
    onClose();
    if (result.stopPointInput.validity_start) {
      navigate(
        routeDetails[Path.stopDetails].getLink(result.stopPointInput.label, {
          observationDate: result.stopPointInput.validity_start,
          priority: result.stopPointInput.priority,
        }),
        { replace: true },
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={wrappedOnClose} testId={testIds.modal}>
      <ModalHeader
        onClose={wrappedOnClose}
        heading={t('stopDetails.version.title.copy')}
      />
      <LoadingWrapper
        testId={testIds.loading}
        loading={!originalStop || loadingExistingValidityRanges}
      >
        {originalStop && (
          <ModalBody>
            <CopyStopBoilerPlate originalStop={originalStop} />
            <h4 className="mt-4">
              {t('stopDetails.version.title.copySubTitle')}
            </h4>
            <CopyStopForm
              className="mt-4"
              existingValidityRanges={ranges}
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
