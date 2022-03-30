import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HTMLOverlay } from 'react-map-gl';
import { submitFormByRef } from '../../../utils';
import { FormState, StopForm } from '../../forms/StopForm';
import { Modal } from '../Modal';

interface Props {
  defaultValues: Partial<FormState>;
  onCancel: () => void;
  onClose: () => void;
}

export const EditStopModal = ({
  defaultValues,
  onCancel,
  onClose,
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
      redraw={() => (
        <div className="flex max-h-full py-5 pl-5">
          <Modal
            onSave={onSave}
            onCancel={onCancel}
            onClose={onClose}
            heading={buildHeading()}
          >
            <StopForm
              className="my-8"
              defaultValues={defaultValues}
              onSubmitSuccess={onClose}
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
