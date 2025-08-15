import { InputHTMLAttributes, ReactElement } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { InputElement } from './InputElement';

export type InputElementDefaultProps = InputHTMLAttributes<Element> & {
  readonly className?: string;
  readonly id: string;
  readonly testId: string;
};

type RadioButtonProps<FormState extends FieldValues> =
  InputElementDefaultProps & {
    readonly fieldPath: Path<FormState>;
    readonly value: string;
  };

export const RadioButton = <FormState extends FieldValues>({
  className = '',
  id,
  fieldPath,
  testId,
  value,
  ...inputHTMLAttributes
}: RadioButtonProps<FormState>): ReactElement => {
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
