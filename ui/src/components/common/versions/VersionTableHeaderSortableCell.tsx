import { TFunction } from 'i18next';
import { AriaAttributes, Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { SortOrder } from '../../../types';
import { ExpandButton } from '../Buttons';
import { VersionTableSortingInfo } from './useVersionContainerControls';
import { VersionTableColumn } from './VersionTableColumn';

function getAriaSortValue(
  active: boolean,
  ascending: boolean,
): AriaAttributes['aria-sort'] {
  if (active) {
    return ascending ? 'ascending' : 'descending';
  }

  return undefined;
}

function trColumnName(t: TFunction, columnType: VersionTableColumn) {
  switch (columnType) {
    case 'CHANGED':
      return t(($) => $.versions.header.changed);
    case 'CHANGED_BY':
      return t(($) => $.versions.header.changed_by);
    case 'STATUS':
      return t(($) => $.versions.header.status);
    case 'VALIDITY_END':
      return t(($) => $.versions.header.validity_end);
    case 'VALIDITY_START':
      return t(($) => $.versions.header.validity_start);
    case 'VERSION_COMMENT':
      return t(($) => $.versions.header.version_comment);

    default:
      return '';
  }
}

type VersionTableHeaderSortableCellProps = {
  readonly className?: string;
  readonly tdClassName?: string;
  readonly columnType: VersionTableColumn;
  readonly sortingInfo: VersionTableSortingInfo;
  readonly setSortingInfo: Dispatch<SetStateAction<VersionTableSortingInfo>>;
  readonly testIdPrefix?: string;
};

export const VersionTableHeaderSortableCell: FC<
  VersionTableHeaderSortableCellProps
> = ({
  className,
  tdClassName,
  columnType,
  sortingInfo,
  setSortingInfo,
  testIdPrefix = 'VersionTableHeaderSortableCell',
}) => {
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
      data-testid={`${testIdPrefix}::${columnType.toLowerCase()}`}
    >
      <ExpandButton
        forSorting
        className={twJoin(active ? 'underline' : '', className)}
        iconClassName="text-base"
        expanded={!ascending}
        expandedText={trColumnName(t, columnType)}
        onClick={onClick}
        testId={`${testIdPrefix}::sortButton`}
      />
    </td>
  );
};
