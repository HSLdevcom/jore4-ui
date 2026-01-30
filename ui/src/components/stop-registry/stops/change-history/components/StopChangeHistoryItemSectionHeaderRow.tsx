import { FC, ReactNode } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { mapToShortDate, mapToShortDateTime } from '../../../../../time';

type StopChangeHistoryItemSectionHeaderRowProps = {
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly historyItem: QuayChangeHistoryItem;
  readonly sectionTitle: ReactNode;
};

export const StopChangeHistoryItemSectionHeaderRow: FC<
  StopChangeHistoryItemSectionHeaderRowProps
> = ({ getUserNameById, historyItem, sectionTitle }) => {
  return (
    <tr className="border-b border-light-grey">
      <td className="py-3">{sectionTitle}</td>
      <td className="px-5 py-3">{mapToShortDate(historyItem.validityStart)}</td>
      <td className="px-5 py-3">{mapToShortDate(historyItem.validityEnd)}</td>
      <td className="px-5 py-3">
        {getUserNameById(historyItem.changedBy) ?? 'HSL'}
      </td>
      <td className="py-3 pl-5 text-nowrap">
        {mapToShortDateTime(historyItem.changed)}
      </td>
    </tr>
  );
};
