import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Row, Visible } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import { CombineSameContractWarning } from './CombineSameContractWarning';
import { SpecialDayMixedPrioritiesWarning } from './SpecialDayMixedPrioritiesWarning';
import { TimetableImportStrategyForm } from './TimetableImportStrategyForm';
import {
  FormState,
  timetablesImportFormSchema,
} from './TimetablesImportFormSchema';
import { TimetablesImportPriorityForm } from './TimetablesImportPriorityForm';

interface Props {
  defaultValues?: Partial<FormState>;
  className?: string;
  combiningSameContractTimetables: boolean;
  inconsistentSpecialDayPrioritiesStaged: boolean;
  fetchStagingAndTargetFramesForCombine: (priority: number) => void;
  clearStagingAndTargetFramesForCombine: () => void;
  onSubmit: (state: FormState) => void;
  onCancel: () => void;
}

const testIds = {
  saveButton: 'ConfirmTimetablesImportForm::saveButton',
  cancelButton: 'ConfirmTimetablesImportForm::cancelButton',
  strategyRadioButtonPrefix: 'ConfirmTimetablesImportForm',
};

export const ConfirmTimetablesImportForm = ({
  defaultValues,
  className = '',
  combiningSameContractTimetables,
  inconsistentSpecialDayPrioritiesStaged,
  fetchStagingAndTargetFramesForCombine,
  clearStagingAndTargetFramesForCombine,
  onSubmit,
  onCancel,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);

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

  const onSave = () => {
    submitFormByRef(formRef);
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        id="confirm-timetables-import-form"
        className={className}
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
      >
        <div className="space-y-7">
          <h3>{t('confirmTimetablesImportModal.importStrategy.title')}</h3>
          <TimetableImportStrategyForm
            testIdPrefix={testIds.strategyRadioButtonPrefix}
          />

          <Visible visible={combiningSameContractTimetables}>
            <CombineSameContractWarning />
          </Visible>

          <h3>{t('confirmTimetablesImportModal.priority')}</h3>
          <TimetablesImportPriorityForm />

          <Visible visible={inconsistentSpecialDayPrioritiesStaged}>
            <SpecialDayMixedPrioritiesWarning />
          </Visible>

          <Row className="mt-10 justify-end space-x-4">
            <SimpleButton
              testId={testIds.cancelButton}
              onClick={onCancel}
              inverted
            >
              {t('cancel')}
            </SimpleButton>
            <SimpleButton testId={testIds.saveButton} onClick={onSave}>
              {t('save')}
            </SimpleButton>
          </Row>
        </div>
      </form>
    </FormProvider>
  );
};
