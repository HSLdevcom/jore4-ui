import get from 'lodash/get';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { Column, Row } from '../../../layoutComponents';

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

    // Mapping error to message by the original error message is a little hacky,
    // but mapping by type works neither as same error type has multiple different messages to show.
    // TODO: Figure out a better way to do this.
    switch (message) {
      case 'Should be at least 1 characters':
      case 'Expected number, received nan':
      case 'Invalid uuid':
        return t('formValidation.required');
      default:
        break;
    }

    switch (type) {
      case 'too_small':
        return t('formValidation.tooSmall');
      case 'too_big':
        return t('formValidation.tooBig');
      case 'invalid_enum_value':
        return t('formValidation.required');
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
