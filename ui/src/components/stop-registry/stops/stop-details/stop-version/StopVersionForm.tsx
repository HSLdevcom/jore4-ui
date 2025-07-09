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
import { AffectedRouteLabels } from '../../../../timetables/common/AffectedRouteLabels';
import { ExistingStopValidityRange, StopVersionFormState } from './types';
import { LinesByStop } from './types/LinesByStopResult';
import { ValidityRangeIsValidVirtualField } from './ValidityRangeIsValidVirtualField';

const testIds = {
  form: 'StopVersionForm::form',
  versionName: 'StopVersionForm::versionName',
  versionDescription: 'StopVersionForm::versionDescription',
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

  return (
    <form
      onSubmit={onSubmit}
      className={twMerge(`space-y-4`, className)}
      data-testid={testIds.form}
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
          title={t(
            'stopDetails.version.fields.versionDescriptionNotImplementedYetTitle',
          )}
        />
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
