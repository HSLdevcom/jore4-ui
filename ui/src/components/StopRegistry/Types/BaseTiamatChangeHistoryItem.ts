export type BaseTiamatChangeHistoryItem = {
  readonly netexId: string;
  readonly version: string;

  readonly changed?: string | null;
  readonly changedBy?: string | null;

  readonly validityEnd?: string | null;
  readonly validityStart?: string | null;
};
