import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction } from 'react';
import {
  FieldNamesMarkedBoolean,
  FormProvider,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  ReusableComponentsVehicleModeEnum,
  ServicePatternScheduledStopPoint,
} from '../../../generated/graphql';
import { PartialScheduledStopPointSetInput } from '../../../graphql';
import {
  CreateChanges,
  EditChanges,
  useAppDispatch,
  useAppSelector,
  useCreateStop,
  useEditStop,
  useLoader,
} from '../../../hooks';
import { Column, Row, Visible } from '../../../layoutComponents';
import {
  Operation,
  openTimingPlaceModalAction,
  selectIsTimingPlaceModalOpen,
} from '../../../redux';
import { mapToISODate } from '../../../time';
import { RequiredKeys } from '../../../types';
import { SimpleButton } from '../../../uiComponents';
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
  ChangeValidityForm,
  FormState as ChangeValidityFormState,
  schema as changeValidityFormSchema,
} from '../common/ChangeValidityForm';
import { NameConsistencyChecker, TypedName } from '../stop-area';
import { ChooseTimingPlaceDropdown } from './ChooseTimingPlaceDropdown';
import { TimingPlaceModal } from './TimingPlaceModal';

const schema = z
  .object({
    stopId: z.string().uuid().optional(), // for stops that are edited
    label: requiredString,
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
    timingPlaceId: z.string().uuid().nullable(),
  })
  .merge(changeValidityFormSchema);

const testIds = {
  label: 'StopFormComponent::label',
  latitude: 'StopFormComponent::latitude',
  longitude: 'StopFormComponent::longitude',
  timingPlaceDropdown: 'StopFormComponent::timingPlaceDropdown',
  addTimingPlaceButton: 'StopFormComponent::addTimingPlaceButton',
};

export type FormState = z.infer<typeof schema> & ChangeValidityFormState;

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
    label: stop.label ?? '',
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

function mapFormStateToInput(state: FormState) {
  return {
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
}

const isDirtyMap: {
  readonly [key in keyof PartialScheduledStopPointSetInput]: ReadonlyArray<
    keyof FormState
  >;
} = {
  measured_location: ['latitude', 'longitude'],
  label: ['label'],
  priority: ['priority'],
  validity_start: ['validityStart'],
  validity_end: ['validityEnd', 'indefinite'],
  timing_place_id: ['timingPlaceId'],
};

// Only pick changed fields, needed to keep Tiamat happy when updating fields,
// not in Tiamat.
function pickChangedFieldsForPatch(
  input: PartialScheduledStopPointSetInput,
  dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<FormState>>>,
): PartialScheduledStopPointSetInput {
  const dirty = Object.entries(input).filter(([key]) => {
    const formKeys = isDirtyMap[key as keyof PartialScheduledStopPointSetInput];
    if (formKeys) {
      return formKeys.some((formKey) => dirtyFields[formKey]);
    }

    return true;
  });

  return Object.fromEntries(dirty);
}

function getOverriddenNames(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  methods: UseFormReturn<FormState>,
): ReadonlyArray<TypedName> {
  // No name fields to fetch yet on the form.
  // TODO: https://dev.azure.com/hslfi/JORE%204.0/_workitems/edit/47661
  // const [name] = methods.watch(['name', ...]);
  return [];
}

type Props = {
  readonly className?: string;
  readonly defaultValues: Partial<FormState>;
  readonly stopAreaId: string | null | undefined;
  readonly stopPlaceRef?: string | null;
  readonly onSubmit: (changes: CreateChanges | EditChanges) => void;
};

const StopFormComponent: ForwardRefRenderFunction<HTMLFormElement, Props> = (
  { className = '', defaultValues, onSubmit, stopAreaId, stopPlaceRef },
  ref,
) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const {
    formState: { dirtyFields },
    handleSubmit,
    setValue,
  } = methods;

  const { prepareEdit, defaultErrorHandler } = useEditStop();
  const { prepareCreate } = useCreateStop();
  const { setIsLoading } = useLoader(Operation.SaveStop);
  const isTimingPlaceModalOpen = useAppSelector(selectIsTimingPlaceModalOpen);

  const onEdit = async (state: FormState) => {
    // in case of editing, the stopId is valid
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stopId = state.stopId!;
    return prepareEdit({
      stopId,
      stopPlaceRef,
      patch: pickChangedFieldsForPatch(mapFormStateToInput(state), dirtyFields),
    });
  };

  const onCreate = async (state: FormState) => {
    return prepareCreate({
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

  const onTimingPlaceCreated = (timingPlaceId: UUID) => {
    setValue('timingPlaceId', timingPlaceId);
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={className ?? ''}
        onSubmit={handleSubmit(onFormSubmit)}
        ref={ref}
      >
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
              {stopAreaId && (
                <NameConsistencyChecker.StopNameForm
                  stopAreaId={stopAreaId}
                  stopNames={getOverriddenNames(methods)}
                />
              )}
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
                <Column>
                  <Row>
                    <InputField
                      translationPrefix="stops"
                      fieldPath="timingPlaceId"
                      testId={testIds.timingPlaceDropdown}
                      // eslint-disable-next-line react/no-unstable-nested-components
                      inputElementRenderer={(props) => (
                        <ChooseTimingPlaceDropdown
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...props}
                        />
                      )}
                      className="flex-1"
                    />
                    <SimpleButton
                      containerClassName="self-end ml-6"
                      onClick={() => dispatch(openTimingPlaceModalAction())}
                      testId={testIds.addTimingPlaceButton}
                    >
                      {t('stops.createTimingPlace')}
                    </SimpleButton>
                  </Row>
                </Column>
              </FormRow>
            </Column>
          </FormRow>
        </FormColumn>
        <Row className="mt-7 border-t border-light-grey">
          <ChangeValidityForm className="mt-5" />
        </Row>
      </form>
      <Visible visible={isTimingPlaceModalOpen}>
        <TimingPlaceModal onTimingPlaceCreated={onTimingPlaceCreated} />
      </Visible>
    </FormProvider>
  );
};

export const StopForm = React.forwardRef(StopFormComponent);
