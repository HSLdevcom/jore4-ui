import { ReactNode } from 'react';

export type StringFieldChangedValue = {
  readonly key?: never;
  readonly field: string;
  readonly oldValue: ReactNode;
  readonly newValue: ReactNode;
};

export type KeyedChangedValue = {
  readonly key: string;
  readonly field: ReactNode;
  readonly oldValue: ReactNode;
  readonly newValue: ReactNode;
};

export type ChangedValue = StringFieldChangedValue | KeyedChangedValue;
