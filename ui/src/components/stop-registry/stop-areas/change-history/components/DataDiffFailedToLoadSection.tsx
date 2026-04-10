import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import { SimpleButton } from '../../../../../uiComponents';
import { ChangeHistoryItemSectionHeaderRow } from '../../../../common/ChangeHistory';
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
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t(
              ($) => $.stopAreaChangeHistory.sectionTitle,
              historyItem,
            )}
          />
        }
        testId={testIds.failedToLoad}
      />

      <tr>
        <td className="p-5" colSpan={7}>
          {t(($) => $.stopAreaChangeHistory.failedToLoad)}
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
