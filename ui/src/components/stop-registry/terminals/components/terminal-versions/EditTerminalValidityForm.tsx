import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { EnrichedParentStopPlace } from '../../../../../types';
import { EditTerminalValidityResult } from '../../types';
import { useEditTerminalValidityFormUtils } from '../../utils/useEditTerminalValidityFormUtils';
import { TerminalValidityForm } from './TerminalValidityForm';

type EditTerminalValidityFormProps = {
  readonly className?: string;
  readonly onCancel: () => void;
  readonly onEditDone: (result: EditTerminalValidityResult) => void;
  readonly terminal: EnrichedParentStopPlace;
};

export const EditTerminalValidityForm: FC<EditTerminalValidityFormProps> = ({
  className,
  terminal,
  onCancel,
  onEditDone,
}) => {
  const { methods, onFormSubmit } = useEditTerminalValidityFormUtils(
    terminal,
    onEditDone,
  );

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <TerminalValidityForm
        className={className}
        onCancel={onCancel}
        onSubmit={methods.handleSubmit(onFormSubmit)}
      />
    </FormProvider>
  );
};
