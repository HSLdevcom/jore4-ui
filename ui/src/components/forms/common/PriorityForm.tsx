import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row } from '../../../layoutComponents';
import { Priority } from '../../../types/Priority';
import { SimpleButton } from '../../../uiComponents';

export const priorityFormSchema = z.object({
  priority: z.nativeEnum(Priority),
});

export type PriorityFormState = z.infer<typeof priorityFormSchema>;

const testIds = {
  priorityButton: (priorityLabel: string) =>
    `PriorityForm::${priorityLabel}PriorityButton`,
};

interface PriorityButtonProps {
  priority: Priority;
  testIdPrefix: string;
  translationKey: string;
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
 *
 * @component
 * @example
 * // Usage in LineForm.tsx:
 * <PriorityForm
 *   hiddenPriorities={[Priority.Temporary]} // Line does not have temporary priority, so hide it
 * />
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

  const PriorityButton = ({
    priority,
    testIdPrefix,
    translationKey,
  }: PriorityButtonProps) => {
    return (
      <SimpleButton
        onClick={() => setPriority(priority)}
        inverted={selectedPriority !== priority}
        testId={testIds.priorityButton(testIdPrefix)}
      >
        {t(translationKey)}
      </SimpleButton>
    );
  };

  const displayedPriorities = defaultPriorities.filter(
    (priority) => !hiddenPriorities?.includes(priority.priority),
  );

  return (
    <Column>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>{t('priority.label')}</label>
      <Row className="flex-wrap gap-2">
        {displayedPriorities.map((priority) => (
          <PriorityButton
            key={priority.testIdPrefix}
            priority={priority.priority}
            testIdPrefix={priority.testIdPrefix}
            translationKey={priority.translationKey}
          />
        ))}
      </Row>
      <p>{errors.priority && t('formValidation.required')}</p>
    </Column>
  );
};
