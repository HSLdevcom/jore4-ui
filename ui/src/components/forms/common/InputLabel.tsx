import get from 'lodash/get';
import { ForwardedRef, forwardRef } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../i18n';

interface Props<FormState extends FieldValues> {
  className?: string;
  fieldPath: Path<FormState>;
  translationPrefix: TranslationKey;
  customTitlePath?: TranslationKey;
}

const InputLabelImpl = <FormState extends FieldValues>(
  {
    className = '',
    fieldPath,
    translationPrefix,
    customTitlePath,
  }: Props<FormState>,
  ref: ForwardedRef<HTMLLabelElement>,
): React.ReactElement => {
  const { t } = useTranslation();
  const {
    formState: { errors },
  } = useFormContext<FormState>();

  const hasError = !!get(errors, fieldPath);

  return (
    <label
      className={className}
      htmlFor={`${translationPrefix}.${fieldPath}`}
      ref={ref}
    >
      {customTitlePath ? (
        t(customTitlePath)
      ) : (
        <>
          {/* Regex removes dot and series of numbers eg. ".10"
              This is needed for translation to work with fields that are
              created with React Hook Form useFieldArray */}
          {t(`${translationPrefix}.${fieldPath.replace(/\.\d+/, '')}`)}
          {hasError && <span className="ml-1 text-hsl-red">*</span>}
        </>
      )}
    </label>
  );
};

export const InputLabel = forwardRef(InputLabelImpl) as <
  FormState extends FieldValues,
>(
  props: Props<FormState> & { readonly ref?: ForwardedRef<HTMLLabelElement> },
) => ReturnType<typeof InputLabelImpl>;
