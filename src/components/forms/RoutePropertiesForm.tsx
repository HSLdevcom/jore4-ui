import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../layoutComponents';
import { ChooseLineDropdown } from './ChooseLineDropdown';
import { ConfirmSaveForm } from './ConfirmSaveForm';
import { FormState, schema } from './CreateRouteForm';

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

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
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
            <label htmlFor="description_i18n">{t('routes.name')}</label>
            <input
              id="description_i18n"
              type="text"
              {...register('description_i18n', {})}
            />
            <p>
              {errors.description_i18n?.type === 'too_small' &&
                t('formValidation.required')}
            </p>
          </Column>
          <Column className="w-1/4">
            <label htmlFor="label">{t('routes.label')}</label>
            <input id="label" type="text" {...register('label', {})} />
            <p>
              {errors.label?.type === 'too_small' &&
                t('formValidation.required')}
            </p>
          </Column>
          <Column className="w-1/4">
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
            <p>
              {errors.on_line_id?.type === 'invalid_type' &&
                t('formValidation.required')}
            </p>
          </Column>
        </Row>
        <Row className="mt-7 border-t">
          <ConfirmSaveForm className="mt-5" />
        </Row>
      </form>
    </FormProvider>
  );
};

export const RoutePropertiesForm = React.forwardRef(
  RoutePropertiesFormComponent,
);
