export type OverlappingCutDatesResult = {
  readonly currentVersion: {
    readonly start: Temporal.PlainDate;
    readonly end: Temporal.PlainDate | undefined;
    readonly indefinite: boolean;
  };
  readonly newVersion?: {
    readonly start: Temporal.PlainDate;
    readonly end: Temporal.PlainDate | undefined;
    readonly indefinite: boolean;
    readonly cutToEnd: boolean;
  };
};
