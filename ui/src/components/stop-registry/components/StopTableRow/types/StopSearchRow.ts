import type { Point } from 'geojson';
import { DateTime } from 'luxon';
import { Priority } from '../../../../../types/enums';

export type StopSearchRowTimingPlace = {
  readonly id: UUID;
  readonly label: string;
};

export type StopSearchRow = {
  readonly id: string; // DB row id
  readonly netexId: string;
  readonly scheduledStopPointId: UUID | null;

  readonly publicCode: string;
  readonly nameFin: string;
  readonly nameSwe: string | null;

  readonly location: Point;

  readonly validityStart: DateTime;
  readonly validityEnd: DateTime | null;
  readonly priority: Priority;

  readonly timingPlace: StopSearchRowTimingPlace | null;
};
