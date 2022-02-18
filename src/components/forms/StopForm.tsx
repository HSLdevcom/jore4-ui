import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  InsertStopMutationVariables,
  ReusableComponentsVehicleModeEnum,
  useInsertStopMutation,
} from '../../generated/graphql';
import { useGetStopLinkAndDirection } from '../../hooks';
import { Column, Row } from '../../layoutComponents';
import { Point } from '../../types';
import {
  DirectionNotResolvedError,
  LinkNotResolvedError,
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapPointToGeoJSON,
  mapToObject,
  mapToVariables,
  showDangerToast,
  showSuccessToast,
} from '../../utils';
import {
  ConfirmSaveForm,
  FormState as ConfirmSaveFormState,
  schema as confirmSaveFormSchema,
} from './ConfirmSaveForm';

const schema = z
  .object({
    finnishName: z.string().min(1),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .merge(confirmSaveFormSchema);

export type FormState = z.infer<typeof schema> & ConfirmSaveFormState;

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

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();
  const [insertStop] = useInsertStopMutation();

  const onSubmit = async (state: FormState) => {
    const stopLocation: Point = {
      latitude: state.latitude,
      longitude: state.longitude,
    };

    try {
      // get computed values for closest link and direction
      const { closestLinkId, direction } = await getStopLinkAndDirection({
        stopLocation,
      });

      // insert stop to db
      const variables: InsertStopMutationVariables = mapToObject({
        located_on_infrastructure_link_id: closestLinkId,
        direction,
        measured_location: mapPointToGeoJSON(stopLocation),
        // TODO: how we should calculate label? Use finnishName as label for now as
        // have been done in jore3 importer, but it won't be correct solution in the long
        // term.
        label: state.finnishName,
        priority: state.priority,
        validity_start: mapDateInputToValidityStart(state.validityStart),
        validity_end: mapDateInputToValidityEnd(state.validityStart),
        vehicle_mode_on_scheduled_stop_point: {
          data: {
            // TODO: Replace hard-coded Bus-value with propagated one
            vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
          },
        },
      });
      await insertStop(mapToVariables(variables));

      // handle success
      showSuccessToast(t('stops.saveSuccess'));
      onSubmitSuccess();
    } catch (err) {
      if (err instanceof LinkNotResolvedError) {
        showDangerToast(t('stops.fetchClosestLinkFailed'));
        return;
      }
      if (err instanceof DirectionNotResolvedError) {
        showDangerToast(t('stops.fetchDirectionFailed'));
        return;
      }
      // if other error happened, show the generic error message
      showDangerToast(
        `${t('errors.saveFailed')}, ${err}, ${(err as Error).message}`,
      );
    }
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={className || ''}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        <div className="mx-12">
          <h2 className="pb-6 text-xl font-bold">{t('stops.stop')}</h2>
          <Row className="space-x-10">
            <Column className="space-y-2">
              <h3 className="text-lg font-bold">{t('stops.nameAddress')}</h3>
              <Column>
                <label htmlFor="finnishName">{t('stops.label')}</label>
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
                  <label htmlFor="latitude">{t('map.latitude')}</label>
                  <input
                    type="number"
                    {...register('latitude', {
                      valueAsNumber: true,
                    })}
                    step="any"
                  />
                  <p>{errors.latitude?.message}</p>
                </Column>
                <Column>
                  <label htmlFor="longitude">{t('map.longitude')}</label>
                  <input
                    type="number"
                    {...register('longitude', {
                      valueAsNumber: true,
                    })}
                    step="any"
                  />
                  <p>{errors.longitude?.message}</p>
                </Column>
              </Row>
            </Column>
          </Row>
        </div>
        <Row className="mt-7 border-t border-light-grey px-12">
          <ConfirmSaveForm className="mt-5" />
        </Row>
      </form>
    </FormProvider>
  );
};

export const StopForm = React.forwardRef(StopFormComponent);
