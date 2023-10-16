import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row, Visible } from '../../../layoutComponents';
import { Priority } from '../../../types/enums';
import { SimpleButton } from '../../../uiComponents';

export const timetablesImportPriorityFormSchema = z.object({
  priority: z.nativeEnum(Priority),
});

export type TimetablesImportPriorityFormState = z.infer<
  typeof timetablesImportPriorityFormSchema
>;

const testIds = {
  priorityButton: (testIdPrefix: string) =>
    `TimetablesImportPriorityForm::${testIdPrefix}PriorityButton`,
};

interface PriorityButtonProps {
  priority: Priority;
  testIdPrefix: string;
  translationKey: string;
}

interface Props {
  hiddenPriorities?: Priority[];
  showLabel?: boolean;
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
 * Component for selecting priority for timetables import.
 * Can be merged with other forms.
 */
export const TimetablesImportPriorityForm = ({
  hiddenPriorities,
  showLabel = true,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TimetablesImportPriorityFormState>();

  const selectedPriority = watch('priority');
  const setPriority = (value: Priority) => setValue('priority', value);

  const displayedPriorities = defaultPriorities.filter(
    (priority) => !hiddenPriorities?.includes(priority.priority),
  );

  return (
    <Column>
      <Visible visible={showLabel}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>{t('priority.label')}</label>
      </Visible>
      <Row className="flex-wrap gap-2">
        {displayedPriorities.map(
          ({ priority, testIdPrefix, translationKey }) => (
            <SimpleButton
              key={testIdPrefix}
              onClick={() => setPriority(priority)}
              selected={selectedPriority === priority}
              inverted={selectedPriority !== priority}
              testId={testIds.priorityButton(testIdPrefix)}
            >
              {t(translationKey)}
            </SimpleButton>
          ),
        )}
      </Row>
      <p>{errors.priority && t('formValidation.required')}</p>
    </Column>
  );
};
