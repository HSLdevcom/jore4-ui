import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Row } from '../../../layoutComponents';
import { Priority } from '../../../types/enums';
import { FormContainer, SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import { refineValidityPeriodSchema } from '../common';
import {
  ChangeValidityForm,
  FormState as ChangeValidityFormState,
  schema as changeValidityFormSaveFormSchema,
} from '../common/ChangeValidityForm';
import { useDirtyFormBlockNavigation } from '../common/NavigationBlocker';
import {
  LinePropertiesForm,
  FormState as LinePropertiesFormState,
  schema as linePropertiesFormSchema,
} from './LinePropertiesForm';

export type FormState = LinePropertiesFormState & ChangeValidityFormState;

const testIds = {
  saveButton: 'LineForm::saveButton',
  cancelButton: 'LineForm::cancelButton',
};

const formSchema = linePropertiesFormSchema
  .merge(changeValidityFormSaveFormSchema)
  .superRefine(refineValidityPeriodSchema);

type LineFormProps = {
  readonly defaultValues: Partial<FormState>;
  readonly onSubmit: (state: FormState) => void;
};

export const LineForm: FC<LineFormProps> = ({ defaultValues, onSubmit }) => {
  const navigate = useNavigate();
  const formRef = useRef<ExplicitAny>(null);

  const { t } = useTranslation();

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'LineForm');
  const { handleSubmit } = methods;

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onCancel = () => {
    navigate(-1);
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
            <ChangeValidityForm
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
