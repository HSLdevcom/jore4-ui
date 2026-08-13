import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { HistoricalTerminalDetailsFragment } from '../../../../../generated/graphql';
import {
  ChangedValue,
  diffNestedItems,
} from '../../../../common/ChangeHistory';
import {
  diffInfoSpotVersions,
  getAddedInfoSpotHeading,
  getRemovedInfoSpotHeading,
  getUpdatedInfoSpotHeading,
} from '../../../components/ChangeHistory/utils/diffInfoSpotsCommon';
import { enrichInfoSpot } from '../../../utils';

export function diffInfoSpots(
  t: TFunction,
  previous: HistoricalTerminalDetailsFragment,
  current: HistoricalTerminalDetailsFragment,
): Array<ChangedValue> {
  return diffNestedItems({
    t,
    previousItems: compact(previous.infoSpots).map(enrichInfoSpot),
    currentItems: compact(current.infoSpots).map(enrichInfoSpot),
    diffItemVersions: diffInfoSpotVersions,
    getHeading: {
      added: getAddedInfoSpotHeading,
      updated: getUpdatedInfoSpotHeading,
      removed: getRemovedInfoSpotHeading,
    },
  });
}
