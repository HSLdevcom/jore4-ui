import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import {
  ChangeValueSections,
  SectionTitle,
} from '../../../../common/ChangeHistory';
import {
  DataDiffFailedToLoadSection,
  DataDiffSectionLoading,
} from '../../../components/ChangeHistory';
import { useGetHistoricalStopAreaDetails } from '../queries';
import {
  diffStopAreaBasicDetails,
  diffStopAreaStops,
  diffStopAreaTerminal,
} from '../utils';

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
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t(($) => $.stopAreaChangeHistory.sectionTitle)}
          />
        }
        headerTestId="LoadingStopAreaData"
        contentTestId="ChangeHistory::LoadingStopAreaData::Content"
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
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t(($) => $.stopAreaChangeHistory.sectionTitle)}
          />
        }
        headerTestId="FailedToLoadStopAreaData"
        retryButtonTestId="ChangeHistory::FailedToLoadStopAreaData::RetryButton"
      />
    );
  }

  return (
    <ChangeValueSections
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      current={current}
      previous={previous}
      noChangedValuesTitle={
        <SectionTitle
          historyItem={historyItem}
          section={t(($) => $.stopAreaChangeHistory.sectionTitle)}
        />
      }
      noChangedValuesTitleTestId="NoChanges"
      sections={[
        {
          testId: 'StopAreaDetails',
          diffVersions: diffStopAreaBasicDetails,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopAreaChangeHistory.sectionTitle)}
            />
          ),
        },
        {
          testId: 'StopAreaStops',
          diffVersions: diffStopAreaStops,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopAreaChangeHistory.stopsSectionTitle)}
            />
          ),
        },
        {
          testId: 'StopAreaTerminal',
          diffVersions: diffStopAreaTerminal,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopAreaChangeHistory.terminalSectionTitle)}
            />
          ),
        },
      ]}
    />
  );
};
