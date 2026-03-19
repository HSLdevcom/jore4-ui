import { DateTime } from 'luxon';
import { LineChangeHistoryItemDetailsFragment } from '../../../../generated/graphql';

export type TgOperation = 'INSERT' | 'UPDATE' | 'DELETE';

export type LineChangeHistoryItem = LineChangeHistoryItemDetailsFragment & {
  // These get populated either from the line or the changed route.
  // Needed to make the type compatible with BaseChangeHistoryItemDetails.
  readonly validityEnd?: DateTime | null;
  readonly validityStart?: DateTime | null;

  // Tighter typing for tgOperation
  readonly tgOperation: TgOperation;
};
