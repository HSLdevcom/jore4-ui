import { InputHTMLAttributes } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { InputElement } from './InputElement';

export interface InputElementDefaultProps extends InputHTMLAttributes<Element> {
  className?: string;
  id: string;
  testId: string;
}

interface Props<FormState extends FieldValues>
  extends InputElementDefaultProps {
  fieldPath: Path<FormState>;
  value: string;
}

export const inputErrorStyles =
  'border-hsl-red bg-hsl-red bg-opacity-5 border-2';

export const RadioButton = <FormState extends FieldValues>({
  className = '',
  id,
  fieldPath,
  testId,
  value,
  ...inputHTMLAttributes
}: Props<FormState>): JSX.Element => {
  return (
    <InputElement
      id={id}
      type="radio"
      value={value}
      name={fieldPath}
      className={twMerge(
        'h-[30px] w-[30px] border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600',
        className,
      )}
      fieldPath={fieldPath}
      testId={testId}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...inputHTMLAttributes}
    />
  );
};
