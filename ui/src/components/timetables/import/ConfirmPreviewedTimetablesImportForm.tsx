import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Column, Row } from '../../../layoutComponents';
import {
  PriorityForm,
  priorityFormSchema
} from '../../forms/common';
import {
  TimetableImportStrategyForm,
  timetableImportStrategyFormSchema
} from './TimetableImportStrategyForm';

const schema = priorityFormSchema.merge(timetableImportStrategyFormSchema);
export type FormState = z.infer<typeof schema>;

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
        <Row className="space-x-6">
          <PriorityForm showLabel={false} />
          <Column className="self-center">
            <TimetableImportStrategyForm testIdPrefix="ConfirmPreviewedTimetablesImportForm" />
          </Column>
        </Row>
      </form>
    </FormProvider>
  );
};

export const ConfirmPreviewedTimetablesImportForm = React.forwardRef<
  ExplicitAny,
  Props
>(ConfirmPreviewedTimetablesImportFormComponent);
