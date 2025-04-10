import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Row } from '../../../layoutComponents';
import { requiredString } from './customZodSchemas';
import { FormColumn } from './FormColumn';
import { FormRow } from './FormRow';
import { InputField } from './InputField';

export const validityPeriodFormSchema = z.object({
  validityStart: requiredString.regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),
  // TODO: also validityEnd could/should be validated against regex
  // but only when "indefinite" is set to false. Anyway, seems like zod
  // schemas start to cause TS errors if merged with each other after
  // .partial() and .refine() methods have been called, so validation
  // is left out for now. See message of commit
  // c7f8d6f6f95712a6d7a6d5003c4b170390e731f9 for details
  validityEnd: z.string().optional(),
  indefinite: z.boolean(),
});

export type ValidityPeriodFormState = z.infer<typeof validityPeriodFormSchema>;

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
            translationPrefix="validityPeriod"
            fieldPath="validityStart"
            testId={testIds.startDateInput}
          />
          <InputField<ValidityPeriodFormState>
            className={indefinite ? 'hidden' : ''}
            type="date"
            translationPrefix="validityPeriod"
            fieldPath="validityEnd"
            testId={testIds.endDateInput}
          />
        </FormRow>
      </FormColumn>
      <Row>
        <label htmlFor="indefinite" className="mt-3.5 inline-flex font-normal">
          <input
            type="checkbox"
            id="indefinite"
            {...register('indefinite', {})}
            className="mr-3.5 h-6 w-6"
            data-testid={testIds.indefiniteCheckbox}
          />
          {t('saveChangesModal.indefinite')}
        </label>
      </Row>
    </div>
  );
};
