import { DateTime } from 'luxon';
import { DetailedHTMLProps, InputHTMLAttributes, ReactElement } from 'react';
import { FieldPathByValue, FieldValues, useController } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { TranslationKey } from '../../../i18n';
import { Column } from '../../../layoutComponents';
import { parseDate } from '../../../time';
import { inputErrorStyles } from './InputElement';
import { InputLabel } from './InputLabel';

type DateInputFieldProps<FormState extends FieldValues> = {
  readonly fieldPath: FieldPathByValue<FormState, DateTime>;
  readonly inputClassName?: string;
  readonly testId: string;
  readonly translationPrefix: TranslationKey;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'onChange' | 'value' | 'type' | 'onBlur'
>;

export const DateInputField = <FormState extends FieldValues>({
  className,
  fieldPath,
  inputClassName,
  testId,
  translationPrefix,
  ...inputProps
}: DateInputFieldProps<FormState>): ReactElement => {
  // This has to be the same as in the label that's referencing this input
  const id = `${translationPrefix}.${fieldPath}`;

  const {
    field: { onChange, value, ...fieldProps },
    fieldState: { invalid },
  } = useController({ name: fieldPath });

  return (
    <Column className={className}>
      <InputLabel fieldPath={fieldPath} translationPrefix={translationPrefix} />
      <input
        id={id}
        data-testid={testId}
        className={twMerge(inputClassName, invalid ? inputErrorStyles : '')}
        onChange={(e) => onChange(parseDate(e.target.value))}
        type="date"
        value={value?.toISODate()}
        {...inputProps}
        {...fieldProps}
      />
    </Column>
  );
};
