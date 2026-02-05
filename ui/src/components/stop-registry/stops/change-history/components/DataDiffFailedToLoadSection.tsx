import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { SimpleButton } from '../../../../../uiComponents';
import { ChangeHistoryItemSectionHeaderRow } from '../../../../common/ChangeHistory';
import { useRefetchFailedHistoricalStopVersions } from './HistoricalStopDataProvider';
import { SectionTitle } from './SectionTitle';

type DataDiffFailedToLoadSectionProps = {
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly historyItem: QuayChangeHistoryItem;
};

export const DataDiffFailedToLoadSection: FC<
  DataDiffFailedToLoadSectionProps
> = ({ getUserNameById, historyItem }) => {
  const { t } = useTranslation();
  const refetch = useRefetchFailedHistoricalStopVersions();

  return (
    <>
      <ChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t('stopChangeHistory.failedToLoad')}
          />
        }
        testId=""
      />

      <tr>
        <td className="p-5" colSpan={7}>
          <SimpleButton shape="slim" inverted onClick={refetch}>
            {t('stopChangeHistory.tryAgainButton')}
          </SimpleButton>
        </td>
      </tr>
    </>
  );
};
