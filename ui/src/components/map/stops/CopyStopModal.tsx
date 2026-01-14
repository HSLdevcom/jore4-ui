import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopFormState as FormState,
  StopForm,
  StopFormState,
} from '../../forms/stop';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal';
import { CreateChanges, EditChanges, isEditChanges } from './hooks';

const testIds = {
  modal: 'CopyStopModal',
};

type CopyStopModalProps = {
  readonly defaultValues: Partial<FormState>;
  readonly onCancel: () => void;
  readonly onClose: () => void;
  readonly onSubmit: (changes: CreateChanges, state: StopFormState) => void;
};

export const CopyStopModal: FC<CopyStopModalProps> = ({
  defaultValues,
  onCancel,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const formRef = useRef<ExplicitAny>(null);

  const onStopFormSubmit = (
    changes: CreateChanges | EditChanges,
    state: StopFormState,
  ) => {
    if (!isEditChanges(changes)) {
      onSubmit(changes, state);
    }
  };

  return (
    <CustomOverlay
      className="min-h-full w-[calc(450px+(2*1.25rem))]"
      position="top-left"
    >
      <Modal
        className="pointer-events-auto flex max-h-full flex-col"
        headerClassName="items-center px-4 py-4 *:text-xl"
        bodyClassName="mx-0 my-0 flex flex-col"
        testId={testIds.modal}
        onClose={onClose}
        heading={t('stops.createStopCopy', {
          stopLabel: defaultValues.publicCode?.value,
        })}
        navigationContext="StopForm"
      >
        <StopForm
          defaultValues={defaultValues}
          editing
          submitState
          onSubmit={onStopFormSubmit}
          onCancel={onCancel}
          testIdPrefix={testIds.modal}
          ref={formRef}
          className="min-h-0"
        />
      </Modal>
    </CustomOverlay>
  );
};
