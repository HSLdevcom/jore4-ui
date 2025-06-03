import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { FC, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Row, Visible } from '../../../../../layoutComponents';
import { SimpleButton } from '../../../../../uiComponents';
import { submitFormByRef } from '../../../../../utils';
import { FormRow, InputField, requiredString } from '../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../forms/common/NavigationBlocker';

const testIds = {
  cancelButton: 'OrganisationDetailsForm::cancelButton',
  saveButton: 'OrganisationDetailsForm::saveButton',
  name: 'OrganisationDetailsForm::name',
  phone: 'OrganisationDetailsForm::phone',
  email: 'OrganisationDetailsForm::email',
};

const organisationDetailsFormSchema = z.object({
  id: z.string().optional(),
  name: requiredString,
  privateContactDetails: z.object({
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
  }),
});

export type OrganisationDetailsFormState = z.infer<
  typeof organisationDetailsFormSchema
>;

type OrganisationDetailsFormProps = {
  readonly defaultValues: Partial<OrganisationDetailsFormState>;
  readonly onSubmit: (state: OrganisationDetailsFormState) => void;
  readonly onCancel: () => void;
};

export const OrganisationDetailsForm: FC<OrganisationDetailsFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}) => {
  const formRef = useRef<ExplicitAny>(null);

  const methods = useForm<OrganisationDetailsFormState>({
    defaultValues,
    resolver: zodResolver(organisationDetailsFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'OrganisationDetailsForm');
  const { handleSubmit } = methods;

  const onSave = () => {
    submitFormByRef(formRef);
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <div className="max-w-[400px] space-y-2">
          <FormRow>
            <InputField<OrganisationDetailsFormState>
              type="text"
              translationPrefix="stopDetails.maintenance.organisation"
              fieldPath="name"
              testId={testIds.name}
            />
          </FormRow>
          <FormRow>
            <InputField<OrganisationDetailsFormState>
              type="text"
              translationPrefix="stopDetails.maintenance.organisation"
              fieldPath="privateContactDetails.phone"
              testId={testIds.phone}
            />
          </FormRow>
          <FormRow>
            <InputField<OrganisationDetailsFormState>
              type="text"
              translationPrefix="stopDetails.maintenance.organisation"
              fieldPath="privateContactDetails.email"
              testId={testIds.email}
            />
          </FormRow>
          <Visible visible={!!defaultValues.id}>
            <p>
              {t('stopDetails.maintenance.organisation.modalEditDisclaimer')}
            </p>
          </Visible>
        </div>
        <Row className="mt-8 justify-end space-x-5">
          <SimpleButton
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
