import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { Priority } from '../../../types/enums';
import { mapPriorityToUiName } from '../../../utils/i18n';
import { LabeledRadioButton, ValidationErrorList } from '../Inputs';
import { Column, Row } from '../LayoutComponents';
import { PriorityFormState } from './PriorityForm.schema';

const testIds = {
  priorityButton: (priority: Priority) =>
    `PriorityForm::${Priority[priority].toLowerCase()}PriorityButton`,
};

type PriorityFormProps = {
  readonly hiddenPriorities?: ReadonlyArray<Priority>;
  readonly priorityButtonClassName?: string;
};

/**
 * Component for selecting priority.
 * Can be merged with other forms.
 */
export const PriorityForm: FC<PriorityFormProps> = ({
  hiddenPriorities = [],
  priorityButtonClassName,
}) => {
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

  const renderRadios = (priorities: ReadonlyArray<Priority>) =>
    priorities.map((priority) => (
      <LabeledRadioButton
        key={priority}
        className={twJoin('grow', priorityButtonClassName)}
        id={`priority.${Priority[priority].toLowerCase()}`}
        fieldPath="priority"
        value={priority}
        label={mapPriorityToUiName(t, priority)}
        onClick={() => setPriority(priority)}
        selected={selectedPriority === priority}
        hasError={!!errors.priority}
        testId={testIds.priorityButton(priority)}
      />
    ));

  const showTemporary = !hiddenPriorities.includes(Priority.Temporary);

  return (
    <Column>
      <fieldset>
        <legend className="font-bold">
          {t(($) => $.priority.label)}
          <span className="ml-1 text-dark-grey">*</span>
        </legend>
        <Row className="flex-wrap gap-2">
          {renderRadios(
            [Priority.Standard, Priority.Temporary, Priority.Draft].filter(
              (priority) => !hiddenPriorities.includes(priority),
            ),
          )}
        </Row>
        {showTemporary && (
          <Row className="mt-2 flex-wrap gap-2">
            {renderRadios([Priority.Temporary1, Priority.Temporary2])}
          </Row>
        )}
        <ValidationErrorList fieldPath="priority" />
      </fieldset>
    </Column>
  );
};
