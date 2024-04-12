import get from 'lodash/get';
import { InputHTMLAttributes } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { inputErrorStyles } from './InputElement';

export interface TextAreaElementDefaultProps
  extends InputHTMLAttributes<Element> {
  className?: string;
  id: string;
  testId: string;
}

interface Props<FormState extends FieldValues>
  extends TextAreaElementDefaultProps {
  fieldPath: Path<FormState>;
}

export const TextAreaElement = <FormState extends FieldValues>({
  className = '',
  id,
  fieldPath,
  testId,
  ...textAreaHTMLAttributes
}: Props<FormState>): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormState>();

  const hasError = !!get(errors, fieldPath);

  return (
    <textarea
      className={`${className} ${hasError ? inputErrorStyles : ''}`}
      id={id}
      data-testid={testId}
      {...register(fieldPath)}
      {...textAreaHTMLAttributes}
    />
  );
};
