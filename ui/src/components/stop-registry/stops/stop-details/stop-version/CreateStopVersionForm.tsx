import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { StopWithDetails } from '../../../../../hooks';
import { StopVersionForm } from './StopVersionForm';
import { useCreateStopVersionFormUtils } from './useCreateStopVersionFormUtils';

type CreateStopVersionFormProps = {
  readonly className?: string;
  readonly closeModal: () => void;
  readonly originalStop: StopWithDetails;
};

export const CreateStopVersionForm: FC<CreateStopVersionFormProps> = ({
  className,
  closeModal,
  originalStop,
}) => {
  const { methods, onFormSubmit } = useCreateStopVersionFormUtils(
    originalStop,
    closeModal,
  );

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <StopVersionForm
        className={className}
        onCancel={closeModal}
        onSubmit={methods.handleSubmit(onFormSubmit)}
      />
    </FormProvider>
  );
};
