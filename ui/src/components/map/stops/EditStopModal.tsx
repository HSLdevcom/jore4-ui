import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HTMLOverlay } from 'react-map-gl';
import { CreateChanges, EditChanges } from '../../../hooks';
import { submitFormByRef } from '../../../utils';
import { FormState, StopForm } from '../../forms/stop/StopForm';
import { Modal } from '../Modal';

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
      redraw={() => (
        <div className="flex max-h-full py-5 px-5">
          <Modal
            onSave={onSave}
            onCancel={onCancel}
            onClose={onClose}
            heading={buildHeading()}
          >
            <StopForm
              className="my-8"
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
