import { TFunction } from 'i18next';
import { ChangedValue } from '../../../../common/ChangeHistory';
import { HistoricalStopData } from '../types';
import {
  diffBasicDetails,
  diffLocationDetails,
  diffMeasurementDetails,
  diffOwnerDetails,
  diffShelters,
  diffSignageDetails,
  diffStopAreaAndTerminal,
} from '.';

type StopChangeSection = {
  readonly title: string;
  readonly changes: ReadonlyArray<ChangedValue>;
};

export const latestStopChangeSections = (
  t: TFunction,
  prev: HistoricalStopData,
  curr: HistoricalStopData,
): StopChangeSection[] => {
  return [
    {
      title: t('stopChangeHistory.stopPlace.title'),
      changes: diffStopAreaAndTerminal(t, prev, curr),
    },
    {
      title: t('stopDetails.basicDetails.title'),
      changes: diffBasicDetails(t, prev, curr),
    },
    {
      title: t('stopDetails.location.title'),
      changes: diffLocationDetails(t, prev, curr),
    },
    {
      title: t('stopDetails.signs.title'),
      changes: diffSignageDetails(t, prev, curr),
    },
    {
      title: t('stopDetails.measurements.title'),
      changes: diffMeasurementDetails(t, prev, curr),
    },
    {
      title: t('stopDetails.maintenance.title'),
      changes: diffOwnerDetails(t, prev, curr),
    },
    {
      title: t('stopChangeHistory.shelters.title'),
      changes: diffShelters(t, prev, curr),
    },
  ].filter((s) => s.changes.length > 0);
};
