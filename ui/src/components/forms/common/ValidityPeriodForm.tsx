import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Row } from '../../common/LayoutComponents';
import { FormColumn } from './FormColumn';
import { FormRow } from './FormRow';
import { InputField } from './InputField';
import { ValidityPeriodFormState } from './ValidityPeriodForm.schema';

const testIds = {
  startDateInput: 'ValidityPeriodForm::startDateInput',
  endDateInput: 'ValidityPeriodForm::endDateInput',
  indefiniteCheckbox: 'ValidityPeriodForm::indefiniteCheckbox',
};

type ValidityPeriodFormProps = {
  readonly className?: string;
  readonly dateInputRowClassName?: string;
};

/**
 * Component for selecting validity period for an entity (e.g. line, route, stop).
 * Can be merged with other forms.
 */
export const ValidityPeriodForm: FC<ValidityPeriodFormProps> = ({
  className,
  dateInputRowClassName,
}) => {
  const { t } = useTranslation();
  const { register, watch } = useFormContext<ValidityPeriodFormState>();

  const indefinite = watch('indefinite');

  return (
    <div className={className}>
      <FormColumn>
        <FormRow className={dateInputRowClassName} mdColumns={2}>
          <InputField<ValidityPeriodFormState>
            type="date"
            max="9999-12-31"
            translationPrefix="validityPeriod"
            fieldPath="validityStart"
            testId={testIds.startDateInput}
          />
          <InputField<ValidityPeriodFormState>
            className={indefinite ? 'hidden' : ''}
            type="date"
            max="9999-12-31"
            translationPrefix="validityPeriod"
            fieldPath="validityEnd"
            testId={testIds.endDateInput}
          />
        </FormRow>
      </FormColumn>
      <Row>
        <label
          htmlFor="indefinite"
          className="mt-3.5 inline-flex items-center gap-3.5 font-normal"
        >
          <input
            type="checkbox"
            id="indefinite"
            {...register('indefinite', {})}
            className="h-6 w-6 shrink-0"
            data-testid={testIds.indefiniteCheckbox}
          />
          {t(($) => $.saveChangesModal.indefinite)}
        </label>
      </Row>
    </div>
  );
};
