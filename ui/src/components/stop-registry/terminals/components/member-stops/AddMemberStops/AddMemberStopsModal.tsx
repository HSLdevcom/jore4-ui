import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../../../../layoutComponents';
import { EnrichedParentStopPlace } from '../../../../../../types';
import {
  CloseIconButton,
  ModalBody,
  NewModalFooter,
} from '../../../../../../uiComponents';
import { Modal } from '../../../../../../uiComponents/modal/Modal';
import { submitFormByRef } from '../../../../../../utils';
import { useWrapInContextNavigation } from '../../../../../forms/common/NavigationBlocker';
import { SlimSimpleButton } from '../../../../stops/stop-details/layout';
import { AddMemberStopsForm } from './AddMemberStopsForm';

const testIds = {
  modal: 'AddMemberStopsModal::modal',
  saveButton: 'AddMemberStopsModal::saveButton',
  closeButton: 'AddMemberStopsModal::closeButton',
};

type AddMemberStopsModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: () => void;
  readonly terminal: EnrichedParentStopPlace;
};

export const AddMemberStopsModal: FC<AddMemberStopsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  terminal,
}) => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const wrappedOnClose = useWrapInContextNavigation('TerminalMemberStopsForm')(
    onClose,
  );

  const onSubmit = () => {
    setIsSaving(true);
    submitFormByRef(formRef);
  };

  const onError = () => {
    setIsSaving(false);
  };

  const onSuccess = () => {
    setIsSaving(false);
    onSave();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={wrappedOnClose}
      testId={testIds.modal}
      contentClassName="rounded-lg max-w-2xl w-full mx-4 drop-shadow-none"
    >
      <Row className="flex flex-row items-center border border-light-grey bg-background px-10 py-7">
        <h2>{t('terminalDetails.stops.addStopToTerminal')}</h2>

        <CloseIconButton
          className="ml-auto"
          onClick={wrappedOnClose}
          testId={testIds.closeButton}
        />
      </Row>

      <ModalBody className="!mx-0 !my-0">
        <AddMemberStopsForm
          terminal={terminal}
          onSuccess={onSuccess}
          onError={onError}
          ref={formRef}
        />
      </ModalBody>

      <NewModalFooter>
        <SlimSimpleButton type="button" onClick={onClose} inverted>
          {t('cancel')}
        </SlimSimpleButton>

        <SlimSimpleButton
          className="opacity-100"
          type="button"
          onClick={onSubmit}
          disabled={isSaving}
          testId={testIds.saveButton}
        >
          {isSaving ? t('saving') : t('save')}
        </SlimSimpleButton>
      </NewModalFooter>
    </Modal>
  );
};
