import { ControllerFieldState, Noop } from 'react-hook-form';

// copied from HeadlessUI Listbox as it's not exported
export type ValueFn = (...event: ExplicitAny[]) => void;

export type BaseFormInputProps = {
  readonly onBlur?: Noop;
  readonly fieldState?: ControllerFieldState;
  readonly disabled?: boolean;
};

export type FormInputProps = BaseFormInputProps & {
  readonly value?: string;
  readonly onChange: ValueFn;
};

export type TypedFormInputProps<ValueType> = BaseFormInputProps & {
  readonly value?: ValueType;
  readonly onChange: (newValue: ValueType) => void;
};
