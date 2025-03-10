import { TFunction } from 'i18next';
import { AriaAttributes, Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { SortOrder } from '../../../../../types';
import { ExpandButton } from '../../../../../uiComponents';
import { StopVersionTableColumn, StopVersionTableSortingInfo } from '../types';

const testIds = {
  column: (type: StopVersionTableColumn) =>
    `StopVersionTableHeaderSortableCell::${type.toLowerCase()}`,
  sortButton: 'StopVersionTableHeaderSortableCell::sortButton',
};

function getAriaSortValue(
  active: boolean,
  ascending: boolean,
): AriaAttributes['aria-sort'] {
  if (active) {
    return ascending ? 'ascending' : 'descending';
  }

  return undefined;
}

function trColumnName(t: TFunction, columnType: StopVersionTableColumn) {
  switch (columnType) {
    case 'CHANGED':
      return t('stopVersion.header.changed');
    case 'CHANGED_BY':
      return t('stopVersion.header.changed_by');
    case 'STATUS':
      return t('stopVersion.header.status');
    case 'VALIDITY_END':
      return t('stopVersion.header.validity_end');
    case 'VALIDITY_START':
      return t('stopVersion.header.validity_start');
    case 'VERSION_COMMENT':
      return t('stopVersion.header.version_comment');

    default:
      return '';
  }
}

type StopVersionTableHeaderSortableCellProps = {
  readonly className?: string;
  readonly tdClassName?: string;
  readonly columnType: StopVersionTableColumn;
  readonly sortingInfo: StopVersionTableSortingInfo;
  readonly setSortingInfo: Dispatch<
    SetStateAction<StopVersionTableSortingInfo>
  >;
};

export const StopVersionTableHeaderSortableCell: FC<
  StopVersionTableHeaderSortableCellProps
> = ({ className, tdClassName, columnType, sortingInfo, setSortingInfo }) => {
  const { t } = useTranslation();

  const active = sortingInfo.sortBy === columnType;
  const ascending = sortingInfo.sortOrder === SortOrder.ASCENDING;

  const onClick = () => {
    setSortingInfo((prevState) => {
      if (prevState.sortBy === columnType) {
        return {
          ...prevState,
          sortOrder:
            prevState.sortOrder === SortOrder.ASCENDING
              ? SortOrder.DESCENDING
              : SortOrder.ASCENDING,
        };
      }

      return { ...prevState, sortBy: columnType };
    });
  };

  return (
    <td
      aria-sort={getAriaSortValue(active, ascending)}
      className={tdClassName}
      data-testid={testIds.column(columnType)}
    >
      <ExpandButton
        forSorting
        className={twJoin(active ? 'underline' : '', className)}
        iconClassName="text-base"
        expanded={!ascending}
        expandedText={trColumnName(t, columnType)}
        onClick={onClick}
        testId={testIds.sortButton}
      />
    </td>
  );
};
