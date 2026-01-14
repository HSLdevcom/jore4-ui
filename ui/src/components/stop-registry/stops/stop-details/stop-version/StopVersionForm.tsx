import { FC, FormEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../../../../layoutComponents';
import { SimpleButton } from '../../../../../uiComponents';
import {
  FormRow,
  PriorityForm,
  ReasonForChangeForm,
  ValidityPeriodForm,
} from '../../../../forms/common';
import { AffectedRouteLabels } from '../../../../timetables/common/AffectedRouteLabels';
import { ExistingStopValidityRange } from './types';
import { LinesByStop } from './types/LinesByStopResult';
import { ValidityRangeIsValidVirtualField } from './ValidityRangeIsValidVirtualField';

const testIds = {
  form: 'StopVersionForm::form',
  submitButton: 'StopVersionForm::submitButton',
  cancelButton: 'StopVersionForm::cancelButton',
};

type StopVersionFormProps = {
  readonly className?: string;
  readonly existingValidityRanges?: ReadonlyArray<ExistingStopValidityRange>;
  readonly isEditing?: boolean;
  readonly affectedLines?: ReadonlyArray<LinesByStop>;
  readonly onCancel: () => void;
  readonly onSubmit: FormEventHandler<HTMLFormElement>;
};

export const StopVersionForm: FC<StopVersionFormProps> = ({
  className,
  existingValidityRanges,
  isEditing,
  affectedLines,
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
        <PriorityForm />
      </FormRow>

      <FormRow>
        <ValidityPeriodForm />
      </FormRow>

      {existingValidityRanges && (
        <ValidityRangeIsValidVirtualField
          existingValidityRanges={existingValidityRanges}
          isEditing={isEditing}
        />
      )}

      {affectedLines && (
        <AffectedRouteLabels
          affectedRouteLabels={affectedLines.map((l) => l.label)}
          text={t('stopDetails.version.fields.affectedLines')}
        />
      )}

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
