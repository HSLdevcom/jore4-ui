import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HTMLOverlay } from 'react-map-gl';
import { submitFormByRef } from '../../../utils';
import { RoutePropertiesForm } from '../../forms/route/RoutePropertiesForm';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';
import { Modal } from '../Modal';

interface Props {
  defaultValues: Partial<RouteFormState>;
  onSuccess: (data: RouteFormState) => void;
  onCancel: () => void;
  onClose: () => void;
}

export const EditRouteModal = ({
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
        <div className="flex max-h-full justify-center py-5">
          <Modal
            onSave={onModalSave}
            onCancel={onCancel}
            onClose={onClose}
            heading={t('routes.enterRouteData')}
          >
            <RoutePropertiesForm
              className="my-8 mx-12 max-w-2xl"
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
