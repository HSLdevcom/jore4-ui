import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';

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
};

export const ChangeHistoryTable: FC<ChangeHistoryTableProps> = ({
  children,
  className,
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
            {t('changeHistory.tableHeaders.validityStart')}
          </th>
          <th
            className="hidden w-0 px-2 pb-5 text-right lg:table-cell xl:px-5"
            data-testid={testIds.validityEnd}
          >
            {t('changeHistory.tableHeaders.validityEnd')}
          </th>
          <th
            className="w-0 px-2 pb-5 text-right lg:hidden xl:px-5"
            data-testid={testIds.validityCombined}
          >
            <div>{t('changeHistory.tableHeaders.validityStart')}</div>
            <div>{t('changeHistory.tableHeaders.validityEnd')}</div>
          </th>
          {/* Just like the validity columns. */}
          <th
            className="hidden w-0 px-2 pb-5 text-right lg:table-cell xl:px-5"
            data-testid={testIds.changedBy}
          >
            {t('changeHistory.tableHeaders.changedBy')}
          </th>
          <th
            className="hidden w-0 px-2 pr-2 pb-5 text-right lg:table-cell xl:pl-5"
            data-testid={testIds.changed}
          >
            {t('changeHistory.tableHeaders.changed')}
          </th>
          <th
            className="w-0 px-2 pb-5 text-right lg:hidden xl:px-5"
            data-testid={testIds.changedCombined}
          >
            <div>{t('changeHistory.tableHeaders.changedBy')}</div>
            <div>{t('changeHistory.tableHeaders.changed')}</div>
          </th>
        </tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
};
