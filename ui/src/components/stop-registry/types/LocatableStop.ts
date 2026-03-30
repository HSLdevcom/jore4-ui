import { StopRegistryTransportModeType } from '../../../generated/graphql';
import { Point } from '../../../types';
import { Priority } from '../../../types/enums';

export type LocatableStop = {
  readonly label: string;
  readonly netexId: string | null;
  readonly location: Point;
  readonly priority?: Priority;
  readonly transportMode?: StopRegistryTransportModeType | null;
};
