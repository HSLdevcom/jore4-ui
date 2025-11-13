import without from 'lodash/without';
import { ReactElement } from 'react';
import { FieldValues, Path, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../../i18n';
import { mapPriorityToUiName } from '../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../layoutComponents';
import { Priority, knownPriorityValues } from '../../../../types/enums';
import { InputLabel, LabeledCheckbox } from '../../../forms/common';

const testIds = {
  priorityCheckbox: (prefix: string, priority: Priority) =>
    `${prefix}::priority::${Priority[priority]}`,
};

type PriorityFilterProps<FormState extends FieldValues> = {
  readonly fieldPath: Path<FormState>;
  readonly testIdPrefix: string;
  readonly translationPrefix: TranslationKey;
  readonly className?: string;
  readonly disabled?: boolean;
};

export const PriorityFilter = <FormState extends FieldValues>({
  fieldPath,
  testIdPrefix,
  translationPrefix,
  className,
  disabled,
}: PriorityFilterProps<FormState>): ReactElement => {
  const { t } = useTranslation();

  const {
    field: { onChange, value, disabled: controllerDisabled, onBlur, ref },
  } = useController<FormState, typeof fieldPath>({
    name: fieldPath,
  });

  const togglePriority = (priority: Priority) => () => {
    if (value.includes(priority)) {
      onChange(without(value, priority).toSorted());
    } else {
      onChange(value.concat(priority).toSorted());
    }
  };

  return (
    <Column className={className}>
      <InputLabel
        fieldPath="priorities"
        translationPrefix={translationPrefix}
      />
      <Row className="gap-2">
        {knownPriorityValues.map((priority) => (
          <LabeledCheckbox
            key={priority}
            className="h-[--input-height]"
            label={mapPriorityToUiName(t, priority)}
            onBlur={onBlur}
            onClick={togglePriority(priority)}
            disabled={!!controllerDisabled || disabled}
            selected={value.includes(priority)}
            testId={testIds.priorityCheckbox(testIdPrefix, priority)}
            ref={ref}
          />
        ))}
      </Row>
    </Column>
  );
};
