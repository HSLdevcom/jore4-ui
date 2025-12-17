import get from 'lodash/get';
import { InputHTMLAttributes, ReactElement } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { inputErrorStyles } from './InputElement';

export type TextAreaElementDefaultProps = InputHTMLAttributes<Element> & {
  readonly className?: string;
  readonly id: string;
  readonly testId: string;
};

type TextAreaElementProps<FormState extends FieldValues> =
  TextAreaElementDefaultProps & {
    readonly fieldPath: Path<FormState>;
  };

export const TextAreaElement = <FormState extends FieldValues>({
  className,
  id,
  fieldPath,
  testId,
  ...textAreaHTMLAttributes
}: TextAreaElementProps<FormState>): ReactElement => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormState>();

  const hasError = !!get(errors, fieldPath);

  return (
    <textarea
      className={twMerge(hasError ? inputErrorStyles : '', className)}
      id={id}
      data-testid={testId}
      {...register(fieldPath)}
      {...textAreaHTMLAttributes}
    />
  );
};
