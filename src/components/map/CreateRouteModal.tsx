import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HTMLOverlay } from 'react-map-gl';
import { submitFormByRef } from '../../utils';
import { CreateRouteForm, FormState } from '../forms/CreateRouteForm';
import { Modal } from './Modal';

interface Props {
  defaultValues: Partial<FormState>;
  onSuccess: (data: FormState) => void;
  onCancel: () => void;
  onClose: () => void;
}

export const CreateRouteModal = ({
  defaultValues,
  onSuccess,
  onCancel,
  onClose,
}: Props): JSX.Element => {
  const formRef = useRef<ExplicitAny>(null);
  const { t } = useTranslation();

  const onModalSave = () => {
    submitFormByRef(formRef);
  };

  return (
    <HTMLOverlay
      redraw={() => (
        <div className="flex ml-5 mt-5">
          <Modal
            onSave={onModalSave}
            onCancel={onCancel}
            onClose={onClose}
            heading={t('routes.enterRouteData')}
          >
            <CreateRouteForm
              className="p-12"
              defaultValues={defaultValues}
              ref={formRef}
              onSubmit={onSuccess}
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
