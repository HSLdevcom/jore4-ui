import { Priority } from './enums';

export type FilterableStopInfo = {
  readonly label: string;
  readonly priority: Priority;
  readonly validity_start?: Temporal.PlainDate | null;
  readonly validity_end?: Temporal.PlainDate | null;
};
