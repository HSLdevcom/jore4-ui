import { DateTime } from 'luxon';

export type EditStopVersionResult = {
  readonly stopPlaceId: string;
  readonly quayId: string;
  readonly priority: number;
  readonly validityStart: DateTime;
  readonly validityEnd: DateTime | undefined;
  readonly indefinite: boolean;
};
