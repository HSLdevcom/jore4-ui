import get from 'lodash/get';
import React, { HTMLInputTypeAttribute } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

interface Props<FormState extends FieldValues> {
  className?: string;
  id: string;
  fieldPath: Path<FormState>;
  testId: string;
  type?: HTMLInputTypeAttribute | undefined;
}

export const inputErrorStyles =
  'border-hsl-red bg-hsl-red bg-opacity-5 border-2';

export const InputElement = <FormState extends FieldValues>({
  className = '',
  id,
  fieldPath,
  testId,
  type,
}: Props<FormState>): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormState>();

  const hasError = !!get(errors, fieldPath);

  return (
    <input
      className={`${className} ${hasError ? inputErrorStyles : ''}`}
      id={id}
      data-testid={testId}
      type={type}
      {...register(fieldPath, {})}
    />
  );
};
