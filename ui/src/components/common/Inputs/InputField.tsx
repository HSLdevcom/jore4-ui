import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactElement,
  TextareaHTMLAttributes,
} from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { TranslationKey } from '../../../i18n';
import { Column } from '../LayoutComponents';
import {
  ControlledElement,
  InputElementRenderProps,
} from './ControlledElement';
import { InputElement } from './InputElement';
import { InputLabel } from './InputLabel';
import { ValidationErrorList } from './ValidationErrorList';

type CommonInputProps<FormState extends FieldValues> = {
  readonly className?: string;
  readonly inputClassName?: string;
  readonly fieldPath: Path<FormState>;
  readonly translationPrefix: TranslationKey;
  readonly customTitlePath?: TranslationKey;
  readonly testId: string;
  readonly required?: boolean;
};

type ControlledInputProps<ValueType> = {
  readonly inputElementRenderer: (
    props: InputElementRenderProps<ValueType>,
  ) => ReactElement;
  readonly type?: never;
};

type HTMLInputProps = Readonly<InputHTMLAttributes<HTMLInputElement>> & {
  readonly inputElementRenderer?: never;
  readonly type: HTMLInputTypeAttribute;
};

type HTMLTextAreaProps = Readonly<
  TextareaHTMLAttributes<HTMLTextAreaElement>
> & {
  readonly inputElementRenderer?: never;
  readonly type: 'textarea';
};

type InputFieldProps<
  FormState extends FieldValues,
  ValueType,
> = CommonInputProps<FormState> &
  (ControlledInputProps<ValueType> | HTMLInputProps | HTMLTextAreaProps);

export const InputField = <FormState extends FieldValues, ValueType = string>({
  className,
  inputClassName,
  fieldPath,
  translationPrefix,
  customTitlePath,
  testId,
  type,
  inputElementRenderer,
  required,
  ...inputHTMLAttributes
}: InputFieldProps<FormState, ValueType>): ReactElement => {
  if ((!inputElementRenderer && !type) || (inputElementRenderer && type)) {
    throw new Error(
      'You need to provide exactly one of the "inputElementRenderer" and "type" props',
    );
  }

  const isControlledElement = !!inputElementRenderer;

  // this has to be the same as in the label that's referencing this input
  const id = `${translationPrefix}.${fieldPath}`;

  return (
    <Column className={className}>
      <InputLabel
        fieldPath={fieldPath}
        translationPrefix={translationPrefix}
        customTitlePath={customTitlePath}
        required={required}
      />
      {isControlledElement ? (
        <ControlledElement
          inputElementRenderer={inputElementRenderer}
          fieldPath={fieldPath}
          id={id}
          testId={testId}
          required={required}
        />
      ) : (
        <InputElement<FormState>
          {...(inputHTMLAttributes as typeof type extends 'textarea'
            ? HTMLTextAreaProps
            : HTMLInputProps)}
          type={type}
          fieldPath={fieldPath}
          id={id}
          testId={testId}
          className={inputClassName}
          required={required}
        />
      )}
      <ValidationErrorList fieldPath={fieldPath} />
    </Column>
  );
};
