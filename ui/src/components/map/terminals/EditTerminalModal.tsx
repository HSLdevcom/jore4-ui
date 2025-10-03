import { FC, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedParentStopPlace } from '../../../types';
import { submitFormByRef } from '../../../utils';
import { useGetNextPrivateCode } from '../../forms/stop-area';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';
import { mapTerminalDataToFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/TerminalDetailsEdit';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal';
import { useAdjustContentHeight } from '../utils/useAdjustContentHeight';
import { TerminalForm } from './TerminalForm';

const testIds = {
  modal: 'EditTerminalModal',
};

function useGetDefaultValues(
  editedTerminal: EnrichedParentStopPlace,
): () => Promise<TerminalFormState> {
  const getNextPrivateCode = useGetNextPrivateCode(true);

  return useMemo(() => {
    const baseDefaultValues = mapTerminalDataToFormState(editedTerminal);

    if (editedTerminal.id) {
      const promisedData = Promise.resolve(baseDefaultValues);
      return () => promisedData;
    }

    const promisedData: Promise<TerminalFormState> = getNextPrivateCode().then(
      (privateCode) => ({
        ...baseDefaultValues,
        privateCode,
      }),
    );

    return () => promisedData;
  }, [editedTerminal, getNextPrivateCode]);
}

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

  const formRef = useRef<HTMLFormElement | null>(null);
  const onSave = () => submitFormByRef(formRef);

  useAdjustContentHeight();

  const getDefaultValues = useGetDefaultValues(editedTerminal);

  const heading = editedTerminal?.name ?? t('map.createNewTerminal');

  return (
    <CustomOverlay position="top-left">
      <div className="flex w-[calc(450px+(2*1.25rem))] px-2">
        <Modal
          className="pointer-events-auto flex max-h-full flex-grow flex-col"
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
            defaultValues={getDefaultValues}
            onSubmit={onSubmit}
            ref={formRef}
          />
        </Modal>
      </div>
    </CustomOverlay>
  );
};
