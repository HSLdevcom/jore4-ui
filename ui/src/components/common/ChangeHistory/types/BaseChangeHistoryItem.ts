import { DateLike } from '../../../../time';

export type BaseChangeHistoryItemDetails = {
  readonly changed?: DateLike | null;
  readonly changedBy?: string | null;
  readonly validityEnd?: DateLike | null;
  readonly validityStart?: DateLike | null;
};
