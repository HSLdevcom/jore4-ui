import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Row } from '../../../layoutComponents';
import { Priority } from '../../../types/Priority';
import { FormContainer, SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import {
  ConfirmSaveForm,
  FormState as ConfirmSaveFormState,
  schema as confirmSaveFormSchema,
} from '../common/ConfirmSaveForm';
import {
  FormState as LinePropertiesFormState,
  LinePropertiesForm,
  schema as linePropertiesFormSchema,
} from './LinePropertiesForm';

export type FormState = LinePropertiesFormState & ConfirmSaveFormState;

const testIds = {
  saveButton: 'LineForm::saveButton',
  cancelButton: 'LineForm::cancelButton',
};

interface Props {
  defaultValues: Partial<FormState>;
  onSubmit: (state: FormState) => void;
}

export const LineForm = ({ defaultValues, onSubmit }: Props): JSX.Element => {
  const history = useHistory();
  const formRef = useRef<ExplicitAny>(null);

  const { t } = useTranslation();

  const formSchema = linePropertiesFormSchema.merge(confirmSaveFormSchema);
  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit } = methods;

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onCancel = () => {
    history.goBack();
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <Row className="mt-10">
          <FormContainer className="w-full p-6">
            <LinePropertiesForm className="m-2" />
          </FormContainer>
        </Row>
        <Row className="mt-2">
          <FormContainer className="w-full p-6">
            <ConfirmSaveForm
              className="mb-2 ml-2"
              hiddenPriorities={[Priority.Temporary]} // Line does not have temporary priority, so hide it
            />
          </FormContainer>
        </Row>
        <Row className="mt-8 space-x-5">
          <SimpleButton
            containerClassName="ml-auto"
            onClick={onCancel}
            inverted
            testId={testIds.cancelButton}
          >
            {t('cancel')}
          </SimpleButton>
          <SimpleButton
            onClick={onSave}
            id="save-button"
            testId={testIds.saveButton}
          >
            {t('save')}
          </SimpleButton>
        </Row>
      </form>
    </FormProvider>
  );
};
