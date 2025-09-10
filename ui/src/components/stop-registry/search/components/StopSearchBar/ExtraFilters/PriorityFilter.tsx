import without from 'lodash/without';
import { FC } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapPriorityToUiName } from '../../../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../../../layoutComponents';
import { Priority, knownPriorityValues } from '../../../../../../types/enums';
import { InputLabel, LabeledCheckbox } from '../../../../../forms/common';
import { StopSearchFilters } from '../../../types';
import { DisableableFilterProps } from '../Types/DisableableFilterProps';

const testIds = {
  priorityCheckbox: (priority: Priority) =>
    `StopSearchBar::priority::${Priority[priority]}`,
};

export const PriorityFilter: FC<DisableableFilterProps> = ({
  className,
  disabled,
}) => {
  const { t } = useTranslation();

  const {
    field: { onChange, value, disabled: controllerDisabled, onBlur, ref },
  } = useController<StopSearchFilters, 'priorities'>({
    name: 'priorities',
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
        translationPrefix="stopRegistrySearch.fieldLabels"
      />
      <Row className="gap-2">
        {knownPriorityValues.map((priority) => (
          <LabeledCheckbox
            key={priority}
            label={mapPriorityToUiName(t, priority)}
            onBlur={onBlur}
            onClick={togglePriority(priority)}
            disabled={!!controllerDisabled || disabled}
            selected={value.includes(priority)}
            testId={testIds.priorityCheckbox(priority)}
            ref={ref}
          />
        ))}
      </Row>
    </Column>
  );
};
