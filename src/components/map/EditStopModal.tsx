import React, { useRef } from 'react';
import { HTMLOverlay } from 'react-map-gl';
import { submitFormByRef } from '../../utils';
import { FormState, StopForm } from '../forms/StopForm';
import { Modal } from './Modal';

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
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);
  return (
    <HTMLOverlay
      redraw={() => (
        <div className="flex ml-5 mt-5">
          <Modal onSave={onSave} onCancel={onCancel} onClose={onClose}>
            <StopForm
              className="p-12"
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
