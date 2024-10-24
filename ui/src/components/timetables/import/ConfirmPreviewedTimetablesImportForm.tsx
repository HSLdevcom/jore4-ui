import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Column, Row } from '../../../layoutComponents';
import { TimetableImportStrategyForm } from './TimetableImportStrategyForm';
import {
  FormState,
  timetablesImportFormSchema,
} from './TimetablesImportFormSchema';
import { TimetablesImportPriorityForm } from './TimetablesImportPriorityForm';

interface Props {
  defaultValues?: Partial<FormState>;
  onSubmit: (state: FormState) => void;
  fetchStagingAndTargetFramesForCombine: (priority: number) => void;
  fetchRouteDeviations: (priority: number) => void;
  clearStagingAndTargetFramesForCombine: () => void;
  clearRouteDeviations: () => void;
}

export const ConfirmPreviewedTimetablesImportFormComponent = (
  {
    clearStagingAndTargetFramesForCombine,
    clearRouteDeviations,
    defaultValues,
    fetchStagingAndTargetFramesForCombine,
    fetchRouteDeviations,
    onSubmit,
  }: Props,
  externalRef: ExplicitAny,
): React.ReactElement => {
  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(timetablesImportFormSchema),
  });

  const { handleSubmit, watch } = methods;

  const { priority, timetableImportStrategy } = watch();

  useEffect(() => {
    if (timetableImportStrategy === 'combine' && priority) {
      fetchStagingAndTargetFramesForCombine(priority);
    } else {
      clearStagingAndTargetFramesForCombine();
    }
  }, [
    fetchStagingAndTargetFramesForCombine,
    clearStagingAndTargetFramesForCombine,
    priority,
    timetableImportStrategy,
  ]);

  useEffect(() => {
    if (timetableImportStrategy === 'replace' && priority) {
      fetchRouteDeviations(priority);
    } else {
      clearRouteDeviations();
    }
  }, [
    clearRouteDeviations,
    fetchRouteDeviations,
    priority,
    timetableImportStrategy,
  ]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        id="save-timetables-form"
        onSubmit={handleSubmit(onSubmit)}
        ref={externalRef}
      >
        <Row className="space-x-6">
          <TimetablesImportPriorityForm showLabel={false} />
          <div className="px-4">
            <div className="h-full border-l border-black" />
          </div>
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
