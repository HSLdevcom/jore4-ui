import React, { useState } from 'react';
import { HTMLOverlay } from 'react-map-gl';
import { FormState, StopForm } from '../forms/StopForm';
import { Modal } from './Modal';

interface Props {
  initialValues: FormState;
  onCancel: () => void;
  onClose: () => void;
}

export const EditStopModal = ({
  initialValues,
  onCancel,
  onClose,
}: Props): JSX.Element => {
  const [formValues, setFormValues] = useState<FormState>();
  const onSave = () => {
    // eslint-disable-next-line no-console
    console.log('TODO: submit form, values: ', formValues);
  };
  return (
    <HTMLOverlay
      redraw={() => (
        <div className="flex ml-5 mt-5">
          <Modal onSave={onSave} onCancel={onCancel} onClose={onClose}>
            <StopForm
              initialValues={initialValues}
              className="p-12"
              onChange={setFormValues}
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
