import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopRegistryGroupOfStopPlacesInput } from '../../../generated/graphql';
import { submitFormByRef } from '../../../utils';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal/Modal';
import { FormState, StopAreaForm } from './StopAreaForm';

const testIds = {
  modal: 'EditStopModal',
};

interface Props {
  defaultValues: Partial<FormState>;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (changes: StopRegistryGroupOfStopPlacesInput) => void;
}

export const EditStopAreaModal = ({
  defaultValues,
  onCancel,
  onClose,
  onSubmit,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);
  const heading = t('map.createNewStopArea');

  return (
    <CustomOverlay position="top-right">
      <div className="flex max-h-full px-5 py-5">
        <Modal
          testId={testIds.modal}
          onSave={onSave}
          onCancel={onCancel}
          onClose={onClose}
          heading={heading}
        >
          <StopAreaForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            ref={formRef}
          />
        </Modal>
      </div>
    </CustomOverlay>
  );
};
