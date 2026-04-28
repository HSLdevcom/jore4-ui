import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import {
  ChangeValueSections,
  SectionTitle,
} from '../../../../common/ChangeHistory';
import {
  DataDiffFailedToLoadSection,
  DataDiffSectionLoading,
} from '../../../components/ChangeHistory';
import {
  diffBasicDetails,
  diffInfoSpots,
  diffLocationDetails,
  diffMeasurementDetails,
  diffOwnerDetails,
  diffShelters,
  diffSignageDetails,
  diffStopAreaAndTerminal,
} from '../utils';
import {
  useHistoricalStopVersion,
  useRefetchFailedHistoricalStopVersions,
} from './HistoricalStopDataProvider';

type DataDiffSectionsProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: QuayChangeHistoryItem;
  readonly previousHistoryItem: QuayChangeHistoryItem;
};

export const DataDiffSections: FC<DataDiffSectionsProps> = ({
  getUserNameById,
  historyItem,
  previousHistoryItem,
}) => {
  const { t } = useTranslation();
  const refetch = useRefetchFailedHistoricalStopVersions();

  const currentCached = useHistoricalStopVersion(historyItem);
  const previousCached = useHistoricalStopVersion(previousHistoryItem);

  if (currentCached.status === 'error' || previousCached.status === 'error') {
    return (
      <DataDiffFailedToLoadSection
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        refetch={refetch}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t(($) => $.stopChangeHistory.sectionTitle)}
          />
        }
        headerTestId="FailedToLoadStopPlaceVersion"
        retryButtonTestId="StopChangeHistory::FailedToLoadStopPlace::RetryButton"
      />
    );
  }

  if (
    currentCached.status === 'fetching' ||
    previousCached.status === 'fetching'
  ) {
    return (
      <DataDiffSectionLoading
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t(($) => $.stopChangeHistory.sectionTitle)}
          />
        }
        headerTestId="LoadingStopPlaceVersion"
      />
    );
  }

  return (
    <ChangeValueSections
      current={currentCached.value}
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      noChangedValuesTitle={
        <SectionTitle
          historyItem={historyItem}
          section={t(($) => $.stopChangeHistory.noChangesTitle)}
        />
      }
      noChangedValuesTitleTestId="NoChanges"
      previous={previousCached.value}
      sections={[
        {
          diffVersions: diffStopAreaAndTerminal,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopChangeHistory.stopPlace.title)}
            />
          ),
          testId: 'StopPlaceDetails',
        },
        {
          diffVersions: diffBasicDetails,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopDetails.basicDetails.title)}
            />
          ),
          testId: 'BasicDetails',
        },
        {
          diffVersions: diffLocationDetails,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopDetails.location.title)}
            />
          ),
          testId: 'LocationDetails',
        },
        {
          diffVersions: diffSignageDetails,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopDetails.signs.title)}
            />
          ),
          testId: 'SignDetails',
        },
        {
          diffVersions: diffMeasurementDetails,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopDetails.measurements.title)}
            />
          ),
          testId: 'MeasurementDetails',
        },
        {
          diffVersions: diffOwnerDetails,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopDetails.maintenance.title)}
            />
          ),
          testId: 'MaintenanceDetails',
        },
        {
          diffVersions: diffShelters,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopChangeHistory.shelters.title)}
            />
          ),
          testId: 'ShelterDetails',
        },
        {
          diffVersions: diffInfoSpots,
          sectionTitle: (
            <SectionTitle
              historyItem={historyItem}
              section={t(($) => $.stopChangeHistory.infoSpots.title)}
            />
          ),
          testId: 'InfoSpotDetails',
        },
      ]}
    />
  );
};
