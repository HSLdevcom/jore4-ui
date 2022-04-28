import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  HslRouteTransportTargetEnum,
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
} from '../../../generated/graphql';
import { Column, Row } from '../../../layoutComponents';
import { LineTypeDropdown } from './LineTypeDropdown';
import { TransportTargetDropdown } from './TransportTargetDropdown';
import { VehicleModeDropdown } from './VehicleModeDropdown';

export const schema = z.object({
  lineId: z.string().uuid().optional(), // for lines that are edited
  label: z.string().min(1),
  finnishName: z.string().min(1),
  finnishShortName: z.string().min(1),
  swedishName: z.string().min(1),
  swedishShortName: z.string().min(1),
  transportTarget: z.nativeEnum(HslRouteTransportTargetEnum),
  primaryVehicleMode: z.nativeEnum(ReusableComponentsVehicleModeEnum),
  typeOfLine: z.nativeEnum(RouteTypeOfLineEnum),
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
      <Row className="mb-5 space-x-10">
        <Column className="w-1/2">
          <label htmlFor="finnishShortName">
            {t('lines.finnishShortName')}
          </label>
          <input
            id="finnish-short-name-input"
            type="text"
            {...register('finnishShortName', {})}
          />
          <p>
            {errors.finnishShortName?.type === 'too_small' &&
              t('formValidation.required')}
          </p>
        </Column>
      </Row>
      <Row className="mb-5 space-x-10">
        <Column className="w-1/2">
          <label htmlFor="swedishName">{t('lines.swedishName')}</label>
          <input
            id="swedish-name-input"
            type="text"
            {...register('swedishName', {})}
          />
          <p>
            {errors.swedishName?.type === 'too_small' &&
              t('formValidation.required')}
          </p>
        </Column>
      </Row>
      <Row className="mb-5 space-x-10">
        <Column className="w-1/2">
          <label htmlFor="swedishShortName">
            {t('lines.swedishShortName')}
          </label>
          <input
            id="swedish-short-name-input"
            type="text"
            {...register('swedishShortName', {})}
          />
          <p>
            {errors.swedishShortName?.type === 'too_small' &&
              t('formValidation.required')}
          </p>
        </Column>
      </Row>
      <Row className="space-x-10">
        <Column className="w-1/4">
          <label htmlFor="transportTarget">{t('lines.transportTarget')}</label>
          <Controller
            name="transportTarget"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TransportTargetDropdown
                testId="transport-target-input"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <p>
            {errors.transportTarget?.type === 'invalid_type' &&
              t('formValidation.required')}
          </p>
        </Column>
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
        <Column className="w-1/4">
          <label htmlFor="typeOfLine">{t('lines.linesType')}</label>
          <Controller
            name="typeOfLine"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <LineTypeDropdown
                testId="type-of-line-input"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <p>
            {errors.typeOfLine?.type === 'invalid_type' &&
              t('formValidation.required')}
          </p>
        </Column>
      </Row>
    </div>
  );
};
