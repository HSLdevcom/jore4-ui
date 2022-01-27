import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row } from '../../layoutComponents';
import { ChooseLineDropdown } from './ChooseLineDropdown';

export const schema = z.object({
  label: z.string().min(1),
  description_i18n: z.string().min(1),
  on_line_id: z.string().uuid(),
});

export type FormState = z.infer<typeof schema>;

interface Props {
  className?: string;
  defaultValues: Partial<FormState>;
  onSubmit: (data: FormState) => void;
}

const CreateRouteFormComponent = (
  { className, defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  return (
    <form
      className={className || ''}
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
    >
      <Row className="my-5">
        <Column className="w-full">
          <label htmlFor="label">{t('routes.label')}</label>
          <input type="text" {...register('label', {})} />
          <p>
            {errors.label?.type === 'too_small' && t('formValidation.required')}
          </p>
        </Column>
      </Row>
      <Row className="my-5">
        <Column className="w-full">
          <label htmlFor="description_i18n">{t('routes.name')}</label>
          <input type="text" {...register('description_i18n', {})} />
          <p>
            {errors.description_i18n?.type === 'too_small' &&
              t('formValidation.required')}
          </p>
        </Column>
      </Row>
      <Row className="my-5">
        <Column className="w-full">
          <label htmlFor="on_line_id">{t('routes.addToLine')}</label>
          <Controller
            name="on_line_id"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <ChooseLineDropdown
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <p>{errors.on_line_id?.message}</p>
        </Column>
      </Row>
    </form>
  );
};

export const CreateRouteForm = React.forwardRef(CreateRouteFormComponent);
