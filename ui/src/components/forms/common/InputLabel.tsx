import get from 'lodash/get';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TranslationKeys } from '../../../i18n';

interface Props<FormState extends FieldValues> {
  className?: string;
  fieldPath: Path<FormState>;
  translationPrefix: TranslationKeys;
}

export const InputLabel = <FormState extends FieldValues>({
  className = '',
  fieldPath,
  translationPrefix,
}: Props<FormState>): JSX.Element => {
  const { t } = useTranslation();
  const {
    formState: { errors },
  } = useFormContext<FormState>();

  const hasError = !!get(errors, fieldPath);

  return (
    <label className={className} htmlFor={`${translationPrefix}.${fieldPath}`}>
      {/* Regex removes dot and series of numbers eg. ".10"
          This is needed for translation to work with fields that are
          created with React Hook Form useFieldArray */}
      {t(`${translationPrefix}.${fieldPath.replace(/\.\d+/, '')}`)}
      {hasError && <span className="ml-1 text-hsl-red">*</span>}
    </label>
  );
};
