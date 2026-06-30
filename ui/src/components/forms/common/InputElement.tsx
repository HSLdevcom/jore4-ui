import get from 'lodash/get';
import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactElement,
  TextareaHTMLAttributes,
} from 'react';
import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { CompatBaseDateInput } from '../../common';

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

export const RawInputElement = <FormState extends FieldValues>({
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

export const DateInputElement = <FormState extends FieldValues>({
  className,
  fieldPath,
  testId,
  ...elementProps
}: InputElementProps<FormState>): ReactElement => {
  const {
    field,
    fieldState: { error },
  } = useController<FormState, typeof fieldPath>({ name: fieldPath });

  const inputProps = elementProps as HTMLInputProps;

  return (
    <CompatBaseDateInput
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...inputProps}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...field}
      className={twMerge(className, error ? inputErrorStyles : '')}
      data-testid={testId}
    />
  );
};

export const InputElement = <FormState extends FieldValues>(
  props: InputElementProps<FormState>,
): ReactElement => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === 'date') {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <DateInputElement {...props} />;
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <RawInputElement {...props} />;
};
