import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { NoEarlierVersionExists } from '../../../../common/ChangeHistory';

export type PreviousQuayChangeHistoryItem =
  | QuayChangeHistoryItem
  | typeof NoEarlierVersionExists;
