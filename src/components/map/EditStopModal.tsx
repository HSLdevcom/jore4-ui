import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);
  return (
    <HTMLOverlay
      redraw={() => (
        <div className="ml-5 mt-5 flex">
          <Modal
            onSave={onSave}
            onCancel={onCancel}
            onClose={onClose}
            heading={t('stops.stopById', { id: 'xxxxx' })}
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
