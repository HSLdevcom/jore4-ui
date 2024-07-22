import get from 'lodash/get';
import { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

export interface InputElementDefaultProps extends InputHTMLAttributes<Element> {
  className?: string;
  id: string;
  testId: string;
}

interface Props<FormState extends FieldValues>
  extends InputElementDefaultProps {
  fieldPath: Path<FormState>;
  type: HTMLInputTypeAttribute;
}

export const inputErrorStyles =
  'border-hsl-red bg-hsl-red bg-opacity-5 border-2';

export const InputElement = <FormState extends FieldValues>({
  className = '',
  id,
  fieldPath,
  testId,
  type,
  ...inputHTMLAttributes
}: Props<FormState>): React.ReactElement => {
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
      {...register(fieldPath, { valueAsNumber: type === 'number' })}
      {...inputHTMLAttributes}
    />
  );
};
