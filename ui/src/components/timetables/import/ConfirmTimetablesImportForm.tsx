import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Row, Visible } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import { useDirtyFormBlockNavigation } from '../../forms/common/NavigationBlocker';
import { CombineSameContractWarning } from './CombineSameContractWarning';
import { SpecialDayMixedPrioritiesWarning } from './SpecialDayMixedPrioritiesWarning';
import { TimetableImportStrategyForm } from './TimetableImportStrategyForm';
import {
  FormState,
  timetablesImportFormSchema,
} from './TimetablesImportFormSchema';
import { TimetablesImportPriorityForm } from './TimetablesImportPriorityForm';

type ConfirmTimetablesImportFormProps = {
  readonly defaultValues?: Partial<FormState>;
  readonly className?: string;
  readonly combiningSameContractTimetables: boolean;
  readonly inconsistentSpecialDayPrioritiesStaged: boolean;
  readonly fetchStagingAndTargetFramesForCombine: (priority: number) => void;
  readonly clearStagingAndTargetFramesForCombine: () => void;
  readonly onSubmit: (state: FormState) => void;
  readonly onCancel: () => void;
};

const testIds = {
  saveButton: 'ConfirmTimetablesImportForm::saveButton',
  cancelButton: 'ConfirmTimetablesImportForm::cancelButton',
  strategyRadioButtonPrefix: 'ConfirmTimetablesImportForm',
};

export const ConfirmTimetablesImportForm: FC<
  ConfirmTimetablesImportFormProps
> = ({
  defaultValues,
  className,
  combiningSameContractTimetables,
  inconsistentSpecialDayPrioritiesStaged,
  fetchStagingAndTargetFramesForCombine,
  clearStagingAndTargetFramesForCombine,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(timetablesImportFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'ConfirmTimetablesImportForm');

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
            <CombineSameContractWarning
              className="w-[480px]"
              iconClassName="h-12 w-12"
            />
          </Visible>

          <h3>{t('confirmTimetablesImportModal.priority')}</h3>
          <TimetablesImportPriorityForm />

          <Visible visible={inconsistentSpecialDayPrioritiesStaged}>
            <SpecialDayMixedPrioritiesWarning />
          </Visible>

          <Row className="mt-10 justify-end gap-4">
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
