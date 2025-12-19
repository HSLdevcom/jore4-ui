import { FC, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedStopPlace } from '../../../types';
import {
  StopAreaFormState,
  useGetNextPrivateCode,
} from '../../forms/stop-area';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal/Modal';
import { StopAreaForm, mapStopAreaDataToFormState } from './StopAreaForm';

const testIds = {
  modal: 'EditStopAreaModal',
};

function useGetDefaultValues(
  editedArea: EnrichedStopPlace,
): () => Promise<StopAreaFormState> {
  const getNextPrivateCode = useGetNextPrivateCode();

  return useMemo(() => {
    const baseDefaultValues = mapStopAreaDataToFormState(editedArea);

    if (editedArea.id) {
      const promisedData = Promise.resolve(baseDefaultValues);
      return () => promisedData;
    }

    const promisedData: Promise<StopAreaFormState> = getNextPrivateCode().then(
      (privateCode) => ({
        ...baseDefaultValues,
        privateCode,
      }),
    );

    return () => promisedData;
  }, [editedArea, getNextPrivateCode]);
}

type EditStopAreaModalProps = {
  readonly editedArea: EnrichedStopPlace;
  readonly onCancel: () => void;
  readonly onClose: () => void;
  readonly onSubmit: (changes: StopAreaFormState) => void;
};

export const EditStopAreaModal: FC<EditStopAreaModalProps> = ({
  editedArea,
  onCancel,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const formRef = useRef<ExplicitAny>(null);

  const getDefaultValues = useGetDefaultValues(editedArea);

  const heading = editedArea?.privateCode?.value
    ? t('map.editStopArea', { stopArea: editedArea.privateCode.value })
    : t('map.createNewStopArea');

  return (
    <CustomOverlay
      className="min-h-full w-[calc(450px+(2*1.25rem))]"
      position="top-left"
    >
      <Modal
        className="pointer-events-auto flex max-h-full flex-col"
        headerClassName="*:text-xl px-4 py-4 items-center"
        bodyClassName="mx-0 my-0 flex flex-col"
        testId={testIds.modal}
        onClose={onClose}
        heading={heading}
        navigationContext="StopAreaForm"
      >
        <StopAreaForm
          defaultValues={getDefaultValues}
          onSubmit={onSubmit}
          onCancel={onCancel}
          testIdPrefix={testIds.modal}
          ref={formRef}
          className="flex min-h-0 flex-col"
        />
      </Modal>
    </CustomOverlay>
  );
};
