import { Point } from '../../../types';

export type LocatableStop = {
  readonly label: string;
  readonly netexId: string | null;
  readonly location: Point;
};
