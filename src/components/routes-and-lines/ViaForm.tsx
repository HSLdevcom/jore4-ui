import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row } from '../../layoutComponents';
import { SimpleButton } from '../../uiComponents';
import { submitFormByRef } from '../../utils';
import { localizedStringRequired } from '../forms/common/LocalizedStringSchema';

export const schema = z.object({
  viaInfo: z.object({
    name: localizedStringRequired,
    shortName: localizedStringRequired,
  }),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

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
            <label htmlFor="viaInfoFi">{t('viaModal.viaInfoFi')}</label>
            <input
              id="viaInfoFi-input"
              type="text"
              {...register('viaInfo.name.fi_FI', {})}
            />
            <p>
              {errors.viaInfo?.name?.fi_FI?.type === 'too_small' &&
                t('formValidation.required')}
            </p>
          </Column>
        </Row>
        <Row className="mb-5 space-x-10">
          <Column className="flex-1">
            <label htmlFor="viaInfoSv">{t('viaModal.viaInfoSv')}</label>
            <input
              id="viaInfoSv-input"
              type="text"
              {...register('viaInfo.name.sv_FI', {})}
            />
            <p>
              {errors.viaInfo?.name?.sv_FI?.type === 'too_small' &&
                t('formValidation.required')}
            </p>
          </Column>
        </Row>
        <Row className="mb-5 space-x-10">
          <Column className="flex-1">
            <label htmlFor="viaInfoFiShort">
              {t('viaModal.viaInfoFiShort')}
            </label>
            <input
              id="viaInfoFiShort-input"
              type="text"
              {...register('viaInfo.shortName.fi_FI', {})}
            />
            <p>
              {errors.viaInfo?.shortName?.fi_FI?.type === 'too_small' &&
                t('formValidation.required')}
            </p>
          </Column>
        </Row>
        <Row className="mb-5 space-x-10">
          <Column className="flex-1">
            <label htmlFor="viaInfoSvShort">
              {t('viaModal.viaInfoSvShort')}
            </label>
            <input
              id="viaInfoSvShort-input"
              type="text"
              {...register('viaInfo.shortName.sv_FI', {})}
            />
            <p>
              {errors.viaInfo?.shortName?.sv_FI?.type === 'too_small' &&
                t('formValidation.required')}
            </p>
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
