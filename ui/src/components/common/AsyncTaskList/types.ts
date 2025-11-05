import { ReactNode } from 'react';
import { ConfirmationDialogProps } from '../../../uiComponents';

export type Progress =
  | { readonly indeterminate: true; readonly progress?: never }
  | { readonly indeterminate: false; readonly progress: number };

export const initialProgress: Progress = { indeterminate: true };

export type OnProgress = (progress: Progress) => void;

export type ConfirmProps = Omit<
  ConfirmationDialogProps,
  'isOpen' | 'onConfirm' | 'onCancel'
>;

export type ConfirmCancellation = () => ConfirmProps;

type BaseTask = {
  readonly id: string;
  readonly body: ReactNode;
  readonly onCancel: () => void;
  readonly onConfirmCancellation?: ConfirmCancellation;
  readonly progress: Progress;
};

type UninitializedTask = BaseTask & {
  readonly initialized: false;
  readonly initialize: () => void;
};

type InitializedTask = BaseTask & {
  readonly initialized: true;
  readonly initialize: null;
};

export type Task = UninitializedTask | InitializedTask;

export type UnregisterTask = () => void;

export type RegisterTask = (
  onProgress: OnProgress,
  onUnregister: UnregisterTask,
  id: string,
) => Pick<
  UninitializedTask,
  'onCancel' | 'onConfirmCancellation' | 'body' | 'initialize'
>;
