import { DateLike, DateTimeLike } from '../../../../time';

export type BaseChangeHistoryItemDetails = {
  readonly changed?: DateTimeLike | null;
  readonly changedBy?: string | null;
  readonly validityEnd?: DateLike | null;
  readonly validityStart?: DateLike | null;
  readonly versionComment?: string | null;
};
