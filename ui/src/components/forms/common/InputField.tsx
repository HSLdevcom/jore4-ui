import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactElement,
  TextareaHTMLAttributes,
} from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { TranslationKey } from '../../../i18n';
import { Column } from '../../../layoutComponents';
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
};

type ControlledInputProps = {
  readonly inputElementRenderer: (
    props: InputElementRenderProps,
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

type InputFieldProps<FormState extends FieldValues> =
  CommonInputProps<FormState> &
    (ControlledInputProps | HTMLInputProps | HTMLTextAreaProps);

export const InputField = <FormState extends FieldValues>({
  className = '',
  inputClassName = '',
  fieldPath,
  translationPrefix,
  customTitlePath,
  testId,
  type,
  inputElementRenderer,
  ...inputHTMLAttributes
}: InputFieldProps<FormState>): ReactElement => {
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
      />
      {isControlledElement ? (
        <ControlledElement
          inputElementRenderer={inputElementRenderer}
          fieldPath={fieldPath}
          id={id}
          testId={testId}
        />
      ) : (
        <InputElement<FormState>
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...(inputHTMLAttributes as typeof type extends 'textarea'
            ? HTMLTextAreaProps
            : HTMLInputProps)}
          type={type}
          fieldPath={fieldPath}
          id={id}
          testId={testId}
          className={inputClassName}
        />
      )}
      <ValidationErrorList fieldPath={fieldPath} />
    </Column>
  );
};
