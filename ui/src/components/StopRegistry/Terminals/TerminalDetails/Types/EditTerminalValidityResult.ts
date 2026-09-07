import { DateTime } from 'luxon';

export type EditTerminalValidityResult = {
  readonly privateCode: string;
  readonly validityStart: DateTime;
  readonly validityEnd: DateTime | undefined;
  readonly indefinite: boolean;
};
