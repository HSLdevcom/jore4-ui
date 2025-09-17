import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Path, routeDetails } from '../../../../../../router/routeDetails';
import { EnrichedStopPlace } from '../../../../../../types';
import { Modal, ModalBody, ModalHeader } from '../../../../../../uiComponents';
import { LoadingWrapper } from '../../../../../../uiComponents/LoadingWrapper';
import { useWrapInContextNavigation } from '../../../../../forms/common/NavigationBlocker';
import { CopyStopAreaSuccessResult } from '../../types';
import { CopyStopAreaBoilerplate } from './CopyStopAreaBoilerplate';
import { CopyStopAreaForm } from './CopyStopAreaForm';

const testIds = {
  modal: 'CopyStopAreaModal::modal',
  loading: 'CopyStopAreaModal::loading',
};

type CopyStopAreaProps = {
  readonly stopArea: EnrichedStopPlace;
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export const CopyStopAreaModal: FC<CopyStopAreaProps> = ({
  stopArea,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const wrappedOnClose =
    useWrapInContextNavigation('CopyStopAreaForm')(onClose);

  const onCopyCreated = (result: CopyStopAreaSuccessResult) => {
    onClose();

    const { mutationResult } = result;

    navigate(
      routeDetails[Path.stopAreaDetails].getLink(
        mutationResult.privateCode?.value,
        {
          observationDate: mutationResult.validityStart,
        },
      ),
      { replace: true },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={wrappedOnClose} testId={testIds.modal}>
      <ModalHeader
        onClose={wrappedOnClose}
        heading={t('stopAreaDetails.version.copy.title')}
      />
      <LoadingWrapper testId={testIds.loading} loading={!stopArea}>
        {stopArea && (
          <ModalBody>
            <CopyStopAreaBoilerplate stopArea={stopArea} />
            <h4 className="mt-4">
              {t('stopAreaDetails.version.copy.subTitle')}
            </h4>
            <CopyStopAreaForm
              className="mt-4"
              stopArea={stopArea}
              onCopyCreated={onCopyCreated}
              onCancel={onClose}
            />
          </ModalBody>
        )}
      </LoadingWrapper>
    </Modal>
  );
};
