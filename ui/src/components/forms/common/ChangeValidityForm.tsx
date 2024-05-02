import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Row } from '../../../layoutComponents';
import { Priority } from '../../../types/enums';
import { requiredString } from './customZodSchemas';
import { FormColumn } from './FormColumn';
import { FormRow } from './FormRow';
import { InputField } from './InputField';
import {
  PriorityForm,
  PriorityFormState,
  priorityFormSchema,
} from './PriorityForm';

export const schema = z
  .object({
    validityStart: requiredString.regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),
    // TODO: also validityEnd could/should be validated against regex
    // but only when "indefinite" is set to false. Anyway, seems like zod
    // schemas start to cause TS errors if merged with each other after
    // .partial() and .refine() methods have been called, so validation
    // is left out for now. See message of commit
    // c7f8d6f6f95712a6d7a6d5003c4b170390e731f9 for details
    validityEnd: z.string().optional(),
    indefinite: z.boolean(),
  })
  .merge(priorityFormSchema);

export type FormState = z.infer<typeof schema> & PriorityFormState;

const testIds = {
  container: 'ChangeValidityForm::container',
  priorityButton: (priorityLabel: string) =>
    `ChangeValidityForm::${priorityLabel}PriorityButton`,
  startDateInput: 'ChangeValidityForm::startDateInput',
  endDateInput: 'ChangeValidityForm::endDateInput',
  indefiniteCheckbox: 'ChangeValidityForm::indefiniteCheckbox',
};

interface Props {
  className?: string;
  hiddenPriorities?: Priority[];
}

/**
 * Component for selecting priority and validity period for an entity (e.g. line, route, stop).
 * Can be merged with other forms.
 */
export const ChangeValidityForm = ({
  className = '',
  hiddenPriorities,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { register, watch } = useFormContext<FormState>();

  const indefinite = watch('indefinite');

  return (
    <div className={className} data-testid={testIds.container}>
      <h3>{t('saveChangesModal.validityPeriod')}</h3>
      <Row className="mb-4 pt-6">
        <PriorityForm hiddenPriorities={hiddenPriorities} />
      </Row>
      <FormColumn>
        <FormRow mdColumns={2}>
          <InputField<FormState>
            type="date"
            translationPrefix="validityPeriod"
            fieldPath="validityStart"
            testId={testIds.startDateInput}
          />
          <InputField<FormState>
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
