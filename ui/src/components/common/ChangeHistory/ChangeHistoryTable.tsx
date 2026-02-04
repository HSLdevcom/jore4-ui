import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

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
    <table className={twMerge('leading-tight', className)}>
      <thead>
        <tr className="text-nowrap">
          <th className="px-2 pb-5 pl-2 text-left lg:w-0 xl:pr-5">
            {t('changeHistory.tableHeaders.name')}
          </th>
          <th className="px-2 pb-5 text-right text-nowrap lg:w-0 xl:px-5">
            {t('changeHistory.tableHeaders.oldValue')}
          </th>
          <th className="px-2 pb-5 text-left xl:px-5">
            {t('changeHistory.tableHeaders.newValue')}
          </th>
          {/* Minimize the column widths (w-0).
           *  When on a large screen, display the validity details on separate
           *  columns. But when we are running out of space, merge those fields
           *  into a shared 2 row column instead.
           */}
          <th className="hidden w-0 px-2 pb-5 text-right lg:table-cell xl:px-5">
            {t('changeHistory.tableHeaders.validityStart')}
          </th>
          <th className="hidden w-0 px-2 pb-5 text-right lg:table-cell xl:px-5">
            {t('changeHistory.tableHeaders.validityEnd')}
          </th>
          <th className="w-0 px-2 pb-5 text-right lg:hidden xl:px-5">
            <div>{t('changeHistory.tableHeaders.validityStart')}</div>
            <div>{t('changeHistory.tableHeaders.validityEnd')}</div>
          </th>
          {/* Just like the validity columns. */}
          <th className="hidden w-0 px-2 pb-5 text-right lg:table-cell xl:px-5">
            {t('changeHistory.tableHeaders.changedBy')}
          </th>
          <th className="hidden w-0 px-2 pr-2 pb-5 text-right lg:table-cell xl:pl-5">
            {t('changeHistory.tableHeaders.changed')}
          </th>{' '}
          <th className="w-0 px-2 pb-5 text-right lg:hidden xl:px-5">
            <div>{t('changeHistory.tableHeaders.changedBy')}</div>
            <div>{t('changeHistory.tableHeaders.changed')}</div>
          </th>
        </tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
};
