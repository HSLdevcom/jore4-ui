import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { TranslationKey } from '../../../i18n';
import { Column, Row } from '../../../layoutComponents';
import { Priority } from '../../../types/enums';
import { LabeledRadioButton } from './LabeledRadioButton';
import { ValidationErrorList } from './ValidationErrorList';

export const priorityFormSchema = z.object({
  priority: z.nativeEnum(Priority),
});

export type PriorityFormState = z.infer<typeof priorityFormSchema>;

const testIds = {
  priorityButton: (testIdPrefix: string) =>
    `PriorityForm::${testIdPrefix}PriorityButton`,
};

type PriorityButtonProps = {
  readonly priority: Priority;
  readonly testIdPrefix: string;
  readonly translationKey: TranslationKey;
};

type PriorityFormProps = {
  readonly hiddenPriorities?: ReadonlyArray<Priority>;
};

const defaultPriorities: ReadonlyArray<PriorityButtonProps> = [
  {
    priority: Priority.Standard,
    testIdPrefix: 'standard',
    translationKey: 'priority.standard',
  },
  {
    priority: Priority.Temporary,
    testIdPrefix: 'temporary',
    translationKey: 'priority.temporary',
  },
  {
    priority: Priority.Draft,
    testIdPrefix: 'draft',
    translationKey: 'priority.draft',
  },
];

/**
 * Component for selecting priority.
 * Can be merged with other forms.
 */
export const PriorityForm: FC<PriorityFormProps> = ({ hiddenPriorities }) => {
  const { t } = useTranslation();
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PriorityFormState>();

  const selectedPriority = watch('priority');
  const setPriority = (value: Priority) =>
    setValue('priority', value, {
      shouldValidate: true,
      // Enable these, just like normal react form hook onChange would.
      shouldDirty: true, // Set dirty bit: value === defaultValue
      shouldTouch: true, // Set field touched bit: true
    });

  const displayedPriorities = defaultPriorities.filter(
    (priority) => !hiddenPriorities?.includes(priority.priority),
  );

  return (
    <Column>
      <fieldset>
        <legend className="font-bold">{t('priority.label')}</legend>
        <Row className="flex-wrap gap-2">
          {displayedPriorities.map(
            ({ priority, testIdPrefix, translationKey }) => (
              <LabeledRadioButton
                className="grow"
                id={`priority.${testIdPrefix}`}
                fieldPath="priority"
                value={priority}
                key={testIdPrefix}
                label={t(translationKey)}
                onClick={() => setPriority(priority)}
                selected={selectedPriority === priority}
                hasError={!!errors.priority}
                testId={testIds.priorityButton(testIdPrefix)}
              />
            ),
          )}
        </Row>
        <ValidationErrorList fieldPath="priority" />
      </fieldset>
    </Column>
  );
};
