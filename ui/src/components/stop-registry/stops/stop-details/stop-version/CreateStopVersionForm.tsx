import { useRef } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../hooks';
import { Row } from '../../../../../layoutComponents';
import { SimpleButton } from '../../../../../uiComponents';
import {
  FormRow,
  InputField,
  PriorityForm,
  ValidityPeriodFormState,
} from '../../../../forms/common';
import { CreateStopVersionFormState } from './createStopVersionCommon';
import { useCreateStopVersionFormUtils } from './useCreateStopVersionFormUtils';

const testIds = {
  versionName: 'CreateTimingPlaceForm::versionName',
  versionDescription: 'CreateTimingPlaceForm::versionDescription',
  priority: 'CreateTimingPlaceForm::priority',
  startDate: 'CreateTimingPlaceForm::startDate',
  endDate: 'CreateTimingPlaceForm::endDate',
  submitButton: 'CreateTimingPlaceForm::submitButton',
  cancelButton: 'CreateTimingPlaceForm::cancelButton',
};

interface Props {
  className?: string;
  onCancel: () => void;
  onSaved: () => void;
  originalStop: StopWithDetails;
}

export const CreateStopVersionForm = ({
  className = '',
  originalStop,
  onCancel,
  onSaved,
}: Props): React.ReactElement => {
  const { t } = useTranslation();

  const formRef = useRef<ExplicitAny>(null);
  const { methods, handleSubmit, onFormSubmit } = useCreateStopVersionFormUtils(
    originalStop,
    onSaved,
    formRef,
  );

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        ref={formRef}
        className={`space-y-4 ${className}`}
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
        </FormRow>
        <Row className="justify-end space-x-4">
          <SimpleButton
            inverted
            onClick={onCancel}
            testId={testIds.cancelButton}
          >
            {t('cancel')}
          </SimpleButton>
          <SimpleButton onClick={onSaved} testId={testIds.submitButton}>
            {t('save')}
          </SimpleButton>
        </Row>
      </form>
    </FormProvider>
  );
};
