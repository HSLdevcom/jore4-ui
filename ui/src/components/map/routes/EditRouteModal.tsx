import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { submitFormByRef } from '../../../utils';
import { RoutePropertiesForm } from '../../forms/route/RoutePropertiesForm';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal/Modal';

const testIds = {
  modal: 'EditRouteModal',
};

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
    <CustomOverlay position="top-right">
      <div className="py-5">
        <Modal
          testId={testIds.modal}
          onSave={onModalSave}
          onCancel={onCancel}
          onClose={onClose}
          heading={t('routes.enterRouteData')}
        >
          <RoutePropertiesForm
            className="max-w-2xl max-h-[850px] overflow-auto"
            defaultValues={defaultValues}
            ref={formRef}
            onSubmit={onSuccess}
          />
        </Modal>
      </div>
    </CustomOverlay>
  );
};
