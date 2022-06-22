import React from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormInputProps } from '../../../uiComponents';
import { InputElementDefaultProps } from './InputElement';

// Note: this does not contain 'fieldPath'
export type InputElementRenderProps = FormInputProps & InputElementDefaultProps;

interface Props<FormState extends FieldValues>
  extends InputElementDefaultProps {
  fieldPath: Path<FormState>;
  inputElementRenderer: (props: InputElementRenderProps) => React.ReactElement;
}

export const ControlledElement = <FormState extends FieldValues>({
  className = '',
  id,
  fieldPath,
  testId,
  inputElementRenderer,
}: Props<FormState>): JSX.Element => {
  const { control } = useFormContext<FormState>();

  return (
    <Controller<FormState>
      name={fieldPath}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState }) => {
        const renderProps = {
          onChange,
          onBlur,
          value,
          fieldState,
          id,
          className,
          testId,
        };
        const inputElement = inputElementRenderer(renderProps);
        return inputElement;
      }}
    />
  );
};
