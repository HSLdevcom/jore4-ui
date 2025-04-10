import { zodResolver } from '@hookform/resolvers/zod';
import compact from 'lodash/compact';
import React, { ForwardRefRenderFunction } from 'react';
import {
  DefaultValues,
  FieldNamesMarkedBoolean,
  FormProvider,
  useForm,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import {
  ReusableComponentsVehicleModeEnum,
  StopRegistryNameType,
  StopRegistryQuayInput,
} from '../../../generated/graphql';
import { PartialScheduledStopPointSetInput } from '../../../graphql';
import {
  CreateChanges,
  CreateStopPointInput,
  EditChanges,
  useAppSelector,
  useDefaultErrorHandler,
  useLoader,
  usePrepareCreate,
  usePrepareEdit,
} from '../../../hooks';
import { Visible } from '../../../layoutComponents';
import { Operation, selectIsTimingPlaceModalOpen } from '../../../redux';
import { RequiredKeys } from '../../../types';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapPointToGeoJSON,
  mapPointToStopRegistryGeoJSON,
  patchKeyValues,
} from '../../../utils';
import { ValidationError } from '../common';
import { Location } from './components/Location';
import { PublicCodeAndArea } from './components/PublicCodeAndArea';
import { VersionInfo } from './components/VersionInfo';
import { TimingPlaceModal } from './TimingPlaceModal';
import { MISSING_ID, StopFormState, stopFormSchema } from './types';

type StopFormStateStopPointMappedSetInput = RequiredKeys<
  PartialScheduledStopPointSetInput,
  | 'measured_location'
  | 'label'
  | 'priority'
  | 'validity_start'
  | 'validity_end'
  | 'timing_place_id'
>;

function mapFormStateToStopPointSetInput(
  state: StopFormState,
): StopFormStateStopPointMappedSetInput {
  return {
    measured_location: mapPointToGeoJSON(state),
    label: state.label,
    priority: state.priority,
    validity_start: mapDateInputToValidityStart(state.validityStart),
    validity_end: mapDateInputToValidityEnd(
      state.validityEnd,
      state.indefinite,
    ),
    timing_place_id: state.timingPlaceId ?? null,
  };
}

function mapFormStateToStopPointCreateInput(
  state: StopFormState,
): CreateStopPointInput {
  return {
    ...mapFormStateToStopPointSetInput(state),
    vehicle_mode_on_scheduled_stop_point: {
      data: [
        {
          // TODO: Replace hard-coded Bus-value with propagated one
          vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
        },
      ],
    },
  };
}

function mapFormStateToQuayKeyValues(
  state: StopFormState,
): Array<{ key: string; values: string[] }> {
  return compact([
    {
      key: 'imported-id',
      values: [`${state.label}-${state.validityStart}-${state.priority}`],
    },
    { key: 'priority', values: [state.priority.toString(10)] },
    { key: 'validityStart', values: [state.validityStart] },
    state.indefinite
      ? null
      : {
          key: 'validityEnd',
          values: [state.validityEnd as string],
        },
  ]);
}

function mapFormStateToQuayInput(state: StopFormState): StopRegistryQuayInput {
  return {
    geometry: mapPointToStopRegistryGeoJSON(state),
    publicCode: state.label,
    description: {
      lang: 'fin',
      value: state.locationFin,
    },
    alternativeNames: [
      {
        nameType: StopRegistryNameType.Other,
        name: { lang: 'swe', value: state.locationSwe },
      },
    ],
    keyValues: mapFormStateToQuayKeyValues(state),
  };
}

const isDirtyMap: {
  readonly [key in keyof PartialScheduledStopPointSetInput]: ReadonlyArray<
    keyof StopFormState
  >;
} = {
  label: ['label'],
  measured_location: ['latitude', 'longitude'],
  priority: ['priority'],
  validity_start: ['validityStart'],
  validity_end: ['validityEnd', 'indefinite'],
  timing_place_id: ['timingPlaceId'],
};

// Only pick changed fields, needed to keep Tiamat happy when updating fields,
// not in Tiamat.
function pickChangedFieldsForPatch(
  input: PartialScheduledStopPointSetInput,
  dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<StopFormState>>>,
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

type DirtyFields = Partial<Readonly<FieldNamesMarkedBoolean<StopFormState>>>;

function getGeometryPatch(
  { latitude, longitude }: DirtyFields,
  formState: StopFormState,
): StopRegistryQuayInput {
  if (latitude || longitude) {
    return { geometry: mapPointToStopRegistryGeoJSON(formState) };
  }

  return {};
}

function getKeyValuesPatch(
  { priority, validityStart, validityEnd, indefinite }: DirtyFields,
  formState: StopFormState,
): StopRegistryQuayInput {
  if (priority || validityStart || validityEnd || indefinite) {
    return {
      keyValues: patchKeyValues(
        formState,
        mapFormStateToQuayKeyValues(formState),
      ),
    };
  }

  return {};
}

function getLocationPatch(
  { locationFin, locationSwe }: DirtyFields,
  formState: StopFormState,
): StopRegistryQuayInput {
  const patchFin: StopRegistryQuayInput = {
    description: { lang: 'fin', value: formState.locationFin },
  };

  const patchSwe: StopRegistryQuayInput = {
    alternativeNames: [
      {
        nameType: StopRegistryNameType.Other,
        name: { lang: 'swe', value: formState.locationSwe },
      },
    ],
  };

  if (locationFin && locationSwe) {
    return { ...patchFin, ...patchSwe };
  }

  if (locationFin) {
    return patchFin;
  }

  if (locationSwe) {
    return patchSwe;
  }

  return {};
}

function getVersionNamePatch(
  { versionName }: DirtyFields,
  formState: StopFormState,
): StopRegistryQuayInput {
  if (versionName) {
    return { versionComment: formState.versionName };
  }

  return {};
}

function pickChangedFieldsForQuayPatch(
  dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<StopFormState>>>,
  formState: StopFormState,
): StopRegistryQuayInput {
  return {
    ...getGeometryPatch(dirtyFields, formState),
    ...getKeyValuesPatch(dirtyFields, formState),
    ...getLocationPatch(dirtyFields, formState),
    ...getVersionNamePatch(dirtyFields, formState),
  };
}

type Props = {
  readonly className?: string;
  readonly editing: boolean;
  readonly defaultValues: DefaultValues<StopFormState>;
  readonly onSubmit: (changes: CreateChanges | EditChanges) => void;
};

const StopFormComponent: ForwardRefRenderFunction<HTMLFormElement, Props> = (
  { className = '', editing, defaultValues, onSubmit },
  ref,
) => {
  const methods = useForm<StopFormState>({
    defaultValues,
    resolver: zodResolver(stopFormSchema),
  });

  const {
    formState: { dirtyFields, errors },
    handleSubmit,
    setValue,
  } = methods;
  const missingId = errors.stopId?.message === MISSING_ID;

  const prepareEdit = usePrepareEdit();
  const defaultErrorHandler = useDefaultErrorHandler();
  const prepareCreate = usePrepareCreate();
  const { setIsLoading } = useLoader(Operation.SaveStop);
  const isTimingPlaceModalOpen = useAppSelector(selectIsTimingPlaceModalOpen);

  const onEdit = async (state: StopFormState) => {
    // in case of editing, the stopId is valid
    if (!state.stopId || !state.quayId || !state.stopArea?.netextId) {
      throw new Error(
        `Expected form to have StopId(${state.stopId}), QuayId(${state.quayId}) and StopPlaceId(${state.stopArea?.netextId})!`,
      );
    }

    return prepareEdit({
      stopLabel: state.label,
      stopId: state.stopId,
      stopPointPatch: pickChangedFieldsForPatch(
        mapFormStateToStopPointSetInput(state),
        dirtyFields,
      ),
      stopPlaceId: state.stopArea.netextId,
      quayId: state.quayId,
      quayPatch: pickChangedFieldsForQuayPatch(dirtyFields, state),
    });
  };

  const onCreate = async (state: StopFormState) => {
    return prepareCreate({
      stopPoint: mapFormStateToStopPointCreateInput(state),
      quay: mapFormStateToQuayInput(state),
      // Typed as nullable, but refined to be non nullable after validation.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stopPlaceId: state.stopArea!.netextId,
    });
  };

  const onFormSubmit = async (state: StopFormState) => {
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
    setValue('timingPlaceId', timingPlaceId, {
      shouldDirty: true,
    });
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={twMerge('text-sm font-normal', className)}
        onSubmit={handleSubmit(onFormSubmit)}
        ref={ref}
      >
        <PublicCodeAndArea editing={editing} className="p-4" />
        <Location className="p-4" />
        <VersionInfo className="border-t border-light-grey p-4" />

        {missingId ?? (
          <ValidationError
            errorMessage="Pysäkkirekisteri ja linjaverkosto tietokanta eivät ole ajantasalla. Pysäkkiä ei voi muokata!"
            fieldPath="stopId"
          />
        )}
      </form>

      <Visible visible={isTimingPlaceModalOpen}>
        <TimingPlaceModal onTimingPlaceCreated={onTimingPlaceCreated} />
      </Visible>
    </FormProvider>
  );
};

export const StopForm = React.forwardRef(StopFormComponent);
