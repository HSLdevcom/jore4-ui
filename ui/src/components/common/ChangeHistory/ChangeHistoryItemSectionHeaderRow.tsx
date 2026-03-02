import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { mapToShortDate, mapToShortDateTime, parseDate } from '../../../time';
import { BaseChangeHistoryItemDetails } from './types';

const testIds = {
  row: (testId: string) => `ChangeHistory::SectionHeader::${testId}`,
  title: 'ChangeHistory::SectionHeader::Title',
  validityStart: 'ChangeHistory::SectionHeader::ValidityStart',
  validityEnd: 'ChangeHistory::SectionHeader::ValidityEnd',
  validityCombined: 'ChangeHistory::SectionHeader::ValidityCombined',
  changedBy: 'ChangeHistory::SectionHeader::ChangedBy',
  changed: 'ChangeHistory::SectionHeader::Changed',
  changedCombined: 'ChangeHistory::SectionHeader::ChangedCombined',
};

type ChangeHistoryItemSectionHeaderRowProps = {
  readonly className?: string;
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly historyItem: BaseChangeHistoryItemDetails;
  readonly sectionTitle: ReactNode;
  readonly testId: string;
};

export const ChangeHistoryItemSectionHeaderRow: FC<
  ChangeHistoryItemSectionHeaderRowProps
> = ({
  className,
  getUserNameById,
  historyItem,
  sectionTitle,
  testId,
}: ChangeHistoryItemSectionHeaderRowProps) => {
  return (
    <tr
      className={twMerge('bg-hsl-neutral-blue', className)}
      data-testid={testIds.row(testId)}
      data-timestamp={parseDate(historyItem.changed)?.toUTC().toISO()}
      data-validity-start={historyItem.validityStart}
      data-validity-end={historyItem.validityEnd}
    >
      {/* Title spans all the way through the name and value fields */}
      <td
        className="py-3 pr-2 pl-2 xl:pr-5"
        colSpan={3}
        data-testid={testIds.title}
      >
        {sectionTitle}
      </td>

      {/* See the <ChangeHistoryTable> component for more details. */}
      <td
        className="hidden px-2 py-3 text-right lg:table-cell xl:px-5"
        data-testid={testIds.validityStart}
      >
        {mapToShortDate(historyItem.validityStart)}
      </td>
      <td
        className="hidden px-2 py-3 text-right lg:table-cell xl:px-5"
        data-testid={testIds.validityEnd}
      >
        {mapToShortDate(historyItem.validityEnd)}
      </td>
      <td
        className="px-2 py-3 text-right lg:hidden xl:px-5"
        data-testid={testIds.validityCombined}
      >
        <div>{mapToShortDate(historyItem.validityStart)}</div>
        <div>{mapToShortDate(historyItem.validityEnd)}</div>
      </td>

      {/* See the <ChangeHistoryTable> component for more details. */}
      <td
        className="pt-y hidden px-2 text-right lg:table-cell xl:px-5"
        data-testid={testIds.changedBy}
      >
        {getUserNameById(historyItem.changedBy) ?? 'HSL'}
      </td>
      <td
        className="hidden py-3 pr-2 pl-2 text-right text-nowrap lg:table-cell xl:pl-5"
        data-testid={testIds.changed}
      >
        {mapToShortDateTime(historyItem.changed)}
      </td>
      <td
        className="py-3 pr-2 pl-2 text-right text-nowrap lg:hidden xl:pl-5"
        data-testid={testIds.changedCombined}
      >
        <div>{getUserNameById(historyItem.changedBy) ?? 'HSL'}</div>
        <div>{mapToShortDateTime(historyItem.changed)}</div>
      </td>
    </tr>
  );
};
