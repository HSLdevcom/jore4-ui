import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  ReusableComponentsVehicleModeEnum,
  ServicePatternScheduledStopPoint,
} from '../../../generated/graphql';
import {
  CreateChanges,
  EditChanges,
  useCreateStop,
  useEditStop,
  useLoader,
} from '../../../hooks';
import { Column, Row } from '../../../layoutComponents';
import { Operation } from '../../../redux';
import { mapToISODate } from '../../../time';
import { RequiredKeys } from '../../../types';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapLngLatToPoint,
  mapPointToGeoJSON,
} from '../../../utils';
import {
  FormColumn,
  FormRow,
  InputField,
  requiredNumber,
  requiredString,
} from '../common';
import {
  ConfirmSaveForm,
  FormState as ConfirmSaveFormState,
  schema as confirmSaveFormSchema,
} from '../common/ConfirmSaveForm';
import { ChooseTimingPlaceDropdown } from './ChooseTimingPlaceDropdown';

const schema = z
  .object({
    stopId: z.string().uuid().optional(), // for stops that are edited
    label: requiredString,
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
    timingPlaceId: z.string().uuid().nullable(),
  })
  .merge(confirmSaveFormSchema);

const testIds = {
  label: 'StopFormComponent::label',
  latitude: 'StopFormComponent::latitude',
  longitude: 'StopFormComponent::longitude',
  timingPlace: 'StopFormComponent::timingPlace',
};

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
    label: stop.label || '',
    latitude,
    longitude,
    priority: stop.priority,
    validityStart: mapToISODate(stop.validity_start),
    validityEnd: mapToISODate(stop.validity_end),
    indefinite: !stop.validity_end,
    timingPlaceId: stop.timing_place_id,
  };

  return formState;
};

interface Props {
  className?: string;
  defaultValues: Partial<FormState>;
  onSubmit: (changes: CreateChanges | EditChanges) => void;
}

const StopFormComponent = (
  { className = '', defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const { t } = useTranslation();

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = methods;

  const { prepareEdit, defaultErrorHandler } = useEditStop();
  const { prepareCreate } = useCreateStop();
  const { setIsLoading } = useLoader(Operation.SaveStop);

  const mapFormStateToInput = (state: FormState) => {
    const input = {
      measured_location: mapPointToGeoJSON(state),
      label: state.label,
      priority: state.priority,
      validity_start: mapDateInputToValidityStart(state.validityStart),
      validity_end: mapDateInputToValidityEnd(
        state.validityEnd,
        state.indefinite,
      ),
      timing_place_id: state.timingPlaceId,
    };
    return input;
  };

  const onEdit = async (state: FormState) => {
    // in case of editing, the stopId is valid
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stopId = state.stopId!;
    const changes = await prepareEdit({
      stopId,
      patch: {
        ...mapFormStateToInput(state),
      },
    });

    return changes;
  };

  const onCreate = async (state: FormState) => {
    const changes = await prepareCreate({
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
    return changes;
  };

  const onFormSubmit = async (state: FormState) => {
    setIsLoading(true);
    try {
      const changes = state.stopId
        ? await onEdit(state)
        : await onCreate(state);
      setIsLoading(false);
      return onSubmit(changes);
    } catch (err) {
      setIsLoading(false);
      return defaultErrorHandler(err as Error);
    }
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={className || ''}
        onSubmit={handleSubmit(onFormSubmit)}
        ref={ref}
      >
        <div className="mx-12">
          <h3 className="pb-6">{t('stops.stop')}</h3>
          <FormColumn>
            <FormRow mdColumns={2}>
              <Column>
                <h5 className="mb-2">{t('stops.nameAddress')}</h5>
                <InputField<FormState>
                  type="text"
                  translationPrefix="stops"
                  fieldPath="label"
                  testId={testIds.label}
                />
              </Column>
              <Column className="space-y-4">
                <h5 className="mb-2">{t('map.location')}</h5>
                <FormRow mdColumns={2}>
                  <InputField<FormState>
                    type="number"
                    translationPrefix="map"
                    fieldPath="latitude"
                    testId={testIds.latitude}
                    step="any"
                  />
                  <InputField<FormState>
                    type="number"
                    translationPrefix="map"
                    fieldPath="longitude"
                    testId={testIds.longitude}
                    step="any"
                  />
                </FormRow>
                <FormRow>
                  <InputField<FormState>
                    translationPrefix="stops"
                    fieldPath="timingPlaceId"
                    testId={testIds.timingPlace}
                    inputElementRenderer={(props) => (
                      <ChooseTimingPlaceDropdown
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...props}
                      />
                    )}
                    className="sm:col-span-2"
                  />
                </FormRow>
              </Column>
            </FormRow>
          </FormColumn>
        </div>
        <Row className="mt-7 border-t border-light-grey px-12">
          <ConfirmSaveForm className="mt-5" />
        </Row>
      </form>
    </FormProvider>
  );
};

export const StopForm = React.forwardRef(StopFormComponent);
