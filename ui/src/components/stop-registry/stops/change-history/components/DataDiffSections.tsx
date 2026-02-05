import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { ChangedValuesWithHeaderRow } from '../../../../common/ChangeHistory';
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
import { DataDiffFailedToLoadSection } from './DataDiffFailedToLoadSection';
import { DataDiffSectionLoading } from './DataDiffSectionLoading';
import { useHistoricalStopVersion } from './HistoricalStopDataProvider';
import { SectionTitle } from './SectionTitle';

const infoSpotJoinsVersionedInTiamat = false;

type DataDiffSectionsProps = {
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly historyItem: QuayChangeHistoryItem;
  readonly previousHistoryItem: QuayChangeHistoryItem;
};

export const DataDiffSections: FC<DataDiffSectionsProps> = ({
  getUserNameById,
  historyItem,
  previousHistoryItem,
}) => {
  const { t } = useTranslation();

  const currentCached = useHistoricalStopVersion(historyItem);
  const previousCached = useHistoricalStopVersion(previousHistoryItem);

  if (currentCached.status === 'error' || previousCached.status === 'error') {
    return (
      <DataDiffFailedToLoadSection
        getUserNameById={getUserNameById}
        historyItem={historyItem}
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
      />
    );
  }

  return (
    <>
      <ChangedValuesWithHeaderRow
        current={currentCached.value}
        diffVersions={diffStopAreaAndTerminal}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t('stopChangeHistory.stopPlace.title')}
          />
        }
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="StopPlaceDetails"
      />

      <ChangedValuesWithHeaderRow
        current={currentCached.value}
        diffVersions={diffBasicDetails}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t('stopDetails.basicDetails.title')}
          />
        }
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="BasicDetails"
      />

      <ChangedValuesWithHeaderRow
        current={currentCached.value}
        diffVersions={diffLocationDetails}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t('stopDetails.location.title')}
          />
        }
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="LocationDetails"
      />

      <ChangedValuesWithHeaderRow
        current={currentCached.value}
        diffVersions={diffSignageDetails}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t('stopDetails.signs.title')}
          />
        }
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="SignDetails"
      />

      <ChangedValuesWithHeaderRow
        current={currentCached.value}
        diffVersions={diffMeasurementDetails}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t('stopDetails.measurements.title')}
          />
        }
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="MeasurementDetails"
      />

      <ChangedValuesWithHeaderRow
        current={currentCached.value}
        diffVersions={diffOwnerDetails}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t('stopDetails.maintenance.title')}
          />
        }
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="MaintenanceDetails"
      />

      <ChangedValuesWithHeaderRow
        current={currentCached.value}
        diffVersions={diffShelters}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t('stopChangeHistory.shelters.title')}
          />
        }
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="ShelterDetails"
      />

      {infoSpotJoinsVersionedInTiamat && (
        <ChangedValuesWithHeaderRow
          current={currentCached.value}
          diffVersions={diffInfoSpots}
          sectionTitle={
            <SectionTitle
              historyItem={historyItem}
              section={t('stopChangeHistory.infoSpots.title')}
            />
          }
          getUserNameById={getUserNameById}
          historyItem={historyItem}
          previous={previousCached.value}
          testId="InfoSpotDetails"
        />
      )}
    </>
  );
};
