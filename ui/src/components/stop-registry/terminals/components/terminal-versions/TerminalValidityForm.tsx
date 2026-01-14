import { FC, FormEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../../../../layoutComponents';
import { SimpleButton } from '../../../../../uiComponents';
import {
  FormRow,
  ReasonForChangeForm,
  ValidityPeriodForm,
} from '../../../../forms/common';

const testIds = {
  form: 'TerminalValidityForm::form',
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
  const { formState } = useFormContext();

  return (
    <form
      onSubmit={onSubmit}
      className={twMerge(`space-y-4`, className)}
      data-testid={testIds.form}
    >
      <FormRow>
        <ReasonForChangeForm />
      </FormRow>

      <FormRow>
        <ValidityPeriodForm />
      </FormRow>

      <Row className="-mx-12 -mb-8 justify-end space-x-4 border border-light-grey bg-background px-12 py-2">
        <SimpleButton inverted onClick={onCancel} testId={testIds.cancelButton}>
          {t('cancel')}
        </SimpleButton>
        <SimpleButton
          type="submit"
          testId={testIds.submitButton}
          disabled={!formState.isDirty || formState.isSubmitting}
        >
          {t('save')}
        </SimpleButton>
      </Row>
    </form>
  );
};
