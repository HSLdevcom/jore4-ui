import { LineChangeHistoryItem } from './LineChangeHistoryItem';

export const NoEarlierVersionExists = Symbol('NoEarlierVersionExists');
export const PreviousVersionUnknown = Symbol('PreviousVersionUnknown');

export type TruePreviousLineChangeHistoryItem =
  | LineChangeHistoryItem
  | typeof PreviousVersionUnknown;

export type PreviousLineChangeHistoryItem =
  | LineChangeHistoryItem
  | typeof NoEarlierVersionExists
  | typeof PreviousVersionUnknown;
