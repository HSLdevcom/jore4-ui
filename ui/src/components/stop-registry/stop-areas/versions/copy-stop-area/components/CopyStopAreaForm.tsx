import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../../../../../layoutComponents';
import { EnrichedStopPlace } from '../../../../../../types';
import { SimpleButton } from '../../../../../../uiComponents';
import {
  FormRow,
  InputField,
  ValidityPeriodForm,
} from '../../../../../forms/common';
import {
  CopyStopAreaSuccessResult,
  StopAreaVersionFormState,
} from '../../types';
import { useCopyStopAreaFormUtils } from '../hooks/useCopyStopAreaFormUtils';
import { CopyStopAreaCutConfirmationModal } from './CopyStopAreaCutConfirmationModal';

const testIds = {
  form: 'CopyStopAreaForm::form',
  versionName: 'CopyStopAreaForm::versionName',
  versionDescription: 'CopyStopAreaForm::versionDescription',
  submitButton: 'CopyStopAreaForm::submitButton',
  cancelButton: 'CopyStopAreaForm::cancelButton',
};

type CopyStopAreaFormProps = {
  readonly className?: string;
  readonly onCancel: () => void;
  readonly onCopyCreated: (result: CopyStopAreaSuccessResult) => void;
  readonly stopArea: EnrichedStopPlace;
};

export const CopyStopAreaForm: FC<CopyStopAreaFormProps> = ({
  className,
  onCancel,
  onCopyCreated,
  stopArea,
}) => {
  const { t } = useTranslation();

  const {
    methods,
    cutConfirmationState,
    onFormSubmit,
    onCutConfirmationSubmit,
    cancelCutConfirmation,
  } = useCopyStopAreaFormUtils(stopArea, onCopyCreated);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onFormSubmit)}
        className={twMerge(`space-y-4`, className)}
        data-testid={testIds.form}
      >
        <FormRow>
          <InputField<StopAreaVersionFormState>
            type="text"
            translationPrefix="stopDetails.version.fields"
            fieldPath="versionName"
            testId={testIds.versionName}
          />
        </FormRow>
        <FormRow>
          <InputField<StopAreaVersionFormState>
            type="text"
            translationPrefix="stopDetails.version.fields"
            fieldPath="versionDescription"
            testId={testIds.versionDescription}
            disabled
            title={t(
              'stopDetails.version.fields.versionDescriptionNotImplementedYetTitle',
            )}
          />
        </FormRow>

        <FormRow>
          <ValidityPeriodForm />
        </FormRow>

        <Row className="-mx-12 !-mb-8 justify-end space-x-4 border border-light-grey bg-background px-12 py-2">
          <SimpleButton
            inverted
            onClick={onCancel}
            testId={testIds.cancelButton}
          >
            {t('cancel')}
          </SimpleButton>
          <SimpleButton type="submit" testId={testIds.submitButton}>
            {t('save')}
          </SimpleButton>
        </Row>
      </form>

      <CopyStopAreaCutConfirmationModal
        modalState={cutConfirmationState}
        onClose={cancelCutConfirmation}
        onConfirm={methods.handleSubmit(onCutConfirmationSubmit)}
      />
    </FormProvider>
  );
};
