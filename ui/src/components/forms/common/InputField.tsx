import React, { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
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

interface CommonInputProps<FormState extends FieldValues> {
  className?: string;
  inputClassName?: string;
  fieldPath: Path<FormState>;
  translationPrefix: TranslationKey;
  customTitlePath?: TranslationKey;
  testId: string;
}

interface ControlledInputProps {
  inputElementRenderer: (props: InputElementRenderProps) => React.ReactElement;
  type?: never;
}
interface HTMLInputProps extends InputHTMLAttributes<Element> {
  inputElementRenderer?: never;
  type: HTMLInputTypeAttribute;
}

type Props<FormState extends FieldValues> = CommonInputProps<FormState> &
  (ControlledInputProps | HTMLInputProps);

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
}: Props<FormState>): React.ReactElement => {
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
        <InputElement
          type={
            type! /* eslint-disable-line @typescript-eslint/no-non-null-assertion */
          }
          fieldPath={fieldPath}
          id={id}
          testId={testId}
          className={inputClassName}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputHTMLAttributes}
        />
      )}
      <ValidationErrorList fieldPath={fieldPath} />
    </Column>
  );
};
