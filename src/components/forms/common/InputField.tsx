import React, { HTMLInputTypeAttribute } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { TranslationKeys } from '../../../i18n';
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
  fieldPath: Path<FormState>;
  translationPrefix: TranslationKeys;
  testId: string;
}

interface ControlledInputProps<FormState extends FieldValues> {
  inputElementRenderer: (
    props: InputElementRenderProps<FormState>,
  ) => React.ReactElement;
  type?: never;
}
interface HTMLInputProps {
  inputElementRenderer?: never;
  type: HTMLInputTypeAttribute | undefined;
}

type Props<FormState extends FieldValues> = CommonInputProps<FormState> &
  (ControlledInputProps<FormState> | HTMLInputProps);

export const InputField = <FormState extends FieldValues>({
  className = '',
  fieldPath,
  translationPrefix,
  testId,
  type,
  inputElementRenderer,
}: Props<FormState>): JSX.Element => {
  if ((!inputElementRenderer && !type) || (inputElementRenderer && type)) {
    throw new Error(
      'You need to provide exactly one of the "inputElementRenderer" and "type" props',
    );
  }

  const isControlledElement = !!inputElementRenderer;

  return (
    <Column className={className}>
      <InputLabel fieldPath={fieldPath} translationPrefix={translationPrefix} />
      {isControlledElement ? (
        <ControlledElement
          inputElementRenderer={inputElementRenderer}
          fieldPath={fieldPath}
          id={`${translationPrefix}.${fieldPath}`}
          testId={testId}
        />
      ) : (
        <InputElement
          type={type}
          fieldPath={fieldPath}
          id={`${translationPrefix}.${fieldPath}`}
          testId={testId}
        />
      )}
      <ValidationErrorList fieldPath={fieldPath} />
    </Column>
  );
};
