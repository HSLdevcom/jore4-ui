import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GetUserNameById } from '../../../../hooks';
import { SimpleButton } from '../../../../uiComponents';
import { ChangeHistoryItemSectionHeaderRow } from '../../../common/ChangeHistory';
import { LineChangeHistoryItem } from '../types';
import { ItemTitle } from './ItemTitle';

const testIds = {
  // Expands to ChangeHistory::SectionHeader::FailedToLoadLineData
  failedToLoad: 'FailedToLoadLineData',
  retryButton: 'LineChangeHistory::FailedToLoadLineData::RetryButton',
};

type DataDiffFailedToLoadSectionProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: LineChangeHistoryItem;
  readonly refetch: () => void;
};

export const DataDiffFailedToLoadSection: FC<
  DataDiffFailedToLoadSectionProps
> = ({ getUserNameById, historyItem, refetch }) => {
  const { t } = useTranslation();

  return (
    <>
      <ChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={<ItemTitle item={historyItem} />}
        testId={testIds.failedToLoad}
      />

      <tr>
        <td className="p-5" colSpan={7}>
          {t('lineChangeHistory.failedToLoad')}
        </td>
      </tr>

      <tr>
        <td className="p-5" colSpan={7}>
          <SimpleButton
            shape="slim"
            inverted
            onClick={refetch}
            testId={testIds.retryButton}
          >
            {t('changeHistory.tryAgainButton')}
          </SimpleButton>
        </td>
      </tr>
    </>
  );
};
