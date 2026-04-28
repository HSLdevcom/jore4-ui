import { TFunction } from 'i18next';
import {
  HistoricalTerminalDetailsFragment,
  InfoSpotDetailsFragment,
} from '../../../../../generated/graphql';
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

export function diffInfoSpots(
  t: TFunction,
  previous: HistoricalTerminalDetailsFragment,
  current: HistoricalTerminalDetailsFragment,
): Array<ChangedValue> {
  return diffNestedItems<InfoSpotDetailsFragment>({
    t,
    previousItems: previous.infoSpots,
    currentItems: current.infoSpots,
    diffItemVersions: diffInfoSpotVersions,
    getHeading: {
      added: getAddedInfoSpotHeading,
      updated: getUpdatedInfoSpotHeading,
      removed: getRemovedInfoSpotHeading,
    },
  });
}
