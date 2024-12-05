import { useRef } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../hooks';
import { Row } from '../../../../../layoutComponents';
import { SimpleButton } from '../../../../../uiComponents';
import { submitFormByRef } from '../../../../../utils';
import {
  FormRow,
  InputField,
  LabeledCheckbox,
  PriorityForm,
  ValidityPeriodFormState,
} from '../../../../forms/common';
import { CreateStopVersionFormState } from './createStopVersionCommon';
import { useCreateStopVersionFormUtils } from './useCreateStopVersionFormUtils';

const testIds = {
  content: 'CreateStopVersionForm::content',
  versionName: 'CreateStopVersionForm::versionName',
  versionDescription: 'CreateStopVersionForm::versionDescription',
  priority: 'CreateStopVersionForm::priority',
  startDate: 'CreateStopVersionForm::startDate',
  endDate: 'CreateStopVersionForm::endDate',
  indefinite: 'CreateStopVersionForm::indefinite',
  submitButton: 'CreateStopVersionForm::submitButton',
  cancelButton: 'CreateStopVersionForm::cancelButton',
};

interface Props {
  className?: string;
  closeModal: () => void;
  originalStop: StopWithDetails;
}

export const CreateStopVersionForm = ({
  className = '',
  originalStop,
  closeModal,
}: Props): React.ReactElement => {
  const { t } = useTranslation();

  const formRef = useRef<ExplicitAny>(null);
  const { methods, onFormSubmit, onFormValidationError } =
    useCreateStopVersionFormUtils(originalStop, closeModal, formRef);

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const { handleSubmit, setValue, getValues } = methods;
  const toggleIndefinite = () => {
    setValue('indefinite', !getValues('indefinite'));
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onFormSubmit, onFormValidationError)}
        ref={formRef}
        className={`space-y-4 ${className}`}
        data-testid={testIds.content}
      >
        <FormRow>
          <InputField<CreateStopVersionFormState>
            type="text"
            translationPrefix="stops.version"
            fieldPath="versionName"
            testId={testIds.versionName}
          />
        </FormRow>
        <FormRow>
          <InputField<CreateStopVersionFormState>
            type="text"
            translationPrefix="stops.version"
            fieldPath="versionDescription"
            testId={testIds.versionDescription}
          />
        </FormRow>
        <FormRow>
          <PriorityForm />
        </FormRow>
        <FormRow mdColumns={2}>
          <InputField<ValidityPeriodFormState>
            type="date"
            translationPrefix="validityPeriod"
            fieldPath="validityStart"
            testId={testIds.startDate}
          />
          <InputField<ValidityPeriodFormState>
            // className={indefinite ? 'hidden' : ''}
            type="date"
            translationPrefix="validityPeriod"
            fieldPath="validityEnd"
            testId={testIds.endDate}
          />
          <LabeledCheckbox
            testId="CreateStopVersionForm::indefinite"
            label={t('saveChangesModal.indefinite')}
            onClick={toggleIndefinite}
          />
        </FormRow>
        <Row className="justify-end space-x-4">
          <SimpleButton
            inverted
            onClick={closeModal}
            testId={testIds.cancelButton}
          >
            {t('cancel')}
          </SimpleButton>
          <SimpleButton onClick={onSave} testId={testIds.submitButton}>
            {t('save')}
          </SimpleButton>
        </Row>
      </form>
    </FormProvider>
  );
};
