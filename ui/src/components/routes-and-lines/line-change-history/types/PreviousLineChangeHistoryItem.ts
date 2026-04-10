import {
  NoEarlierVersionExists,
  PreviousVersionUnknown,
} from '../../../common/ChangeHistory';
import { LineChangeHistoryItem } from './LineChangeHistoryItem';

export type TruePreviousLineChangeHistoryItem =
  | LineChangeHistoryItem
  | typeof PreviousVersionUnknown;

export type PreviousLineChangeHistoryItem =
  | LineChangeHistoryItem
  | typeof NoEarlierVersionExists
  | typeof PreviousVersionUnknown;
