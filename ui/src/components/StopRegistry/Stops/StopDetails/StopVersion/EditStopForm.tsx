import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { StopWithDetails } from '../../../../../types';
import { OverlappingVersionCutConfirmationModal } from './OverlappingVersionCutConfirmationModal';
import { StopVersionForm } from './StopVersionForm';
import { ExistingStopValidityRange } from './Types';
import { EditStopVersionResult } from './Types/EditStopVersionResult';
import { LinesByStop } from './Types/LinesByStopResult';
import { useEditStopFormUtils } from './Utils/useEditStopFormUtils';

type EditStopFormProps = {
  readonly className?: string;
  readonly existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>;
  readonly affectedLines: ReadonlyArray<LinesByStop>;
  readonly onCancel: () => void;
  readonly onEditDone: (result: EditStopVersionResult) => void;
  readonly originalStop: StopWithDetails;
};

export const EditStopForm: FC<EditStopFormProps> = ({
  className,
  existingValidityRanges,
  affectedLines,
  onCancel,
  onEditDone,
  originalStop,
}) => {
  const { methods, onFormSubmit, onCutConfirmationSubmit } =
    useEditStopFormUtils(originalStop, onEditDone);

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

      <OverlappingVersionCutConfirmationModal
        onConfirm={methods.handleSubmit(onCutConfirmationSubmit)}
      />
    </FormProvider>
  );
};
