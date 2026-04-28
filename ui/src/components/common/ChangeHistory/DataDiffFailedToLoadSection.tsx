import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StopPlaceChangeHistoryItem } from '../../../generated/graphql';
import { GetUserNameById } from '../../../hooks';
import { SimpleButton } from '../../../uiComponents';
import { ChangeHistoryItemSectionHeaderRow } from './ChangeHistoryItemSectionHeaderRow';
import { SectionTitle } from './SectionTitle';

const testIds = {
  // Expands to ChangeHistory::SectionHeader::FailedToLoadStopAreaData
  failedToLoad: 'FailedToLoadStopAreaData',
  retryButton: 'ChangeHistory::FailedToLoadStopAreaData::RetryButton',
};

type DataDiffFailedToLoadSectionProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: StopPlaceChangeHistoryItem;
  readonly refetch: () => void;
  readonly sectionTitle: ReactNode;
};

export const DataDiffFailedToLoadSection: FC<
  DataDiffFailedToLoadSectionProps
> = ({ getUserNameById, historyItem, refetch, sectionTitle }) => {
  const { t } = useTranslation();

  return (
    <>
      <ChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={
          <SectionTitle historyItem={historyItem} section={sectionTitle} />
        }
        testId={testIds.failedToLoad}
      />

      <tr>
        <td className="p-5" colSpan={7}>
          {t(($) => $.changeHistory.failedToLoad)}
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
            {t(($) => $.changeHistory.tryAgainButton)}
          </SimpleButton>
        </td>
      </tr>
    </>
  );
};
