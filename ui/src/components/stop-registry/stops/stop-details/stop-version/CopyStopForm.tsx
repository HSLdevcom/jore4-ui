import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { StopWithDetails } from '../../../../../hooks';
import { StopVersionForm } from './StopVersionForm';
import { CreateStopVersionResult, ExistingStopValidityRange } from './types';
import { useCopyStopFormUtils } from './utils';

type CopyStopFormProps = {
  readonly className?: string;
  readonly existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>;
  readonly onCancel: () => void;
  readonly onCopyCreated: (result: CreateStopVersionResult) => void;
  readonly originalStop: StopWithDetails;
};

export const CopyStopForm: FC<CopyStopFormProps> = ({
  className,
  existingValidityRanges,
  onCancel,
  onCopyCreated,
  originalStop,
}) => {
  const { methods, onFormSubmit } = useCopyStopFormUtils(
    originalStop,
    onCopyCreated,
  );

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <StopVersionForm
        className={className}
        existingValidityRanges={existingValidityRanges}
        onCancel={onCancel}
        onSubmit={methods.handleSubmit(onFormSubmit)}
      />
    </FormProvider>
  );
};
