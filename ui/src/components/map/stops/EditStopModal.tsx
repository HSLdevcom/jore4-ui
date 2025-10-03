import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { submitFormByRef } from '../../../utils';
import { StopFormState as FormState, StopForm } from '../../forms/stop';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal';
import { useAdjustContentHeight } from '../utils/useAdjustContentHeight';
import { CreateChanges, EditChanges } from './hooks';

const testIds = {
  modal: 'EditStopModal',
  modalBody: 'EditStopModalBody',
};

type EditStopModalProps = {
  readonly defaultValues: Partial<FormState>;
  readonly editing: boolean;
  readonly onCancel: () => void;
  readonly onClose: () => void;
  readonly onSubmit: (changes: CreateChanges | EditChanges) => void;
};

export const EditStopModal: FC<EditStopModalProps> = ({
  defaultValues,
  editing,
  onCancel,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);

  useAdjustContentHeight(testIds.modal, testIds.modalBody);

  const buildHeading = () => {
    const { publicCode: { value: label } = {} } = defaultValues;
    return label
      ? t('stops.stopWithLabel', { stopLabel: label })
      : t('stops.createStop');
  };

  return (
    <CustomOverlay position="top-left">
      <div className="flex w-[calc(450px+(2*1.25rem))] px-2">
        <Modal
          className="pointer-events-auto flex flex-col"
          headerClassName="text-xl px-4 py-4 items-center"
          bodyClassName="mx-0 my-0"
          footerClassName="px-4 py-2"
          testId={testIds.modal}
          bodyTestId={testIds.modalBody}
          onSave={onSave}
          onCancel={onCancel}
          onClose={onClose}
          heading={buildHeading()}
          navigationContext="StopForm"
        >
          <StopForm
            defaultValues={defaultValues}
            editing={editing}
            onSubmit={onSubmit}
            ref={formRef}
          />
        </Modal>
      </div>
    </CustomOverlay>
  );
};
