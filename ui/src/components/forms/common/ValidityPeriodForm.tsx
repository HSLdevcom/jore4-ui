import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Row } from '../../../layoutComponents';
import { requiredString } from './customZodSchemas';
import { FormColumn } from './FormColumn';
import { FormRow } from './FormRow';
import { InputField } from './InputField';

// Allow only dates between year 1000 and 2999
const dateRegex = /^[12][0-9]{3}-[0-9]{2}-[0-9]{2}$/;

export const validityPeriodFormSchema = z.object({
  validityStart: requiredString.regex(dateRegex, 'invalidValidityStartDate'),
  validityEnd: z
    .string()
    .refine((val) => !val || dateRegex.test(val), 'invalidValidityEndDate')
    .optional(),
  indefinite: z.boolean(),
});

export type ValidityPeriodFormState = z.infer<typeof validityPeriodFormSchema>;

// Separate function for validating the validity end date.
// Run this inside a superRefine after all the schemas have been merged.
export function refineValidityPeriodSchema(
  data: { validityStart: string; validityEnd?: string; indefinite: boolean },
  ctx: z.RefinementCtx,
) {
  const { validityStart, validityEnd, indefinite } = data;

  if (indefinite) {
    return;
  }

  if (!validityEnd) {
    ctx.addIssue({
      path: ['validityEnd'],
      message: 'validityEndNotDefined',
      code: z.ZodIssueCode.custom,
    });
  } else if (!dateRegex.test(validityEnd)) {
    ctx.addIssue({
      path: ['validityEnd'],
      message: 'invalidValidityEndDate',
      code: z.ZodIssueCode.custom,
    });
  } else if (validityStart && dateRegex.test(validityStart)) {
    if (validityEnd < validityStart) {
      ctx.addIssue({
        path: ['validityEnd'],
        message: 'validityEndDateBeforeStartDate',
        code: z.ZodIssueCode.custom,
      });
    }
  }
}

const testIds = {
  startDateInput: 'ValidityPeriodForm::startDateInput',
  endDateInput: 'ValidityPeriodForm::endDateInput',
  indefiniteCheckbox: 'ValidityPeriodForm::indefiniteCheckbox',
};

type ValidityPeriodFormProps = {
  readonly className?: string;
  readonly dateInputRowClassName?: string;
  readonly compactDateInputs?: boolean;
};

/**
 * Component for selecting validity period for an entity (e.g. line, route, stop).
 * Can be merged with other forms.
 */
export const ValidityPeriodForm: FC<ValidityPeriodFormProps> = ({
  className,
  dateInputRowClassName,
  compactDateInputs,
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
            inputClassName={compactDateInputs ? 'lg:max-w-[190px]' : undefined}
          />
          <InputField<ValidityPeriodFormState>
            className={indefinite ? 'hidden' : ''}
            type="date"
            max="9999-12-31"
            translationPrefix="validityPeriod"
            fieldPath="validityEnd"
            testId={testIds.endDateInput}
            inputClassName={compactDateInputs ? 'lg:max-w-[190px]' : undefined}
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
