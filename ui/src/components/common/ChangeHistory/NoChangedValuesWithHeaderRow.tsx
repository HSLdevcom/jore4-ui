import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { GetUserNameById } from '../../../hooks';
import { ChangeHistoryItemSectionHeaderRow } from './ChangeHistoryItemSectionHeaderRow';
import { BaseChangeHistoryItemDetails } from './types';

const testIds = { noChanges: 'ChangeHistory::ChangedValues::NoChangedValues' };

type NoChangedValuesWithHeaderRowProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: BaseChangeHistoryItemDetails;
  readonly sectionTitle: ReactNode;
  readonly sectionTitleClassName?: string;
  readonly testId: string;
};

export const NoChangedValuesWithHeaderRow = ({
  getUserNameById,
  historyItem,
  sectionTitle,
  sectionTitleClassName,
  testId,
}: NoChangedValuesWithHeaderRowProps): ReactNode => {
  const { t } = useTranslation();

  return (
    <>
      <ChangeHistoryItemSectionHeaderRow
        className={sectionTitleClassName}
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={sectionTitle}
        testId={testId}
      />

      <tr>
        <td className="px-2 py-5" data-testid={testIds.noChanges} colSpan={7}>
          <p>{t(($) => $.changeHistory.noChangedValues)}</p>
        </td>
      </tr>
    </>
  );
};
