import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedParentStopPlace } from '../../../types';
import { submitFormByRef } from '../../../utils';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';
import { mapTerminalDataToFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/TerminalDetailsEdit';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal';
import { TerminalForm } from './TerminalForm';

const testIds = {
  modal: 'EditTerminalModal',
};

type EditTerminalModalProps = {
  readonly editedTerminal: EnrichedParentStopPlace;
  readonly onCancel: () => void;
  readonly onClose: () => void;
  readonly onSubmit: (changes: TerminalFormState) => void;
};

export const EditTerminalModal: FC<EditTerminalModalProps> = ({
  editedTerminal,
  onCancel,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const formRef = useRef<HTMLFormElement | ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);

  const heading = editedTerminal?.privateCode?.value
    ? t('map.editTerminal', { terminal: editedTerminal.privateCode.value })
    : t('map.createNewTerminal');

  return (
    <CustomOverlay position="top-right">
      <div className="flex max-h-[calc(100vh-240px)] w-[calc(450px+(2*1.25rem))] p-5">
        <Modal
          className="flex max-h-full flex-grow flex-col"
          headerClassName="*:text-xl px-4 py-4 items-center"
          bodyClassName="mx-0 my-0"
          footerClassName="px-4 py-2"
          testId={testIds.modal}
          onSave={onSave}
          onCancel={onCancel}
          onClose={onClose}
          heading={heading}
          navigationContext="TerminalForm"
        >
          <TerminalForm
            defaultValues={mapTerminalDataToFormState(editedTerminal)}
            onSubmit={onSubmit}
            ref={formRef}
          />
        </Modal>
      </div>
    </CustomOverlay>
  );
};
