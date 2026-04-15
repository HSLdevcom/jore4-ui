import { NoEarlierVersionExists } from '../../../common/ChangeHistory';
import { LineChangeHistoryItem } from './LineChangeHistoryItem';

export type PreviousLineChangeHistoryItem =
  | LineChangeHistoryItem
  | typeof NoEarlierVersionExists;
