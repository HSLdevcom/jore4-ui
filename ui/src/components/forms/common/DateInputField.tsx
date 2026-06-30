import { DateTime } from 'luxon';
import { DetailedHTMLProps, InputHTMLAttributes, ReactElement } from 'react';
import { FieldPathByValue, FieldValues, useController } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { TranslationKey } from '../../../i18n';
import { BaseDateInput } from '../../common/BaseDateInput';
import { Column } from '../../common/LayoutComponents';
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
      <BaseDateInput
        parsed
        nullable
        id={id}
        data-testid={testId}
        className={twMerge(inputClassName, invalid ? inputErrorStyles : '')}
        onChange={onChange}
        value={value}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...inputProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...fieldProps}
      />
    </Column>
  );
};
