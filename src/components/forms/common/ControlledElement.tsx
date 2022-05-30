import React from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormInputProps } from '../../../uiComponents';

export interface InputElementRenderProps<FormState extends FieldValues>
  extends FormInputProps {
  className?: string;
  id: string;
  testId: string;
  fieldPath?: Path<FormState>;
}

interface Props<FormState extends FieldValues> {
  className?: string;
  id: string;
  fieldPath: Path<FormState>;
  testId: string;
  inputElementRenderer: (
    props: InputElementRenderProps<FormState>,
  ) => React.ReactElement;
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
