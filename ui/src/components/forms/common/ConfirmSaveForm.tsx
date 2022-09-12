import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row } from '../../../layoutComponents';
import { Priority } from '../../../types/Priority';
import { SimpleButton } from '../../../uiComponents';
import { requiredString } from './customZodSchemas';
import { FormColumn } from './FormColumn';
import { FormRow } from './FormRow';
import { InputField } from './InputField';

export const schema = z.object({
  priority: z.nativeEnum(Priority),
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

export type FormState = z.infer<typeof schema>;

const testIds = {
  standardPriorityButton: 'ConfirmSaveForm::standardPriorityButton',
  draftPriorityButton: 'ConfirmSaveForm::draftPriorityButton',
  temporaryPriorityButton: 'ConfirmSaveForm::temporaryPriorityButton',
  startDateInput: 'ConfirmSaveForm::startDateInput',
  endDateInput: 'ConfirmSaveForm::endDateInput',
  indefiniteCheckbox: 'ConfirmSaveForm::indefiniteCheckbox',
};

interface Props {
  className?: string;
}

export const ConfirmSaveForm = ({ className = '' }: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormState>();

  const indefinite = watch('indefinite');
  const priority = watch('priority');
  const setPriority = (value: Priority) => setValue('priority', value);

  return (
    <div className={className}>
      <h2 className="pb-6 text-xl font-bold">
        {t('saveChangesModal.validityPeriod')}
      </h2>

      <Row className="mb-4">
        <Column>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>{t('priority.label')}</label>
          <Row className="flex-wrap gap-2">
            <SimpleButton
              onClick={() => setPriority(Priority.Standard)}
              inverted={priority !== Priority.Standard}
              testId={testIds.standardPriorityButton}
            >
              {t('priority.standard')}
            </SimpleButton>
            <SimpleButton
              onClick={() => setPriority(Priority.Draft)}
              inverted={priority !== Priority.Draft}
              testId={testIds.draftPriorityButton}
            >
              {t('priority.draft')}
            </SimpleButton>
            <SimpleButton
              onClick={() => setPriority(Priority.Temporary)}
              inverted={priority !== Priority.Temporary}
              testId={testIds.temporaryPriorityButton}
            >
              {t('priority.temporary')}
            </SimpleButton>
          </Row>
          <p>{errors.priority && t('formValidation.required')}</p>
        </Column>
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
        <input
          type="checkbox"
          id="indefinite"
          {...register('indefinite', {})}
          className="mr-2"
          data-testid={testIds.indefiniteCheckbox}
        />
        <label htmlFor="indefinite" className="self-center font-normal">
          {t('saveChangesModal.indefinite')}
        </label>
      </Row>
    </div>
  );
};
