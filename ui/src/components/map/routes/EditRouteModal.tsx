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
    <CustomOverlay
      className="min-h-full w-[calc(650px+(2*1.25rem))]"
      position="top-left"
    >
      <Modal
        className="pointer-events-auto flex max-h-full flex-col"
        headerClassName="text-xl px-4 py-4 items-center"
        bodyClassName="mx-0 my-0"
        footerClassName="px-4 py-2"
        testId={testIds.modal}
        onSave={onModalSave}
        onCancel={onCancel}
        onClose={onClose}
        heading={t('routes.enterRouteData')}
        navigationContext="RoutePropertiesForm"
      >
        <RoutePropertiesForm
          defaultValues={defaultValues}
          ref={formRef}
          onSubmit={onSuccess}
        />
      </Modal>
    </CustomOverlay>
  );
};
