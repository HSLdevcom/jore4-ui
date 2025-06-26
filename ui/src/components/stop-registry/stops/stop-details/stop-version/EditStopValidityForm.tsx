import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { StopWithDetails } from '../../../../../types';
import { StopVersionForm } from './StopVersionForm';
import { CreateStopVersionResult, ExistingStopValidityRange } from './types';
import { LinesByStop } from './types/LinesByStopResult';
import { useEditStopValidityFormUtils } from './utils/useEditStopValidityFormUtils';

type EditStopValidityFormProps = {
  readonly className?: string;
  readonly existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>;
  readonly affectedLines: ReadonlyArray<LinesByStop>;
  readonly onCancel: () => void;
  readonly onCopyCreated: (result: CreateStopVersionResult) => void;
  readonly originalStop: StopWithDetails;
};

export const EditStopValidityForm: FC<EditStopValidityFormProps> = ({
  className,
  existingValidityRanges,
  affectedLines,
  onCancel,
  onCopyCreated,
  originalStop,
}) => {
  const { methods, onFormSubmit } = useEditStopValidityFormUtils(
    originalStop,
    onCopyCreated,
  );

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <StopVersionForm
        className={className}
        existingValidityRanges={existingValidityRanges}
        affectedLines={affectedLines}
        onCancel={onCancel}
        onSubmit={methods.handleSubmit(onFormSubmit)}
      />
    </FormProvider>
  );
};
