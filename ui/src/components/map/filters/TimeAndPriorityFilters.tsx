import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { useFilterStops } from '../../../hooks';
import { HorizontalSeparator } from '../../../layoutComponents';
import { FilterRow } from './FilterRow';
import { ClassNameProps } from './types';

export const TimeAndPriorityFilters: FC<ClassNameProps> = ({ className }) => {
  const {
    highestPriorityCurrentFilterItem,
    priorityFilterItems,
    timeBasedFilterItems,
  } = useFilterStops();

  return (
    <div className={twMerge('flex flex-col items-stretch gap-2', className)}>
      <FilterRow filter={highestPriorityCurrentFilterItem} />
      <HorizontalSeparator className="m-0" />
      {timeBasedFilterItems.map((filter) => (
        <FilterRow key={filter.id} filter={filter} />
      ))}
      <HorizontalSeparator className="m-0" />
      {priorityFilterItems.map((filter) => (
        <FilterRow key={filter.id} filter={filter} />
      ))}
    </div>
  );
};
