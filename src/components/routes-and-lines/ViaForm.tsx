import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row } from '../../layoutComponents';
import { SimpleButton } from '../../uiComponents';
import { submitFormByRef } from '../../utils';
import { localizedStringRequired } from '../forms/common/LocalizedStringSchema';
import { StringInput } from '../forms/common/StringInput';

export const schema = z.object({
  viaPointName: localizedStringRequired,
  viaPointShortName: localizedStringRequired,
  isViaPoint: z.boolean(),
});

export type FormState = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<FormState>;
  className?: string;
  onSubmit: (state: FormState) => void;
  onRemove: () => void;
  onCancel: () => void;
}

export const ViaForm = ({
  defaultValues,
  className = '',
  onSubmit,
  onCancel,
  onRemove,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const onSave = () => {
    submitFormByRef(formRef);
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
        className={className}
      >
        <Row className="mb-5 space-x-10">
          <Column className="flex-1">
            <StringInput<FormState>
              translationPrefix="viaModal"
              fieldPath="viaPointName.fi_FI"
            />
          </Column>
        </Row>
        <Row className="mb-5 space-x-10">
          <Column className="flex-1">
            <StringInput<FormState>
              translationPrefix="viaModal"
              fieldPath="viaPointName.sv_FI"
            />
          </Column>
        </Row>
        <Row className="mb-5 space-x-10">
          <Column className="flex-1">
            <StringInput<FormState>
              translationPrefix="viaModal"
              fieldPath="viaPointShortName.fi_FI"
            />
          </Column>
        </Row>
        <Row className="mb-5 space-x-10">
          <Column className="flex-1">
            <StringInput<FormState>
              translationPrefix="viaModal"
              fieldPath="viaPointShortName.sv_FI"
            />
          </Column>
        </Row>
        <Row className="space-x-4">
          <SimpleButton className="ml-auto" onClick={onCancel} inverted>
            {t('cancel')}
          </SimpleButton>
          <SimpleButton
            disabled={!defaultValues?.isViaPoint}
            className="ml-auto"
            onClick={onRemove}
            inverted
          >
            {t('viaModal.removeViaInfo')}
          </SimpleButton>
          <SimpleButton onClick={onSave}>
            {t('viaModal.setViaInfo')}
          </SimpleButton>
        </Row>
      </form>
    </FormProvider>
  );
};
