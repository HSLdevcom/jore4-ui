import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { SortByButton } from './SortByButton';
import { ChangeHistorySortingInfo, SortChangeHistoryBy } from './types';

const testIds = {
  table: 'ChangeHistory::Table',
  name: 'ChangeHistory::Heading::Name',
  oldValue: 'ChangeHistory::Heading::OldValue',
  newValue: 'ChangeHistory::Heading::NewValue',
  validityStart: 'ChangeHistory::Heading::ValidityStart',
  validityEnd: 'ChangeHistory::Heading::ValidityEnd',
  validityCombined: 'ChangeHistory::Heading::ValidityCombined',
  changed: 'ChangeHistory::Heading::Changed',
  changedBy: 'ChangeHistory::Heading::ChangedBy',
  changedCombined: 'ChangeHistory::Heading::ChangedCombined',
};

// one fifth of the total page content width:
// Content container size: max(96rem,100vw).
// Padding on container: tailwind-5 on each side -> 10*var(--spacing)
const dataColWidth = 'w-[calc((max(96rem,100vw)-(10*var(--spacing)))/5)]';

type ChangeHistoryTableProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly setSortingInfo: Dispatch<SetStateAction<ChangeHistorySortingInfo>>;
  readonly sortingInfo: ChangeHistorySortingInfo;
};

export const ChangeHistoryTable: FC<ChangeHistoryTableProps> = ({
  children,
  className,
  setSortingInfo,
  sortingInfo,
}) => {
  const { t } = useTranslation();

  return (
    // leading = line-height. Make text that wraps to multiple lines more compact.
    <table
      className={twMerge('leading-tight', className)}
      data-testid={testIds.table}
    >
      <thead>
        <tr className="text-nowrap">
          <th
            className={twJoin(dataColWidth, 'px-2 pb-5 pl-2 text-left xl:pr-5')}
            data-testid={testIds.name}
          >
            {t('changeHistory.tableHeaders.name')}
          </th>
          <th
            className={twJoin(dataColWidth, 'px-2 pb-5 text-left xl:px-5')}
            data-testid={testIds.oldValue}
          >
            {t('changeHistory.tableHeaders.oldValue')}
          </th>
          <th
            className={twJoin(dataColWidth, 'px-2 pb-5 text-left xl:px-5')}
            data-testid={testIds.newValue}
          >
            {t('changeHistory.tableHeaders.newValue')}
          </th>
          {/* When on a large screen, display the validity details on separate
           *  columns. But when we are running out of space, merge those fields
           *  into a shared 2 row column instead.
           */}
          <th
            className="hidden w-0 px-2 pb-5 text-right lg:table-cell xl:px-5"
            data-testid={testIds.validityStart}
          >
            <SortByButton
              setSortingInfo={setSortingInfo}
              sortingInfo={sortingInfo}
              sortBy={SortChangeHistoryBy.ValidityStart}
            >
              {t('changeHistory.tableHeaders.validityStart')}
            </SortByButton>
          </th>
          <th
            className="hidden w-0 px-2 pb-5 text-right lg:table-cell xl:px-5"
            data-testid={testIds.validityEnd}
          >
            <SortByButton
              setSortingInfo={setSortingInfo}
              sortingInfo={sortingInfo}
              sortBy={SortChangeHistoryBy.ValidityEnd}
            >
              {t('changeHistory.tableHeaders.validityEnd')}
            </SortByButton>
          </th>
          <th
            className="w-0 px-2 pb-5 text-right lg:hidden xl:px-5"
            data-testid={testIds.validityCombined}
          >
            <SortByButton
              setSortingInfo={setSortingInfo}
              sortingInfo={sortingInfo}
              sortBy={SortChangeHistoryBy.ValidityStart}
            >
              {t('changeHistory.tableHeaders.validityStart')}
            </SortByButton>
            <SortByButton
              setSortingInfo={setSortingInfo}
              sortingInfo={sortingInfo}
              sortBy={SortChangeHistoryBy.ValidityEnd}
            >
              {t('changeHistory.tableHeaders.validityEnd')}
            </SortByButton>
          </th>
          {/* Just like the validity columns. */}
          <th
            className="hidden w-0 px-2 pb-5 text-right lg:table-cell xl:px-5"
            data-testid={testIds.changedBy}
          >
            <SortByButton
              setSortingInfo={setSortingInfo}
              sortingInfo={sortingInfo}
              sortBy={SortChangeHistoryBy.ChangedBy}
            >
              {t('changeHistory.tableHeaders.changedBy')}
            </SortByButton>
          </th>
          <th
            className="hidden w-0 px-2 pr-2 pb-5 text-right lg:table-cell xl:pl-5"
            data-testid={testIds.changed}
          >
            <SortByButton
              setSortingInfo={setSortingInfo}
              sortingInfo={sortingInfo}
              sortBy={SortChangeHistoryBy.Changed}
            >
              {t('changeHistory.tableHeaders.changed')}
            </SortByButton>
          </th>
          <th
            className="w-0 px-2 pb-5 text-right lg:hidden xl:px-5"
            data-testid={testIds.changedCombined}
          >
            <SortByButton
              setSortingInfo={setSortingInfo}
              sortingInfo={sortingInfo}
              sortBy={SortChangeHistoryBy.ChangedBy}
            >
              {t('changeHistory.tableHeaders.changedBy')}
            </SortByButton>
            <SortByButton
              setSortingInfo={setSortingInfo}
              sortingInfo={sortingInfo}
              sortBy={SortChangeHistoryBy.Changed}
            >
              {t('changeHistory.tableHeaders.changed')}
            </SortByButton>
          </th>
        </tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
};
