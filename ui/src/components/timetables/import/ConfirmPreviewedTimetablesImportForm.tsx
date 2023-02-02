import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  PriorityForm,
  PriorityFormState,
  priorityFormSchema,
} from '../../forms/common';

const schema = priorityFormSchema;

export type FormState = PriorityFormState;

interface Props {
  defaultValues?: Partial<FormState>;
  onSubmit: (state: FormState) => void;
}

export const ConfirmPreviewedTimetablesImportFormComponent = (
  { defaultValues, onSubmit }: Props,
  externalRef: ExplicitAny,
): JSX.Element => {
  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        id="save-timetables-form"
        onSubmit={handleSubmit(onSubmit)}
        ref={externalRef}
      >
        <PriorityForm showLabel={false} />
      </form>
    </FormProvider>
  );
};

export const ConfirmPreviewedTimetablesImportForm = React.forwardRef<
  ExplicitAny,
  Props
>(ConfirmPreviewedTimetablesImportFormComponent);
