import { Dialog } from '@headlessui/react';
import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../hooks';
import {
  closeCutStopVersionValidityModalAction,
  selectCutStopVersionValidityModal,
  selectIsCutStopVersionValidityModalOpen,
} from '../../../../../redux';
import { StopWithDetails } from '../../../../../types';
import { ConfirmModal } from '../../../../../uiComponents/ConfirmModal';
import { StopVersionForm } from './StopVersionForm';
import { ExistingStopValidityRange } from './types';
import { EditStopVersionResult } from './types/EditStopVersionResult';
import { LinesByStop } from './types/LinesByStopResult';
import { useEditStopValidityFormUtils } from './utils/useEditStopValidityFormUtils';

type EditStopValidityFormProps = {
  readonly className?: string;
  readonly existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>;
  readonly affectedLines: ReadonlyArray<LinesByStop>;
  readonly onCancel: () => void;
  readonly onEditDone: (result: EditStopVersionResult) => void;
  readonly originalStop: StopWithDetails;
};

export const EditStopValidityForm: FC<EditStopValidityFormProps> = ({
  className,
  existingValidityRanges,
  affectedLines,
  onCancel,
  onEditDone,
  originalStop,
}) => {
  const { methods, onFormSubmit, onDialogSubmit } =
    useEditStopValidityFormUtils(originalStop, onEditDone);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isCutModalOpen = useAppSelector(
    selectIsCutStopVersionValidityModalOpen,
  );
  const cutModalState = useAppSelector(selectCutStopVersionValidityModal);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <StopVersionForm
        className={className}
        existingValidityRanges={existingValidityRanges}
        isEditing
        affectedLines={affectedLines}
        onCancel={onCancel}
        onSubmit={methods.handleSubmit(onFormSubmit)}
      />

      <ConfirmModal
        heading={t('stopDetails.version.title.cutTitle')}
        isOpen={isCutModalOpen}
        onCancel={() => dispatch(closeCutStopVersionValidityModalAction())}
        onConfirm={methods.handleSubmit(onDialogSubmit)}
        confirmButtonText={t('cut')}
        cancelButtonText={t('cancel')}
      >
        <Dialog.Description>{cutModalState.description}</Dialog.Description>
      </ConfirmModal>
    </FormProvider>
  );
};
