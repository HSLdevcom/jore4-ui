import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Row } from '../../../layoutComponents';
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
            <LinePropertiesForm className="mb-2 ml-2" />
          </FormContainer>
        </Row>
        <Row className="mt-2">
          <FormContainer className="w-full p-6">
            <ConfirmSaveForm className="mb-2 ml-2" />
          </FormContainer>
        </Row>
        <Row className="mt-8 space-x-5">
          <SimpleButton
            id="cancel-button"
            className="ml-auto"
            onClick={onCancel}
            inverted
          >
            {t('cancel')}
          </SimpleButton>
          <SimpleButton id="save-button" onClick={onSave}>
            {t('save')}
          </SimpleButton>
        </Row>
      </form>
    </FormProvider>
  );
};
