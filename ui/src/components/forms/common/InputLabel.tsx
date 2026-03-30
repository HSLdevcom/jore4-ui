import get from 'lodash/get';
import { ForwardedRef, ReactElement, forwardRef } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { TranslationKey } from '../../../i18n';
import { useTranslateStringKey } from './UseTranslateStringKey';

type InputLabelProps<FormState extends FieldValues> = {
  readonly className?: string;
  readonly fieldPath: Path<FormState>;
  readonly translationPrefix: TranslationKey;
  readonly customTitlePath?: TranslationKey;
};

const InputLabelImpl = <FormState extends FieldValues>(
  {
    className,
    fieldPath,
    translationPrefix,
    customTitlePath,
  }: InputLabelProps<FormState>,
  ref: ForwardedRef<HTMLLabelElement>,
): ReactElement => {
  const translateStringKey = useTranslateStringKey();

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
        translateStringKey(customTitlePath)
      ) : (
        <>
          {translateStringKey(
            /* Regex removes dot and series of numbers eg. ".10"
              This is needed for translation to work with fields that are
              created with React Hook Form useFieldArray */
            `${translationPrefix}.${fieldPath.replace(/\.\d+/, '')}`,
          )}
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
