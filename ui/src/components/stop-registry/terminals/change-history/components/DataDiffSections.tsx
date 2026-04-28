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
import { useGetHistoricalTerminalDetails } from '../queries';
import {
  diffInfoSpots,
  diffTerminalBasicDetails,
  diffTerminalExternalLinks,
  diffTerminalOwnerDetails,
  diffTerminalStops,
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
  } = useGetHistoricalTerminalDetails(historyItem);
  const {
    data: previous,
    error: previousError,
    refetch: previousRefetch,
    loading: previousLoading,
  } = useGetHistoricalTerminalDetails(previousHistoryItem);

  if (currentLoading || previousLoading) {
    return (
      <DataDiffSectionLoading
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={t(
          ($) => $.terminalChangeHistory.sectionTitle,
          historyItem,
        )}
        headerTestId="LoadingTerminalData"
        contentTestId="ChangeHistory::LoadingTerminalData::Content"
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
        sectionTitle={t(
          ($) => $.terminalChangeHistory.sectionTitle,
          historyItem,
        )}
        headerTestId="FailedToLoadTerminalData"
        retryButtonTestId="ChangeHistory::FailedToLoadTerminalData::RetryButton"
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
          section={t(($) => $.terminalChangeHistory.sectionTitle)}
        />
      }
      noChangedValuesTitleTestId="NoChanges"
      sections={[
        {
          testId: 'TerminalDetails',
          diffVersions: diffTerminalBasicDetails,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.terminalChangeHistory.sectionTitle)}
            />
          ),
        },
        {
          testId: 'TerminalStops',
          diffVersions: diffTerminalStops,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.terminalChangeHistory.stopsSectionTitle)}
            />
          ),
        },
        {
          testId: 'TerminalExternalLinks',
          diffVersions: diffTerminalExternalLinks,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopDetails.externalLinks.externalLinks)}
            />
          ),
        },
        {
          testId: 'OwnerDetails',
          diffVersions: diffTerminalOwnerDetails,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.terminalChangeHistory.ownerDetails)}
            />
          ),
        },
        {
          testId: 'InfoSpotDetails',
          diffVersions: diffInfoSpots,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.terminalChangeHistory.infoSpots.title)}
            />
          ),
        },
      ]}
    />
  );
};
