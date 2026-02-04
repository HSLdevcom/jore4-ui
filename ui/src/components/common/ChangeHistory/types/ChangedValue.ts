import { ReactNode } from 'react';

export type ChangedValue =
  | {
      readonly key?: never;
      readonly field: string;
      readonly oldValue: ReactNode;
      readonly newValue: ReactNode;
    }
  | {
      readonly key: string;
      readonly field: ReactNode;
      readonly oldValue: ReactNode;
      readonly newValue: ReactNode;
    };
