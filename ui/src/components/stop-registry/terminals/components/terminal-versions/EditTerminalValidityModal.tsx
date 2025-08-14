import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { EnrichedParentStopPlace } from '../../../../../types';
import { Modal, ModalHeader } from '../../../../../uiComponents';
import { LoadingWrapper } from '../../../../../uiComponents/LoadingWrapper';
import { useWrapInContextNavigation } from '../../../../forms/common/NavigationBlocker';
import { ModalBody } from '../../../../map/modal';
import { EditTerminalValidityResult } from '../../types';
import { EditTerminalValidityForm } from './EditTerminalValidityForm';

const testIds = {
  modal: 'EditTerminalValidityModal::modal',
  loading: 'EditTerminalValidityModal::loading',
};

type EditTerminalValidityModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly terminal: EnrichedParentStopPlace | null;
};

export const EditTerminalValidityModal: FC<EditTerminalValidityModalProps> = ({
  isOpen,
  onClose,
  terminal,
}) => {
  const { t } = useTranslation();
  const wrappedOnClose = useWrapInContextNavigation('TerminalValidityForm')(
    onClose,
  );

  const navigate = useNavigate();

  const onEditDone = (result: EditTerminalValidityResult) => {
    onClose();

    if (result.validityStart) {
      navigate(
        routeDetails[Path.terminalDetails].getLink(result.privateCode, {
          observationDate: result.validityStart,
        }),
        { replace: true },
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={wrappedOnClose}
      testId={testIds.modal}
      contentClassName="w-[585px]"
    >
      <ModalHeader
        onClose={wrappedOnClose}
        heading={t('terminalDetails.version.title.edit')}
      />
      <LoadingWrapper testId={testIds.loading} loading={!terminal}>
        {terminal && (
          <ModalBody className="border-x-0">
            <EditTerminalValidityForm
              className="mt-4 border-x-0"
              terminal={terminal}
              onCancel={onClose}
              onEditDone={onEditDone}
            />
          </ModalBody>
        )}
      </LoadingWrapper>
    </Modal>
  );
};
