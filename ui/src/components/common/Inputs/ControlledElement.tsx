import { ReactElement } from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { TypedFormInputProps } from './FormInputTypes';
import { InputElementDefaultProps } from './InputElement';

// Note: this does not contain 'fieldPath'
export type InputElementRenderProps<ValueType = string> =
  TypedFormInputProps<ValueType> & InputElementDefaultProps;

type ControlledElementProps<
  FormState extends FieldValues,
  ValueType,
> = InputElementDefaultProps & {
  readonly fieldPath: Path<FormState>;
  readonly inputElementRenderer: (
    props: InputElementRenderProps<ValueType>,
  ) => ReactElement;
  readonly required?: boolean;
};

export const ControlledElement = <
  FormState extends FieldValues,
  ValueType = string,
>({
  className,
  id,
  fieldPath,
  testId,
  inputElementRenderer,
  required,
}: ControlledElementProps<FormState, ValueType>): ReactElement => {
  const { control } = useFormContext<FormState>();

  return (
    <Controller<FormState>
      name={fieldPath}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState }) =>
        inputElementRenderer({
          onChange,
          onBlur,
          value,
          fieldState,
          id,
          className,
          testId,
          'aria-required': required,
        })
      }
    />
  );
};
