import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { HorizontalSeparator } from '../../../layoutComponents';
import { FilterRow } from './FilterRow';
import { ClassNameProps } from './types';
import { useMapEntityTypeFilters } from './useMapEntityTypeFilters';

export const MapEntityTypeFilters: FC<ClassNameProps> = ({ className }) => {
  const { infoTypes, stopTypes } = useMapEntityTypeFilters();

  return (
    <div className={twMerge('flex flex-col items-stretch gap-2', className)}>
      {stopTypes.map((filter) => (
        <FilterRow key={filter.id} filter={filter} />
      ))}
      <HorizontalSeparator className="m-0" />
      {infoTypes.map((filter) => (
        <FilterRow key={filter.id} filter={filter} />
      ))}
    </div>
  );
};
