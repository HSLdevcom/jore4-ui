import { TFunction } from 'i18next';
import {
  ChangedValue,
  diffNestedItems,
} from '../../../../../common/ChangeHistory';
import {
  diffInfoSpotVersions,
  getAddedInfoSpotHeading,
  getRemovedInfoSpotHeading,
  getUpdatedInfoSpotHeading,
} from '../../../../../common/ChangeHistory/utils/diffInfoSpotsCommon';
import { HistoricalStopData } from '../../types';

export function diffInfoSpots(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): Array<ChangedValue> {
  return diffNestedItems({
    t,
    previousItems: previous.quay.infoSpots,
    currentItems: current.quay.infoSpots,
    diffItemVersions: diffInfoSpotVersions,
    getHeading: {
      added: getAddedInfoSpotHeading,
      updated: getUpdatedInfoSpotHeading,
      removed: getRemovedInfoSpotHeading,
    },
  });
}
