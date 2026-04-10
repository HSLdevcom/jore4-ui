import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { NoEarlierVersionExists } from '../../../../common/ChangeHistory';

export type PreviousStopPlaceChangeHistoryItem =
  | StopPlaceChangeHistoryItem
  | typeof NoEarlierVersionExists;
