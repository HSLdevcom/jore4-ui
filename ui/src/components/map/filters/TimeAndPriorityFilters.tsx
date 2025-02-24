import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { HorizontalSeparator } from '../../../layoutComponents';
import { FilterRow } from './FilterRow';
import { ClassNameProps } from './types';
import { useTimeAndPriorityFilters } from './useTimeAndPriorityFilters';

export const TimeAndPriorityFilters: FC<ClassNameProps> = ({ className }) => {
  const {
    highestPriorityCurrentFilter,
    timeBasedFilters,
    priorityBasedFilters,
  } = useTimeAndPriorityFilters();

  return (
    <div className={twMerge('flex flex-col items-stretch gap-2', className)}>
      <FilterRow filter={highestPriorityCurrentFilter} />
      <HorizontalSeparator className="m-0" />
      {timeBasedFilters.map((filter) => (
        <FilterRow key={filter.id} filter={filter} />
      ))}
      <HorizontalSeparator className="m-0" />
      {priorityBasedFilters.map((filter) => (
        <FilterRow key={filter.id} filter={filter} />
      ))}
    </div>
  );
};
