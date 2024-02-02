import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row, Visible } from '../../../layoutComponents';
import { TimetablePriority } from '../../../types/enums';
import { SimpleButton } from '../../../uiComponents';

export const timetablesImportPriorityFormSchema = z.object({
  priority: z.nativeEnum(TimetablePriority),
});

export type TimetablesImportPriorityFormState = z.infer<
  typeof timetablesImportPriorityFormSchema
>;

const testIds = {
  priorityButton: (testIdPrefix: string) =>
    `TimetablesImportPriorityForm::${testIdPrefix}PriorityButton`,
};

interface PriorityButtonProps {
  priority: TimetablePriority;
  testIdPrefix: string;
  translationKey: string;
}

interface Props {
  showLabel?: boolean;
}

/**
 * Component for selecting priority for timetables import.
 * Can be merged with other forms.
 */
export const TimetablesImportPriorityForm = ({
  showLabel = true,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TimetablesImportPriorityFormState>();

  const selectedPriority = watch('priority');
  const setPriority = (value: TimetablePriority) => {
    setValue('priority', value);
  };

  const displayedPriorities: PriorityButtonProps[] = [
    {
      priority: TimetablePriority.Draft,
      testIdPrefix: 'draft',
      translationKey: 'priority.draft',
    },
    {
      priority: TimetablePriority.Standard,
      testIdPrefix: 'standard',
      translationKey: 'priority.standard',
    },
    {
      priority: TimetablePriority.Temporary,
      testIdPrefix: 'temporary',
      translationKey: 'priority.temporary',
    },
  ];

  const isSpecialPriority = selectedPriority === TimetablePriority.Special;

  return (
    <Column>
      <Visible visible={showLabel}>
        <label htmlFor="priorityButtons">{t('priority.label')}</label>
      </Visible>
      <Row identifier="priorityButtons" className="flex-wrap gap-2">
        {displayedPriorities.map(
          ({ priority, testIdPrefix, translationKey }) => (
            <SimpleButton
              key={testIdPrefix}
              disabled={isSpecialPriority}
              onClick={() => setPriority(priority)}
              selected={selectedPriority === priority}
              inverted={selectedPriority !== priority}
              testId={testIds.priorityButton(testIdPrefix)}
            >
              {t(translationKey)}
            </SimpleButton>
          ),
        )}

        <label
          htmlFor={testIds.priorityButton('specialDay')}
          title={t(
            'timetablesImportPriorityForm.specialDayDisabledExplanation',
          )}
          className={`inline-flex items-center pl-4 text-base font-normal ${
            !isSpecialPriority ? 'hidden' : ''
          }`}
        >
          {t('timetablesImportPriorityForm.importAsSpecialDay')}
          <input
            type="checkbox"
            id={testIds.priorityButton('specialDay')}
            checked={isSpecialPriority}
            disabled
            className="ml-3 h-6 w-6"
            data-testid={testIds.priorityButton('specialDay')}
          />
        </label>
      </Row>
      <p>{errors.priority && t('formValidation.required')}</p>
    </Column>
  );
};
