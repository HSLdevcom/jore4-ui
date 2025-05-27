import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row, Visible } from '../../../layoutComponents';
import { TimetablePriority } from '../../../types/enums';
import { LabeledRadioButton, ValidationErrorList } from '../../forms/common';

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

type PriorityButtonProps = {
  readonly priority: TimetablePriority;
  readonly testIdPrefix: string;
  readonly translationKey: string;
};

type TimetablesImportPriorityFormProps = {
  readonly showLabel?: boolean;
};

/**
 * Component for selecting priority for timetables import.
 * Can be merged with other forms.
 */
export const TimetablesImportPriorityForm: FC<
  TimetablesImportPriorityFormProps
> = ({ showLabel = true }) => {
  const { t } = useTranslation();
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TimetablesImportPriorityFormState>();

  const selectedPriority = watch('priority');
  const setPriority = (value: TimetablePriority) => {
    setValue('priority', value, { shouldValidate: true });
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
  const specialDayExplanationTooltip = t(
    'timetablesImportPriorityForm.specialDayDisabledExplanation',
  );

  return (
    <Column>
      <fieldset>
        <Visible visible={showLabel}>
          <legend className="font-bold">{t('priority.label')}</legend>
        </Visible>
        <Row className="flex-wrap gap-2">
          <LabeledRadioButton
            id="priority.specialDay"
            fieldPath="priority"
            value={TimetablePriority.Special}
            key="specialDay"
            className={!isSpecialPriority ? 'hidden' : ''}
            label={t('priority.special')}
            onClick={() => setPriority(TimetablePriority.Special)}
            selected={isSpecialPriority}
            tooltip={specialDayExplanationTooltip}
            hasError={!!errors.priority}
            testId={testIds.priorityButton('specialDay')}
          />
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
                hasError={!!errors.priority}
                disabled={isSpecialPriority}
                disabledTooltip={specialDayExplanationTooltip}
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
