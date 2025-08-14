import { FC, FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../../../../layoutComponents';
import { SimpleButton } from '../../../../../uiComponents';
import {
  FormRow,
  InputField,
  ValidityPeriodForm,
} from '../../../../forms/common';
import { TerminalValidityFormState } from './TerminalValidityFormState';

const testIds = {
  form: 'TerminalValidityForm::form',
  versionName: 'TerminalValidityForm::versionName',
  versionDescription: 'TerminalValidityForm::versionDescription',
  submitButton: 'TerminalValidityForm::submitButton',
  cancelButton: 'TerminalValidityForm::cancelButton',
};

type TerminalValidityFormProps = {
  readonly className?: string;
  readonly onCancel: () => void;
  readonly onSubmit: FormEventHandler<HTMLFormElement>;
};

export const TerminalValidityForm: FC<TerminalValidityFormProps> = ({
  className,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={onSubmit}
      className={twMerge(`space-y-4`, className)}
      data-testid={testIds.form}
    >
      <FormRow>
        <InputField<TerminalValidityFormState>
          type="text"
          translationPrefix="terminalDetails.version.fields"
          fieldPath="versionName"
          testId={testIds.versionName}
        />
      </FormRow>
      <FormRow>
        <InputField<TerminalValidityFormState>
          type="text"
          translationPrefix="terminalDetails.version.fields"
          fieldPath="versionDescription"
          testId={testIds.versionDescription}
          disabled
          title={t(
            'terminalDetails.version.fields.versionDescriptionNotImplementedYetTitle',
          )}
        />
      </FormRow>

      <FormRow>
        <ValidityPeriodForm />
      </FormRow>

      <Row className="-mx-12 !-mb-8 justify-end space-x-4 border border-light-grey bg-background px-12 py-2">
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
