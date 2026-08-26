import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { FilterItem } from './types';

type FilterProps = {
  readonly className?: string;
  readonly filter: FilterItem;
};

export const FilterRow: FC<FilterProps> = ({
  className,
  filter: { id, isActive, label, toggleFunction, disabled },
}) => {
  return (
    <label htmlFor={id} className={twMerge('mb-0 flex font-normal', className)}>
      <input
        id={id}
        type="checkbox"
        className="mr-3.5 h-6 w-6"
        onChange={(e) => toggleFunction(e.target.checked)}
        // If filter is disabled, make it appear as not checked
        checked={isActive}
        disabled={disabled}
      />
      {label}
    </label>
  );
};
