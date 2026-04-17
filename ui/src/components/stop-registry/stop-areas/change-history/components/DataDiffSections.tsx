import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import { ChangedValuesWithHeaderRow } from '../../../../common/ChangeHistory';
import { useGetHistoricalStopAreaDetails } from '../queries';
import {
  diffStopAreaBasicDetails,
  diffStopAreaStops,
  diffStopAreaTerminal,
} from '../utils';
import { DataDiffFailedToLoadSection } from './DataDiffFailedToLoadSection';
import { DataDiffSectionLoading } from './DataDiffSectionLoading';
import { SectionTitle } from './SectionTitle';

type DataDiffSectionsProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: StopPlaceChangeHistoryItem;
  readonly previousHistoryItem: StopPlaceChangeHistoryItem;
};

export const DataDiffSections: FC<DataDiffSectionsProps> = ({
  getUserNameById,
  historyItem,
  previousHistoryItem,
}) => {
  const { t } = useTranslation();

  const {
    data: current,
    error: currentError,
    refetch: currentRefetch,
    loading: currentLoading,
  } = useGetHistoricalStopAreaDetails(historyItem);
  const {
    data: previous,
    error: previousError,
    refetch: previousRefetch,
    loading: previousLoading,
  } = useGetHistoricalStopAreaDetails(previousHistoryItem);

  if (currentLoading || previousLoading) {
    return (
      <DataDiffSectionLoading
        getUserNameById={getUserNameById}
        historyItem={historyItem}
      />
    );
  }

  if (!!currentError || !!previousError || !current || !previous) {
    return (
      <DataDiffFailedToLoadSection
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        refetch={() => {
          if (currentError) {
            currentRefetch();
          }
          if (previousError) {
            previousRefetch();
          }
        }}
      />
    );
  }

  return (
    <>
      <ChangedValuesWithHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        diffVersions={diffStopAreaBasicDetails}
        current={current}
        previous={previous}
        testId="StopAreaDetails"
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t(($) => $.stopAreaChangeHistory.sectionTitle)}
          />
        }
      />

      <ChangedValuesWithHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        diffVersions={diffStopAreaStops}
        current={current}
        previous={previous}
        testId="StopAreaStops"
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t(($) => $.stopAreaChangeHistory.stopsSectionTitle)}
          />
        }
      />

      <ChangedValuesWithHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        diffVersions={diffStopAreaTerminal}
        current={current}
        previous={previous}
        testId="StopAreaTerminal"
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t(($) => $.stopAreaChangeHistory.terminalSectionTitle)}
          />
        }
      />
    </>
  );
};
