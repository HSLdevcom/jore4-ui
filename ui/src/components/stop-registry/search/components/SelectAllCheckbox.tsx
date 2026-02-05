import { FC } from 'react';
import { twJoin } from 'tailwind-merge';

const testIds = {
  selectAllButton: 'StopSearchResultsPage::selectAllButton',
};

type SelectAllCheckboxProps = {
  readonly allSelected: boolean;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly onToggleSelectAll: () => void;
  readonly testId?: string;
};

export const SelectAllCheckbox: FC<SelectAllCheckboxProps> = ({
  allSelected,
  className,
  disabled = false,
  onToggleSelectAll,
  testId = testIds.selectAllButton,
}) => {
  return (
    <input
      checked={allSelected}
      className={twJoin(
        'h-7 w-7 accent-tweaked-brand',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      data-testid={testId}
      disabled={disabled}
      onChange={onToggleSelectAll}
      type="checkbox"
    />
  );
};
