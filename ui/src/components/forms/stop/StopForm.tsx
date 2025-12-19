import { zodResolver } from '@hookform/resolvers/zod';
import compact from 'lodash/compact';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import {
  DefaultValues,
  FieldNamesMarkedBoolean,
  FormProvider,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import {
  ReusableComponentsVehicleModeEnum,
  StopRegistryNameType,
  StopRegistryQuayInput,
} from '../../../generated/graphql';
import { PartialScheduledStopPointSetInput } from '../../../graphql';
import { useAppSelector } from '../../../hooks';
import { Visible } from '../../../layoutComponents';
import { Operation, selectIsTimingPlaceModalOpen } from '../../../redux';
import { RequiredKeys } from '../../../types';
import {
  KnownValueKey,
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapPointToGeoJSON,
  mapPointToStopRegistryGeoJSON,
  patchKeyValues,
} from '../../../utils';
import { useLoader } from '../../common/hooks';
import {
  CreateChanges,
  CreateStopPointInput,
  usePrepareCreate,
} from '../../map/stops/hooks/useCreateStop';
import {
  EditChanges,
  useDefaultErrorHandler,
  usePrepareEdit,
} from '../../map/stops/hooks/useEditStop';
import { FormActionButtons, ValidationError } from '../common';
import { useDirtyFormBlockNavigation } from '../common/NavigationBlocker';
import { Location, PublicCodeAndArea, VersionInfo } from './components';
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
    label: state.publicCode.value,
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
      key: KnownValueKey.ImportedId,
      values: [
        `${state.publicCode.value}-${state.validityStart}-${state.priority}`,
      ],
    },
    { key: KnownValueKey.Priority, values: [state.priority.toString(10)] },
    { key: KnownValueKey.ValidityStart, values: [state.validityStart] },
    state.validityEnd
      ? {
          key: KnownValueKey.ValidityEnd,
          values: [state.validityEnd],
        }
      : undefined,
  ]);
}

function mapFormStateToQuayInput(state: StopFormState): StopRegistryQuayInput {
  return {
    geometry: mapPointToStopRegistryGeoJSON(state),
    publicCode: state.publicCode.value,
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
    versionComment: state.reasonForChange !== '' ? state.reasonForChange : null,
  };
}

const isDirtyMap: {
  readonly [key in keyof PartialScheduledStopPointSetInput]: ReadonlyArray<
    keyof StopFormState
  >;
} = {
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

    // Label/PublicCode cannot be updated
    if (key === 'label') {
      return false;
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
    const filteredKeyValues = patchKeyValues(
      formState,
      mapFormStateToQuayKeyValues(formState),
    ).filter((kv) =>
      kv?.key !== KnownValueKey.ValidityEnd ? true : !formState.indefinite,
    );

    return {
      keyValues: filteredKeyValues,
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

function getReasonForChangePatch(
  { reasonForChange }: DirtyFields,
  formState: StopFormState,
): StopRegistryQuayInput {
  if (reasonForChange && formState.reasonForChange !== '') {
    return { versionComment: formState.reasonForChange };
  }

  return { versionComment: null };
}

function pickChangedFieldsForQuayPatch(
  dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<StopFormState>>>,
  formState: StopFormState,
): StopRegistryQuayInput {
  return {
    ...getGeometryPatch(dirtyFields, formState),
    ...getKeyValuesPatch(dirtyFields, formState),
    ...getLocationPatch(dirtyFields, formState),
    ...getReasonForChangePatch(dirtyFields, formState),
  };
}

type StopFormProps = {
  readonly className?: string;
  readonly editing: boolean;
  readonly defaultValues: DefaultValues<StopFormState>;
  readonly onCancel: () => void;
  readonly testIdPrefix: string;
} & (
  | {
      readonly onSubmit: (changes: CreateChanges | EditChanges) => void;
      readonly submitState?: false | never;
    }
  | {
      readonly onSubmit: (
        changes: CreateChanges | EditChanges,
        state: StopFormState,
      ) => void;
      readonly submitState: true;
    }
);

const StopFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  StopFormProps
> = (
  {
    className,
    editing,
    defaultValues,
    onSubmit,
    submitState,
    onCancel,
    testIdPrefix,
  },
  ref,
) => {
  const { t } = useTranslation();

  const methods = useForm<StopFormState>({
    defaultValues,
    resolver: zodResolver(stopFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'StopForm', {
    allowSearchChange: true, // Allow search change so that moving the map does not show the navigation blocked dialog
    allowStateChange: true, // Allow state change so that location state updates do not show the navigation blocked dialog
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
    if (!state.stopId || !state.quayId || !state.stopArea?.netexId) {
      throw new Error(
        `Expected form to have StopId(${state.stopId}), QuayId(${state.quayId}) and StopPlaceId(${state.stopArea?.netexId})!`,
      );
    }

    return prepareEdit({
      stopLabel: state.publicCode.value,
      stopId: state.stopId,
      stopPointPatch: pickChangedFieldsForPatch(
        mapFormStateToStopPointSetInput(state),
        dirtyFields,
      ),
      stopPlaceId: state.stopArea.netexId,
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
      stopPlaceId: state.stopArea!.netexId,
    });
  };

  const onFormSubmit = async (state: StopFormState) => {
    setIsLoading(true);
    try {
      const changes = state.stopId
        ? await onEdit(state)
        : await onCreate(state);
      setIsLoading(false);
      return submitState ? onSubmit(changes, state) : onSubmit(changes);
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
        <div className="min-h-0 overflow-auto">
          <PublicCodeAndArea
            className="p-4"
            publicCodeDisabled={editing}
            // Either editing or stop creating was initiated from a Stip Area.
            stopAreaDisabled={!!defaultValues.stopArea}
          />
          <Location className="p-4" />
          <VersionInfo className="border-t border-light-grey p-4" />

          {missingId ?? (
            <ValidationError
              errorMessage={t('stops.missingIds')}
              fieldPath="stopId"
            />
          )}
        </div>
        <FormActionButtons
          onCancel={onCancel}
          testIdPrefix={testIdPrefix}
          isDisabled={
            !methods.formState.isDirty || methods.formState.isSubmitting
          }
          isSubmitting={methods.formState.isSubmitting}
          variant="modal"
        />
      </form>

      <Visible visible={isTimingPlaceModalOpen}>
        <TimingPlaceModal onTimingPlaceCreated={onTimingPlaceCreated} />
      </Visible>
    </FormProvider>
  );
};

export const StopForm = forwardRef(StopFormComponent);
