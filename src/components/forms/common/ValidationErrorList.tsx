import get from 'lodash/get';
import React from 'react';
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
    switch (type) {
      // TODO: currently too_small is the error that is thrown for required text fields
      // we should be prepared to handle numeric field errors
      case 'too_small':
        return t('formValidation.required');
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
