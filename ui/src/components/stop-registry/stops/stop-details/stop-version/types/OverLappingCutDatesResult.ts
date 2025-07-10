import { DateTime } from 'luxon';

export type OverlappingCutDatesResult = {
  readonly currentVersion: {
    readonly start: DateTime;
    readonly end: DateTime | undefined;
    readonly indefinite: boolean;
  };
  readonly newVersion?: {
    readonly start: DateTime;
    readonly end: DateTime | undefined;
    readonly indefinite: boolean;
    readonly cutToEnd: boolean;
  };
};
