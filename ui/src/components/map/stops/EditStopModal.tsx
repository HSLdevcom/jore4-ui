import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateChanges, EditChanges } from '../../../hooks';
import { submitFormByRef } from '../../../utils';
import { FormState, StopForm } from '../../forms/stop/StopForm';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal/Modal';

const testIds = {
  modal: 'EditStopModal',
};

type Props = {
  readonly defaultValues: Partial<FormState>;
  readonly stopAreaId: string | null | undefined;
  readonly stopPlaceRef?: string | null;
  readonly onCancel: () => void;
  readonly onClose: () => void;
  readonly onSubmit: (changes: CreateChanges | EditChanges) => void;
};

export const EditStopModal: FC<Props> = ({
  defaultValues,
  stopAreaId,
  stopPlaceRef,
  onCancel,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);
  const buildHeading = () => {
    const { label } = defaultValues;
    return label
      ? t('stops.stopWithLabel', { stopLabel: label })
      : t('stops.createStop');
  };
  return (
    <CustomOverlay position="top-right">
      <div className="flex max-h-full px-5 py-5">
        <Modal
          testId={testIds.modal}
          onSave={onSave}
          onCancel={onCancel}
          onClose={onClose}
          heading={buildHeading()}
        >
          <StopForm
            defaultValues={defaultValues}
            stopAreaId={stopAreaId}
            stopPlaceRef={stopPlaceRef}
            onSubmit={onSubmit}
            ref={formRef}
          />
        </Modal>
      </div>
    </CustomOverlay>
  );
};
