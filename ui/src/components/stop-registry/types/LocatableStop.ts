import { Point } from '../../../types';

export type LocatableStop = {
  readonly label: string;
  readonly netextId: string | null;
  readonly location: Point;
};
