import { StopPlaceChangeHistoryItem } from '../../../../generated/graphql';
import { NoEarlierVersionExists } from './PreviousVersion';

export type PreviousStopPlaceChangeHistoryItem =
  | StopPlaceChangeHistoryItem
  | typeof NoEarlierVersionExists;
