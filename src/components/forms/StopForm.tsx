import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useSubmitCreateStopForm } from '../../hooks';
import { Column, Row } from '../../layoutComponents';

const schema = z.object({
  finnishName: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export type FormState = z.infer<typeof schema>;

interface Props {
  className?: string;
  defaultValues: Partial<FormState>;
  onSubmitSuccess: () => void;
}

const StopFormComponent = (
  { className, defaultValues, onSubmitSuccess }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const [submitFn, submitResult] = useSubmitCreateStopForm();

  const onSubmit = async (state: FormState) => {
    await submitFn(state);
  };

  useEffect(() => {
    if (submitResult?.called && submitResult?.data) {
      onSubmitSuccess();
    }
  }, [submitResult, onSubmitSuccess]);

  return (
    <form
      className={className || ''}
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
    >
      <h2 className="pb-6 text-xl font-bold">{t('stops.stop')}</h2>
      <Row className="space-x-10">
        <Column className="space-y-2">
          <h3 className="text-lg font-bold">{t('stops.nameAddress')}</h3>
          <Column>
            <label htmlFor="finnishName">{t('stops.finnishName')}</label>
            <input type="text" {...register('finnishName', {})} />
            <p>
              {errors.finnishName?.type === 'too_small' &&
                t('formValidation.required')}
            </p>
          </Column>
        </Column>
        <Column className="space-y-2">
          <h3 className="text-lg font-bold">{t('map.location')}</h3>
          <Row className="space-x-5">
            <Column>
              <label htmlFor="lat">{t('map.latitude')}</label>
              <input
                type="number"
                {...register('lat', {
                  valueAsNumber: true,
                })}
                step="any"
              />
              <p>{errors.lat?.message}</p>
            </Column>
            <Column>
              <label htmlFor="lng">{t('map.longitude')}</label>
              <input
                type="number"
                {...register('lng', {
                  valueAsNumber: true,
                })}
                step="any"
              />
              <p>{errors.lng?.message}</p>
            </Column>
          </Row>
        </Column>
      </Row>
    </form>
  );
};

export const StopForm = React.forwardRef(StopFormComponent);
