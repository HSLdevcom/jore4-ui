import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { submitFormByRef } from '../../../utils';
import { RoutePropertiesForm } from '../../forms/route/RoutePropertiesForm';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal/Modal';

const testIds = {
  modal: 'EditRouteModal',
};

type EditRouteModalProps = {
  readonly defaultValues: Partial<RouteFormState>;
  readonly onSuccess: (data: RouteFormState) => void;
  readonly onCancel: () => void;
  readonly onClose: () => void;
};

export const EditRouteModal: FC<EditRouteModalProps> = ({
  defaultValues,
  onSuccess,
  onCancel,
  onClose,
}) => {
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
          navigationContext="RoutePropertiesForm"
        >
          <RoutePropertiesForm
            className="max-h-[50vh] max-w-2xl overflow-auto"
            defaultValues={defaultValues}
            ref={formRef}
            onSubmit={onSuccess}
          />
        </Modal>
      </div>
    </CustomOverlay>
  );
};
