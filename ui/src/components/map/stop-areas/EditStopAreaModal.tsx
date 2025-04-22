import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { submitFormByRef } from '../../../utils';
import { StopAreaFormState } from '../../forms/stop-area';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal/Modal';
import { StopAreaForm } from './StopAreaForm';

const testIds = {
  modal: 'EditStopAreaModal',
};

interface Props {
  defaultValues: Partial<StopAreaFormState>;
  editedStopAreaId: string | null | undefined;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (changes: StopAreaFormState) => void;
}

export const EditStopAreaModal = ({
  defaultValues,
  editedStopAreaId,
  onCancel,
  onClose,
  onSubmit,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);
  const heading = defaultValues.privateCode
    ? t('map.editStopArea', { stopArea: defaultValues.privateCode })
    : t('map.createNewStopArea');

  return (
    <CustomOverlay position="top-right">
      <div className="flex max-h-[calc(100vh-240px)] w-[calc(450px+(2*1.25rem))] p-5">
        <Modal
          className="flex max-h-full flex-grow flex-col"
          headerClassName="*:text-xl px-4 py-4 items-center"
          bodyClassName="mx-0 my-0"
          footerClassName="px-4 py-2"
          testId={testIds.modal}
          onSave={onSave}
          onCancel={onCancel}
          onClose={onClose}
          heading={heading}
        >
          <StopAreaForm
            editedStopAreaId={editedStopAreaId}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            ref={formRef}
          />
        </Modal>
      </div>
    </CustomOverlay>
  );
};
