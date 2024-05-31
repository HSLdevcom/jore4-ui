import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HTMLOverlay } from 'react-map-gl';
import { CreateChanges, EditChanges } from '../../../hooks';
import { submitFormByRef } from '../../../utils';
import { FormState, StopForm } from '../../forms/stop/StopForm';
import { Modal } from '../modal/Modal';

const testIds = {
  modal: 'EditStopModal',
};

interface Props {
  defaultValues: Partial<FormState>;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (changes: CreateChanges | EditChanges) => void;
}

export const EditStopModal = ({
  defaultValues,
  onCancel,
  onClose,
  onSubmit,
}: Props): JSX.Element => {
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
    <HTMLOverlay
      style={{ zIndex: 10 }}
      // eslint-disable-next-line react/no-unstable-nested-components
      redraw={() => (
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
              onSubmit={onSubmit}
              ref={formRef}
            />
          </Modal>
        </div>
      )}
      captureClick
      captureDoubleClick
      captureDrag
      captureScroll
    />
  );
};
