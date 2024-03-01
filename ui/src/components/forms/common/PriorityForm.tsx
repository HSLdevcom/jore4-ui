import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { TranslationKey } from '../../../i18n';
import { Column, Row } from '../../../layoutComponents';
import { Priority } from '../../../types/enums';
import { LabeledRadioButton } from './LabeledRadioButton';

export const priorityFormSchema = z.object({
  priority: z.nativeEnum(Priority),
});

export type PriorityFormState = z.infer<typeof priorityFormSchema>;

const testIds = {
  priorityButton: (testIdPrefix: string) =>
    `PriorityForm::${testIdPrefix}PriorityButton`,
};

interface PriorityButtonProps {
  priority: Priority;
  testIdPrefix: string;
  translationKey: TranslationKey;
}

interface Props {
  hiddenPriorities?: Priority[];
}

const defaultPriorities: PriorityButtonProps[] = [
  {
    priority: Priority.Draft,
    testIdPrefix: 'draft',
    translationKey: 'priority.draft',
  },
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
];

/**
 * Component for selecting priority.
 * Can be merged with other forms.
 */
export const PriorityForm = ({ hiddenPriorities }: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PriorityFormState>();

  const selectedPriority = watch('priority');
  const setPriority = (value: Priority) => setValue('priority', value);

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
                id={`priority.${testIdPrefix}`}
                fieldPath="priority"
                value={priority}
                key={testIdPrefix}
                label={t(translationKey)}
                onClick={() => setPriority(priority)}
                selected={selectedPriority === priority}
                testId={testIds.priorityButton(testIdPrefix)}
              />
            ),
          )}
        </Row>
        <p>{errors.priority && t('formValidation.required')}</p>
      </fieldset>
    </Column>
  );
};
