import { FC } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { ChangedValuesWithHeaderRow } from '../../../../common/ChangeHistory';
import {
  diffBasicDetails,
  diffLocationDetails,
  diffMeasurementDetails,
  diffOwnerDetails,
  diffSignageDetails,
} from '../utils';
import { DataDiffFailedToLoadSection } from './DataDiffFailedToLoadSection';
import { DataDiffSectionLoading } from './DataDiffSectionLoading';
import { useHistoricalStopVersion } from './HistoricalStopDataProvider';
import { SectionTitle } from './SectionTitle';

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
        diffVersions={diffBasicDetails}
        getTitle={(t) => (
          <SectionTitle
            historyItem={historyItem}
            section={t('stopDetails.basicDetails.title')}
          />
        )}
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="BasicDetails"
      />

      <ChangedValuesWithHeaderRow
        current={currentCached.value}
        diffVersions={diffLocationDetails}
        getTitle={(t) => (
          <SectionTitle
            historyItem={historyItem}
            section={t('stopDetails.location.title')}
          />
        )}
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="BasicDetails"
      />

      <ChangedValuesWithHeaderRow
        current={currentCached.value}
        diffVersions={diffSignageDetails}
        getTitle={(t) => (
          <SectionTitle
            historyItem={historyItem}
            section={t('stopDetails.signs.title')}
          />
        )}
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="BasicDetails"
      />

      <ChangedValuesWithHeaderRow
        current={currentCached.value}
        diffVersions={diffMeasurementDetails}
        getTitle={(t) => (
          <SectionTitle
            historyItem={historyItem}
            section={t('stopDetails.measurements.title')}
          />
        )}
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="BasicDetails"
      />

      <ChangedValuesWithHeaderRow
        current={currentCached.value}
        diffVersions={diffOwnerDetails}
        getTitle={(t) => (
          <SectionTitle
            historyItem={historyItem}
            section={t('stopDetails.maintenance.title')}
          />
        )}
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previous={previousCached.value}
        testId="BasicDetails"
      />
    </>
  );
};
