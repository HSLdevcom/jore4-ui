import React, { useState } from 'react';
import { HTMLOverlay } from 'react-map-gl';
import { StopForm } from '../forms/StopForm';
import { Modal } from './Modal';

interface Props {
  onCancel: () => void;
  onClose: () => void;
}

export const EditStopModal = ({ onCancel, onClose }: Props): JSX.Element => {
  const [formValues, setFormValues] = useState<ExplicitAny>();
  const onSave = () => {
    // eslint-disable-next-line no-console
    console.log('TODO: submit form, values: ', formValues);
  };
  return (
    <HTMLOverlay
      redraw={() => (
        <div className="flex ml-5 mt-5">
          <Modal onSave={onSave} onCancel={onCancel} onClose={onClose}>
            <StopForm className="p-12" onChange={setFormValues} />
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
