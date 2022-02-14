import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HTMLOverlay } from 'react-map-gl';
import { submitFormByRef } from '../../utils';
import { FormState, RoutePropertiesForm } from '../forms/RoutePropertiesForm';
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
        <div className="flex max-h-full py-5 pl-5">
          <Modal
            onSave={onModalSave}
            onCancel={onCancel}
            onClose={onClose}
            heading={t('routes.enterRouteData')}
          >
            <RoutePropertiesForm
              className="my-8 mx-12 max-w-sm"
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
