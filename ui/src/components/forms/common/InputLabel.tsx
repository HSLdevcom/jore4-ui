import get from 'lodash/get';
import { ForwardedRef, ReactElement, forwardRef } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../i18n';

type InputLabelProps<FormState extends FieldValues> = {
  readonly className?: string;
  readonly fieldPath: Path<FormState>;
  readonly translationPrefix: TranslationKey;
  readonly customTitlePath?: TranslationKey;
};

const InputLabelImpl = <FormState extends FieldValues>(
  {
    className = '',
    fieldPath,
    translationPrefix,
    customTitlePath,
  }: InputLabelProps<FormState>,
  ref: ForwardedRef<HTMLLabelElement>,
): ReactElement => {
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
  props: InputLabelProps<FormState> & {
    readonly ref?: ForwardedRef<HTMLLabelElement>;
  },
) => ReturnType<typeof InputLabelImpl>;
