import { FC, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column } from '../../../layoutComponents';
import { InputLabel } from './InputLabel';
import { ValidationErrorList } from './ValidationErrorList';

export const reasonForChangeFormSchema = z.object({
  reasonForChange: z.string().max(254).nullable().optional(),
});

export type ReasonForChangeFormState = z.infer<
  typeof reasonForChangeFormSchema
>;

const testIds = {
  reasonForChange: 'ReasonForChangeForm::reasonForChange',
};

type ReasonForChangeFormProps = {
  readonly className?: string;
};

export const ReasonForChangeForm: FC<ReasonForChangeFormProps> = ({
  className,
}) => {
  const { t } = useTranslation();
  const { register, watch } = useFormContext<ReasonForChangeFormState>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const translationPrefix = 'reasonForChangeForm';
  const fieldPath = 'reasonForChange';
  const id = `${translationPrefix}.${fieldPath}`;

  const reasonForChangeValue = watch(fieldPath);
  const characterCount = reasonForChangeValue?.length ?? 0;

  const { ref, ...rest } = register(fieldPath);

  const autoResize = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [reasonForChangeValue]);

  return (
    <Column className={className}>
      <InputLabel
        fieldPath={fieldPath}
        translationPrefix={translationPrefix}
        customTitlePath={undefined}
      />
      <textarea
        id={id}
        className="resize-none overflow-hidden leading-tight"
        rows={1}
        data-testid={testIds.reasonForChange}
        maxLength={254}
        ref={(e) => {
          ref(e);
          textareaRef.current = e;
        }}
        onInput={autoResize}
        {...rest}
      />

      {characterCount >= 254 && (
        <p className="mt-2 text-sm font-bold text-hsl-red">
          {t('reasonForChangeForm.characterLimit')}
        </p>
      )}

      <ValidationErrorList fieldPath={fieldPath} />
    </Column>
  );
};
