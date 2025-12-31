import { FC } from 'react';
import { twJoin } from 'tailwind-merge';

const testIds = {
  selectAllButton: 'StopSearchResultsPage::selectAllButton',
};

type SelectAllCheckboxProps = {
  readonly allSelected: boolean;
  readonly className?: string;
  readonly onToggleSelectAll: () => void;
  readonly testId?: string;
};

export const SelectAllCheckbox: FC<SelectAllCheckboxProps> = ({
  allSelected,
  className,
  onToggleSelectAll,
  testId = testIds.selectAllButton,
}) => {
  return (
    <input
      checked={allSelected}
      className={twJoin('h-7 w-7 accent-tweaked-brand', className)}
      data-testid={testId}
      id={testId}
      onChange={onToggleSelectAll}
      type="checkbox"
    />
  );
};
