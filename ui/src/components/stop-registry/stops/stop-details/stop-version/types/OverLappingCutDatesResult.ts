import { DateTime } from 'luxon';

export type OverlappingCutDatesResult = {
  currentVersion: {
    start: DateTime;
    end: DateTime | undefined;
    indefinite: boolean;
  };
  newVersion?: {
    start: DateTime;
    end: DateTime | undefined;
    indefinite: boolean;
    cutToEnd: boolean;
  };
};
