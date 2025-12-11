import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column } from '../../../layoutComponents';
import { AutomaticallyResizingTextArea } from './AutomaticallyResizingTextArea';
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
  const { watch } = useFormContext<ReasonForChangeFormState>();

  const translationPrefix = 'reasonForChangeForm';
  const fieldPath = 'reasonForChange';
  const id = `${translationPrefix}.${fieldPath}`;

  const reasonForChangeValue = watch(fieldPath);
  const characterCount = reasonForChangeValue?.length ?? 0;

  return (
    <Column className={className}>
      <InputLabel
        fieldPath={fieldPath}
        translationPrefix={translationPrefix}
        customTitlePath={undefined}
      />
      <AutomaticallyResizingTextArea
        id={id}
        fieldPath={fieldPath}
        testId={testIds.reasonForChange}
        maxLength={254}
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
