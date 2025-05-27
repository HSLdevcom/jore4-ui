import get from 'lodash/get';
import { InputHTMLAttributes } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
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
  className = '',
  id,
  fieldPath,
  testId,
  ...textAreaHTMLAttributes
}: TextAreaElementProps<FormState>): React.ReactElement => {
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
