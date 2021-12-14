import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row } from '../../layoutComponents';
import { VehicleModeDropdown } from './VehicleModeDropdown';

const schema = z.object({
  label: z.string().min(1),
  finnishName: z.string().min(1),
  primaryVehicleMode: z.string().nonempty(),
});

export type FormState = z.infer<typeof schema>;

interface Props {
  id?: string;
  className?: string;
  defaultValues: Partial<FormState>;
  onSubmit: (state: FormState) => void;
}

const LinePropertiesFormComponent = (
  { id, className, defaultValues, onSubmit }: Props,
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
      id={id || 'line-properties-form'}
      className={className || ''}
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
    >
      <Row>
        <h2 className="mb-8 text-2xl font-bold">{t('lines.properties')}</h2>
      </Row>
      <Row className="mb-5 space-x-10">
        <Column className="w-1/4">
          <label htmlFor="label">{t('lines.label')}</label>
          <input id="label-input" type="text" {...register('label', {})} />
          <p>
            {errors.label?.type === 'too_small' && t('formValidation.required')}
          </p>
        </Column>
      </Row>
      <Row className="mb-5 space-x-10">
        <Column className="w-1/2">
          <label htmlFor="finnishName">{t('lines.finnishName')}</label>
          <input
            id="finnish-name-input"
            type="text"
            {...register('finnishName', {})}
          />
          <p>
            {errors.finnishName?.type === 'too_small' &&
              t('formValidation.required')}
          </p>
        </Column>
      </Row>
      <Row className="space-x-10">
        <Column className="w-1/4">
          <label htmlFor="primaryVehicleMode">
            {t('lines.primaryVehicleMode')}
          </label>
          <Controller
            name="primaryVehicleMode"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <VehicleModeDropdown
                id="primary-vehicle-mode-input"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <p>
            {errors.primaryVehicleMode?.type === 'invalid_type' &&
              t('formValidation.required')}
          </p>
        </Column>
      </Row>
    </form>
  );
};

export const LinePropertiesForm = React.forwardRef(LinePropertiesFormComponent);
