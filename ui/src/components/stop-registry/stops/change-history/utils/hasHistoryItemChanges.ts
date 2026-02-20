import { TFunction } from 'i18next';
import { HistoricalStopData } from '../types/HistoricalStopData';
import {
  diffBasicDetails,
  diffLocationDetails,
  diffMeasurementDetails,
  diffOwnerDetails,
  diffShelters,
  diffSignageDetails,
  diffStopAreaAndTerminal,
} from '.';

/**
 * Check if there are any actual changes between two stop versions
 */
export function hasHistoryItemChanges(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): boolean {
  const allChanges = [
    ...diffStopAreaAndTerminal(t, previous, current),
    ...diffBasicDetails(t, previous, current),
    ...diffLocationDetails(t, previous, current),
    ...diffSignageDetails(t, previous, current),
    ...diffMeasurementDetails(t, previous, current),
    ...diffOwnerDetails(t, previous, current),
    ...diffShelters(t, previous, current),
  ];

  return allChanges.length > 0;
}
