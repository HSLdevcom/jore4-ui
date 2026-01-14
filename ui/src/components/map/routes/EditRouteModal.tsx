import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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

  return (
    <CustomOverlay
      className="min-h-full w-[calc(450px+(2*1.25rem))]"
      position="top-left"
    >
      <Modal
        className="pointer-events-auto flex max-h-full flex-col"
        headerClassName="*:text-xl px-4 py-4 items-center"
        bodyClassName="mx-0 my-0"
        testId={testIds.modal}
        onClose={onClose}
        heading={t('routes.enterRouteData')}
        navigationContext="RoutePropertiesForm"
      >
        <RoutePropertiesForm
          defaultValues={defaultValues}
          ref={formRef}
          onSubmit={onSuccess}
          onCancel={onCancel}
          testIdPrefix={testIds.modal}
          className="min-h-0"
          variant="modal"
        />
      </Modal>
    </CustomOverlay>
  );
};
