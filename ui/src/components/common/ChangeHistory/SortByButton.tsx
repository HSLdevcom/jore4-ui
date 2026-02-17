import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { SortOrder } from '../../../types';
import { ChangeHistorySortingInfo, SortChangeHistoryBy } from './types';

const testIds = {
  button: (value: SortChangeHistoryBy) => `SortByButton::${value}`,
};

function reverseSortingOrder(sortOrder: SortOrder): SortOrder {
  if (sortOrder === SortOrder.ASCENDING) {
    return SortOrder.DESCENDING;
  }

  return SortOrder.ASCENDING;
}

type SortByButtonProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly setSortingInfo: Dispatch<SetStateAction<ChangeHistorySortingInfo>>;
  readonly sortingInfo: ChangeHistorySortingInfo;
  readonly sortBy: SortChangeHistoryBy;
};

export const SortByButton: FC<SortByButtonProps> = ({
  children,
  className,
  setSortingInfo,
  sortingInfo,
  sortBy,
}) => {
  const onClick = () => {
    setSortingInfo((p) => {
      if (p.sortBy === sortBy) {
        return { sortBy, sortOrder: reverseSortingOrder(p.sortOrder) };
      }

      return { sortBy, sortOrder: p.sortOrder };
    });
  };

  return (
    <button
      className={twMerge(
        'group flex items-center gap-2',
        'data-[is-active=true]:underline',
        className,
      )}
      type="button"
      onClick={onClick}
      data-testid={testIds.button(sortBy)}
      data-is-active={sortingInfo.sortBy === sortBy}
      data-sort-direction={sortingInfo.sortOrder}
    >
      <span>{children}</span>

      <FaChevronDown
        className="text-tweaked-brand transition-transform group-data-[sort-direction=desc]:rotate-z-180"
        aria-hidden
      />
    </button>
  );
};
