import without from 'lodash/without';
import React, { FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { mapPriorityToUiName } from '../../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../../layoutComponents';
import { Priority, knownPriorityValues } from '../../../../../types/enums';
import { InputLabel, LabeledCheckbox } from '../../../../forms/common';
import { SearchFor, StopSearchFilters } from '../../types';

const testIds = {
  priorityCheckbox: (priority: Priority) =>
    `StopSearchBar::priority::${Priority[priority]}`,
};

type PriorityFilterProps = {
  readonly className?: string;
};

export const PriorityFilter: FC<PriorityFilterProps> = ({ className }) => {
  const {
    field: { onChange, value, disabled, onBlur, ref },
  } = useController<StopSearchFilters, 'priorities'>({
    name: 'priorities',
  });

  const notForStops =
    useFormContext<StopSearchFilters>().watch('searchFor') !== SearchFor.Stops;

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
            label={mapPriorityToUiName(priority)}
            onBlur={onBlur}
            onClick={togglePriority(priority)}
            disabled={!!disabled || notForStops}
            selected={value.includes(priority)}
            testId={testIds.priorityCheckbox(priority)}
            ref={ref}
          />
        ))}
      </Row>
    </Column>
  );
};
