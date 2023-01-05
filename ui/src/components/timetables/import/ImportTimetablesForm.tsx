import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import {
  PriorityForm,
  PriorityFormState,
  priorityFormSchema,
} from '../../forms/common';

const schema = priorityFormSchema;

export type FormState = PriorityFormState;

interface Props {
  defaultValues?: Partial<FormState>;
  className?: string;
  onSubmit: (state: FormState) => void;
  onCancel: () => void;
}

const testIds = {
  saveButton: 'ImportTimetablesForm::saveButton',
};

export const ImportTimetablesForm = ({
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
        id="save-timetables-form"
        className={className}
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
      >
        <h3 className="mb-6">{t('importTimetablesModal.priority')}</h3>
        <PriorityForm />
        <div className="pt-10">
          <Row className="space-x-4">
            <SimpleButton
              containerClassName="ml-auto"
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
