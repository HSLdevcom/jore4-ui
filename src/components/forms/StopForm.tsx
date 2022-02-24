import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  ReusableComponentsVehicleModeEnum,
  ServicePatternScheduledStopPoint,
  ServicePatternScheduledStopPointInsertInput,
  ServicePatternScheduledStopPointSetInput,
} from '../../generated/graphql';
import { useEditStop } from '../../hooks';
import { Column, Row } from '../../layoutComponents';
import { mapToISODate } from '../../time';
import { RequiredKeys } from '../../types';
import {
  DirectionNotFoundError,
  EditRouteTerminalStopsError,
  LinkNotFoundError,
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapLngLatToPoint,
  mapPointToGeoJSON,
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
    stopId: z.string().uuid().optional(), // for stops that are edited
    finnishName: z.string().min(1),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .merge(confirmSaveFormSchema);

export type FormState = z.infer<typeof schema> & ConfirmSaveFormState;

export const mapStopDataToFormState = (
  stop: RequiredKeys<
    Partial<ServicePatternScheduledStopPoint>,
    'measured_location'
  >,
) => {
  const { latitude, longitude } = mapLngLatToPoint(
    stop.measured_location.coordinates,
  );
  const formState: Partial<FormState> = {
    stopId: stop.scheduled_stop_point_id,
    finnishName: stop.label || '',
    latitude,
    longitude,
    priority: stop.priority,
    validityStart: mapToISODate(stop.validity_start),
    validityEnd: mapToISODate(stop.validity_end),
    indefinite: !stop.validity_end,
  };

  return formState;
};

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

  const {
    prepareAndValidateEdit,
    mapEditChangesToMutationVariables,
    editStopMutation,
    prepareAndValidateCreate,
    mapCreateChangesToMutationVariables,
    insertStopMutation,
  } = useEditStop();

  const mapFormStateToInput = (state: FormState) => {
    const input:
      | ServicePatternScheduledStopPointSetInput
      | ServicePatternScheduledStopPointInsertInput = {
      measured_location: mapPointToGeoJSON(state),
      label: state.finnishName,
      priority: state.priority,
      validity_start: mapDateInputToValidityStart(state.validityStart),
      validity_end: mapDateInputToValidityEnd(state.validityStart),
    };
    return input;
  };

  const onError = (err: Error) => {
    // eslint-disable-next-line no-console
    console.error('Edit failed:', err);
    if (err instanceof LinkNotFoundError) {
      showDangerToast(t('stops.fetchClosestLinkFailed'));
      return;
    }
    if (err instanceof DirectionNotFoundError) {
      showDangerToast(t('stops.fetchDirectionFailed'));
      return;
    }
    if (err instanceof EditRouteTerminalStopsError) {
      showDangerToast(t('stops.cannotEditTerminalStops'));
      return;
    }
    // if other error happened, show the generic error message
    showDangerToast(`${t('errors.saveFailed')}, ${err}, ${err.message}`);
  };

  const onEdit = async (state: FormState) => {
    try {
      const changes = await prepareAndValidateEdit({
        stopId: state.stopId,
        patch: {
          ...mapFormStateToInput(state),
        },
      });
      if (changes.deleteStopFromRoutes.length > 0) {
        const deletedFromRouteLabels = changes.deleteStopFromRoutes.map(
          (item) => item.label,
        );
        showDangerToast(
          `This stop is now removed from the following routes: ${deletedFromRouteLabels.join(
            ', ',
          )}`,
        );
      }
      const variables = mapEditChangesToMutationVariables(changes);
      await editStopMutation({ variables });

      showSuccessToast(t('stops.editSuccess'));
      onSubmitSuccess();
    } catch (err) {
      onError(err as Error);
    }
  };

  const onCreate = async (state: FormState) => {
    try {
      const changes = await prepareAndValidateCreate({
        input: {
          ...mapFormStateToInput(state),
          vehicle_mode_on_scheduled_stop_point: {
            data: [
              {
                // TODO: Replace hard-coded Bus-value with propagated one
                vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
              },
            ],
          },
        },
      });

      const variables = mapCreateChangesToMutationVariables(changes);
      await insertStopMutation({ variables });

      showSuccessToast(t('stops.saveSuccess'));
      onSubmitSuccess();
    } catch (err) {
      onError(err as Error);
    }
  };

  const onSubmit = (state: FormState) => {
    return state.stopId ? onEdit(state) : onCreate(state);
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
