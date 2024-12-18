import { FC, FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../../../../layoutComponents';
import { SimpleButton } from '../../../../../uiComponents';
import {
  FormRow,
  InputField,
  PriorityForm,
  ValidityPeriodForm,
} from '../../../../forms/common';
import { StopVersionFormState } from './types';

const testIds = {
  content: 'StopVersionForm::content',
  versionName: 'StopVersionForm::versionName',
  versionDescription: 'StopVersionForm::versionDescription',
  priority: 'StopVersionForm::priority',
  startDate: 'StopVersionForm::startDate',
  endDate: 'StopVersionForm::endDate',
  indefinite: 'StopVersionForm::indefinite',
  submitButton: 'StopVersionForm::submitButton',
  cancelButton: 'StopVersionForm::cancelButton',
};

type StopVersionFormProps = {
  readonly className?: string;
  readonly onCancel: () => void;
  readonly onSubmit: FormEventHandler<HTMLFormElement>;
};

export const StopVersionForm: FC<StopVersionFormProps> = ({
  className,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={onSubmit}
      className={twMerge(`space-y-4`, className)}
      data-testid={testIds.content}
    >
      <FormRow>
        <InputField<StopVersionFormState>
          type="text"
          translationPrefix="stopDetails.version.fields"
          fieldPath="versionName"
          testId={testIds.versionName}
        />
      </FormRow>
      <FormRow>
        <InputField<StopVersionFormState>
          type="text"
          translationPrefix="stopDetails.version.fields"
          fieldPath="versionDescription"
          testId={testIds.versionDescription}
          disabled
        />
      </FormRow>

      <FormRow>
        <PriorityForm />
      </FormRow>

      <FormRow>
        <ValidityPeriodForm />
      </FormRow>

      <Row className="justify-end space-x-4">
        <SimpleButton inverted onClick={onCancel} testId={testIds.cancelButton}>
          {t('cancel')}
        </SimpleButton>
        <SimpleButton type="submit" testId={testIds.submitButton}>
          {t('save')}
        </SimpleButton>
      </Row>
    </form>
  );
};
