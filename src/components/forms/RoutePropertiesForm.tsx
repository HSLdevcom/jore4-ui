import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row } from '../../layoutComponents';
import { ChooseLineDropdown } from './ChooseLineDropdown';

const schema = z.object({
  finnishName: z.string().min(1),
  label: z.string().min(1),
  onLineId: z.string().uuid(),
});

export type FormState = z.infer<typeof schema>;

interface Props {
  id?: string;
  routeLabel?: string | null;
  className?: string;
  defaultValues: Partial<FormState>;
  onSubmit: (state: FormState) => void;
}

const RoutePropertiesFormComponent = (
  { id, routeLabel, className, defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  return (
    <form
      id={id || 'route-properties-form'}
      className={className || ''}
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
    >
      <Row>
        <h2 className="mb-8 text-2xl font-bold">
          {t('routes.route')} {routeLabel}
        </h2>
      </Row>
      <Row className="mb-5 space-x-10">
        <Column className="w-2/4">
          <label htmlFor="finnish_description">{t('routes.name')}</label>
          <input
            id="finnish_description"
            type="text"
            {...register('finnishName', {})}
          />
          <p>
            {errors.finnishName?.type === 'too_small' &&
              t('formValidation.required')}
          </p>
        </Column>
        <Column className="w-1/4">
          <label htmlFor="label">{t('routes.label')}</label>
          <input
            id="finnish_description"
            type="text"
            {...register('label', {})}
          />
          <p>
            {errors.label?.type === 'too_small' && t('formValidation.required')}
          </p>
        </Column>
        <Column className="w-1/4">
          <label htmlFor="onLineId">{t('routes.addToLine')}</label>
          <Controller
            name="onLineId"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <ChooseLineDropdown
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <p>{errors.onLineId?.message}</p>
        </Column>
      </Row>
    </form>
  );
};

export const RoutePropertiesForm = React.forwardRef(
  RoutePropertiesFormComponent,
);
