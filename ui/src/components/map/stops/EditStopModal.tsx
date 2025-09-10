import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { submitFormByRef } from '../../../utils';
import { StopFormState as FormState, StopForm } from '../../forms/stop';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal';
import { CreateChanges, EditChanges } from './hooks';

const testIds = {
  modal: 'EditStopModal',
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

  const buildHeading = () => {
    const { publicCode: { value: label } = {} } = defaultValues;
    return label
      ? t('stops.stopWithLabel', { stopLabel: label })
      : t('stops.createStop');
  };

  return (
    <CustomOverlay position="top-right">
      {/* max-height: Viewport height - 240px of other elements
       *       width: 450px (content) + 1.25rem of padding on each side
       */}
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
