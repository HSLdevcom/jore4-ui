export class FailedToFetchHistoricalStopPlaceError extends Error {
  public readonly data: unknown;

  constructor(
    message: string,
    { data, cause }: { readonly data?: unknown; readonly cause?: unknown },
  ) {
    super(message, { cause });
    this.data = data;
  }
}
