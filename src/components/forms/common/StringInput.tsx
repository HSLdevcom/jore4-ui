import get from 'lodash/get';
import React from 'react';
import { FieldError, FieldValues, Path, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TranslationKeys } from '../../../i18n';
import { Column } from '../../../layoutComponents';

interface Props<FormState extends FieldValues> {
  className?: string;
  fieldPath: Path<FormState>;
  translationPrefix: TranslationKeys;
  testId?: string;
}

export const StringInput = <FormState extends FieldValues>({
  fieldPath,
  translationPrefix,
  testId,
}: Props<FormState>): JSX.Element => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<FormState>();

  const fieldError = get(errors, fieldPath) as FieldError;

  return (
    <Column>
      <label htmlFor={`${translationPrefix}.${fieldPath}`}>
        {t(`${translationPrefix}.${fieldPath}`)}
      </label>
      <input
        id={`${translationPrefix}.${fieldPath}`}
        data-testid={testId}
        type="text"
        {...register(fieldPath, {})}
      />
      <p>{fieldError?.type === 'too_small' && t('formValidation.required')}</p>
    </Column>
  );
};
