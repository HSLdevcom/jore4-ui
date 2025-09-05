import { TFunction } from 'i18next';
import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { Visible } from '../../../../layoutComponents';
import { PagingInfo, SortOrder, defaultPagingInfo } from '../../../../types';
import { SortStopsBy, SortingInfo } from '../types';

const testIds = {
  button: (value: SortStopsBy) => `SortByButton::${value}`,
};

function trSortStopsBy(t: TFunction, value: SortStopsBy): ReactNode {
  switch (value) {
    case SortStopsBy.ADDRESS:
      return t('stopRegistrySearch.sortBy.address');

    case SortStopsBy.LABEL:
      return t('stopRegistrySearch.sortBy.label');

    case SortStopsBy.NAME:
      return t('stopRegistrySearch.sortBy.name');

    case SortStopsBy.SEQUENCE_NUMBER:
      return t('stopRegistrySearch.sortBy.sequenceNumber');

    case SortStopsBy.BY_STOP_AREA:
      return t('stopRegistrySearch.sortBy.byStopArea');

    case SortStopsBy.BY_TERMINAL:
      return t('stopRegistrySearch.sortBy.byTerminal');

    default:
      return null;
  }
}

function reverseSortingOrder(sortOrder: SortOrder): SortOrder {
  if (sortOrder === SortOrder.ASCENDING) {
    return SortOrder.DESCENDING;
  }

  return SortOrder.ASCENDING;
}

const iconClassName = 'text-tweaked-brand';

type ProperSortable = {
  readonly groupOnly?: false;
  readonly setPagingInfo?: (pagingInfo: PagingInfo) => void;
};

type GroupOnly = {
  readonly groupOnly: true;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
};

type SortByButtonProps = {
  readonly className?: string;
  readonly isActive: boolean;
  readonly isDefault: boolean;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortBy: SortStopsBy;
  readonly sortOrder: SortOrder;
} & (ProperSortable | GroupOnly);

export const SortByButton: FC<SortByButtonProps> = ({
  className,
  groupOnly,
  isActive,
  isDefault,
  setPagingInfo,
  setSortingInfo,
  sortBy,
  sortOrder,
}) => {
  const { t } = useTranslation();

  const setToOnClick = isDefault ? SortStopsBy.DEFAULT : sortBy;

  const onClick = () => {
    setSortingInfo((p) => {
      if (groupOnly) {
        return { sortBy: setToOnClick, sortOrder: SortOrder.ASCENDING };
      }

      if (
        p.sortBy === sortBy ||
        (isDefault && p.sortBy === SortStopsBy.DEFAULT)
      ) {
        return {
          sortBy: setToOnClick,
          sortOrder: reverseSortingOrder(p.sortOrder),
        };
      }

      return { sortBy: setToOnClick, sortOrder: p.sortOrder };
    });

    if (groupOnly) {
      setPagingInfo(defaultPagingInfo);
    }
  };

  return (
    <button
      className={twMerge(
        'flex items-center gap-2',
        isActive ? 'underline' : '',
        className,
      )}
      type="button"
      onClick={onClick}
      data-testid={testIds.button(sortBy)}
      data-element-type="SortByButton"
      data-is-active={isActive}
      data-sort-direction={groupOnly ? 'groupOnly' : sortOrder}
    >
      <span>{trSortStopsBy(t, sortBy)}</span>

      <Visible visible={!groupOnly}>
        {sortOrder === SortOrder.ASCENDING ? (
          <FaChevronDown className={iconClassName} aria-hidden />
        ) : (
          <FaChevronUp className={iconClassName} aria-hidden />
        )}
      </Visible>
    </button>
  );
};
