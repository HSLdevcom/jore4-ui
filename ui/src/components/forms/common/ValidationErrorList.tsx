import get from 'lodash/get';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { Column, Row } from '../../../layoutComponents';
import { REQUIRED_FIELD_ERROR_MESSAGE } from './customZodSchemas';

interface ErrorProps {
  className?: string;
  errorMessage: string;
}

export const ValidationError = ({
  className = '',
  errorMessage,
}: ErrorProps): JSX.Element => (
  <Row className={`${className} items-center`}>
    <MdWarning className="mr-2 inline text-lg text-hsl-red" />
    <span className="text-hsl-red">{errorMessage}</span>
  </Row>
);

interface ErrorListProps {
  className?: string;
  fieldPath: string;
}

export const ValidationErrorList = <FormState extends FieldValues>({
  className = '',
  fieldPath,
}: ErrorListProps): JSX.Element | null => {
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
        return t(`formValidation.${message}`);
      case 'invalid_string':
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
      <ValidationError errorMessage={mapErrorToMessage(fieldError)} />
    </Column>
  );
};
