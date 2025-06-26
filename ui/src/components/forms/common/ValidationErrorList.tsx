import get from 'lodash/get';
import { FC, ReactElement } from 'react';
import {
  FieldError,
  FieldPath,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../layoutComponents';
import { REQUIRED_FIELD_ERROR_MESSAGE } from './customZodSchemas';

const testIds = {
  errorMessage: (fieldPath: string) => `ValidationError::message::${fieldPath}`,
};

type ValidationErrorProps = {
  readonly className?: string;
  readonly errorMessage: string;
  readonly fieldPath: string;
};

export const ValidationError: FC<ValidationErrorProps> = ({
  className = '',
  errorMessage,
  fieldPath,
}) => (
  <Row className={`${className} items-center`}>
    <i className="icon-alert mr-4 text-hsl-red" />
    <span
      className="text-sm text-hsl-red"
      data-testid={testIds.errorMessage(fieldPath)}
    >
      {errorMessage}
    </span>
  </Row>
);

type ErrorListProps<FormState extends FieldValues> = {
  readonly className?: string;
  readonly fieldPath: FieldPath<FormState>;
};

const INVALID_EMAIL_MESSAGE = 'Invalid email';

export const ValidationErrorList = <FormState extends FieldValues>({
  className = '',
  fieldPath,
}: ErrorListProps<FormState>): ReactElement | null => {
  const { t } = useTranslation();
  const {
    formState: { errors },
  } = useFormContext<FormState>();

  // TODO check how this behaves if there are multiple errors for the same field
  const fieldError = get(errors, fieldPath) as FieldError;

  const mapErrorToMessage = (err: FieldError) => {
    const { type, message } = err;
    // To keep zod types correct, the only option seems to be mapping
    // invalid type error messages to 'required' and then map them
    // to error messages here
    if (message === REQUIRED_FIELD_ERROR_MESSAGE) {
      return t(`formValidation.required`);
    }

    switch (type) {
      case 'too_small':
        return t('formValidation.tooSmall');
      case 'too_big':
        return t('formValidation.tooBig');
      case 'custom':
        // Try and see of the `message` is a translation key.
        // Else assume it is a pre translated string and return it as is.
        return t(`formValidation.${message}`, { defaultValue: message });
      case 'invalid_string':
        if (message === INVALID_EMAIL_MESSAGE) {
          return t(`formValidation.invalidEmail`);
        }

        return t(`formValidation.${message}`);
      default:
        return `${type}: ${message}`;
    }
  };

  if (!fieldError) {
    return null;
  }

  return (
    <Column className={className}>
      <ValidationError
        errorMessage={mapErrorToMessage(fieldError)}
        fieldPath={fieldPath}
      />
    </Column>
  );
};
