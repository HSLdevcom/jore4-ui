import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import {
  TimetableImportStrategyForm,
  timetableImportStrategyFormSchema,
} from './TimetableImportStrategyForm';
import {
  TimetablesImportPriorityForm,
  timetablesImportPriorityFormSchema,
} from './TimetablesImportPriorityForm';

const schema = timetablesImportPriorityFormSchema.merge(
  timetableImportStrategyFormSchema,
);
export type FormState = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<FormState>;
  className?: string;
  onSubmit: (state: FormState) => void;
  onCancel: () => void;
}

const testIds = {
  saveButton: 'ConfirmTimetablesImportForm::saveButton',
  strategyRadioButtonPrefix: 'ConfirmTimetablesImportForm',
};

export const ConfirmTimetablesImportForm = ({
  defaultValues,
  className = '',
  onSubmit,
  onCancel,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

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

          <h3>{t('confirmTimetablesImportModal.priority')}</h3>
          <TimetablesImportPriorityForm />

          <Row className="justify-end space-x-4 pt-10">
            <SimpleButton onClick={onCancel} inverted>
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
