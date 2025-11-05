import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useObservationDateQueryParam } from '../../../../../hooks';
import { isDateInRange } from '../../../../../time';
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

  const { observationDate, setObservationDateToUrl } =
    useObservationDateQueryParam();

  const onEditDone = (result: EditTerminalValidityResult) => {
    onClose();

    if (
      !isDateInRange(observationDate, result.validityStart, result.validityEnd)
    ) {
      setObservationDateToUrl(
        result.validityStart ?? result.validityEnd ?? observationDate,
        true,
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
