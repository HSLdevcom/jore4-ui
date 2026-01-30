import { FC } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { StopChangeHistoryItemSections } from './StopChangeHistoryItemSections';

type StopChangeHistoryItemProps = {
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly historyItem: QuayChangeHistoryItem;
};

export const StopChangeHistoryItem: FC<StopChangeHistoryItemProps> = ({
  getUserNameById,
  historyItem,
}) => {
  const hasComment = !!historyItem.versionComment?.trim();

  return (
    <>
      {hasComment && (
        <tr>
          <td className="pt-3" colSpan={5}>
            <h4>{historyItem.versionComment}</h4>
          </td>
        </tr>
      )}

      <StopChangeHistoryItemSections
        getUserNameById={getUserNameById}
        historyItem={historyItem}
      />
    </>
  );
};
