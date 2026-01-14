import get from 'lodash/get';
import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactElement,
  TextareaHTMLAttributes,
} from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export type InputElementDefaultProps = InputHTMLAttributes<HTMLInputElement> & {
  readonly id: string;
  readonly testId: string;
};

type HTMLInputProps = Readonly<InputHTMLAttributes<HTMLInputElement>> & {
  readonly type: HTMLInputTypeAttribute;
};
type HTMLTextAreaProps = Readonly<
  TextareaHTMLAttributes<HTMLTextAreaElement>
> & {
  readonly type: 'textarea';
};

type BaseProps<FormState extends FieldValues> = {
  readonly id: string;
  readonly testId: string;
  readonly fieldPath: Path<FormState>;
};

type InputElementProps<FormState extends FieldValues> =
  | (BaseProps<FormState> & HTMLInputProps)
  | (BaseProps<FormState> & HTMLTextAreaProps);

export const inputErrorStyles = 'border-hsl-red bg-hsl-red/5 border-2';

export const InputElement = <FormState extends FieldValues>({
  className,
  fieldPath,
  testId,
  type,
  ...elementProps
}: InputElementProps<FormState>): ReactElement => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormState>();

  const hasError = !!get(errors, fieldPath);

  const actualClassNames = twMerge(className, hasError ? inputErrorStyles : '');

  if (type === 'textarea') {
    const textAreaProps = elementProps as HTMLTextAreaProps;
    return (
      <textarea
        {...textAreaProps}
        {...register(fieldPath)}
        className={actualClassNames}
        data-testid={testId}
      />
    );
  }

  const inputProps = elementProps as HTMLInputProps;
  return (
    <input
      {...inputProps}
      {...register(fieldPath, { valueAsNumber: type === 'number' })}
      className={actualClassNames}
      data-testid={testId}
      type={type}
    />
  );
};
