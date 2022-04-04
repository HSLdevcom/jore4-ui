import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row } from '../../layoutComponents';
import { VehicleModeDropdown } from './VehicleModeDropdown';

export const schema = z.object({
  label: z.string().min(1),
  finnishName: z.string().min(1),
  primaryVehicleMode: z.string().nonempty(),
});

export type FormState = z.infer<typeof schema>;

interface Props {
  id?: string;
  className?: string;
}

export const LinePropertiesForm = ({ id, className }: Props): JSX.Element => {
  const { t } = useTranslation();

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormState>();

  return (
    <div id={id || ''} className={className || ''}>
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
                testId="primary-vehicle-mode-input"
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
    </div>
  );
};
