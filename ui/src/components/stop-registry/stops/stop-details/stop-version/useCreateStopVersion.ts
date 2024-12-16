import compact from 'lodash/compact';
import pick from 'lodash/pick';
import { DateTime } from 'luxon';
import {
  ServicePatternScheduledStopPointInsertInput,
  StopRegistryKeyValues,
  StopRegistryStopPlaceInput,
  useInsertStopMutation,
  useInsertStopPlaceMutation,
} from '../../../../../generated/graphql';
import { ScheduledStopPointSetInput } from '../../../../../graphql';
import { StopWithDetails } from '../../../../../hooks';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  patchKeyValues,
} from '../../../../../utils';
import { mapOriginalToInput } from './stopPlaceToInputMapperUtils';
import { StopVersionFormState } from './StopVersionFormState';
import { useDeleteStopPlace } from './useDeleteStopPlace';

type Inputs = {
  readonly stopPlaceInput: StopRegistryStopPlaceInput;
  readonly stopPointInput: ScheduledStopPointSetInput;
};

type ValidityInput = {
  validityStart: DateTime;
  validityEnd: DateTime | null;
};

function getValidity(state: StopVersionFormState): ValidityInput {
  const validityStart = mapDateInputToValidityStart(state.validityStart);
  if (!validityStart) {
    throw new Error('Cannot map state with null validityStart');
  }
  const validityEnd: DateTime | null =
    mapDateInputToValidityEnd(state.validityEnd, state.indefinite) ?? null;

  return { validityStart, validityEnd };
}

function getKeyValues(
  state: StopVersionFormState,
  originalStop: StopWithDetails,
): Array<StopRegistryKeyValues | null> {
  return patchKeyValues(
    originalStop.stop_place,
    compact([
      { key: 'validityStart', values: [state.validityStart] },
      !state.indefinite
        ? {
            key: 'validityEnd',
            values: [state.validityEnd as string],
          }
        : undefined,
      { key: 'priority', values: [state.priority.toString(10)] },
    ]),
  );
}

function mapFormStateToInputs(
  state: StopVersionFormState,
  originalStop: StopWithDetails,
): Inputs {
  const validity = getValidity(state);
  const keyValues = getKeyValues(state, originalStop);

  const stopPlaceInput: StopRegistryStopPlaceInput = {
    ...mapOriginalToInput(originalStop),
    id: null,
    keyValues,
    versionComment: state.versionName,
    // versionDescription: state.versionDescription, // Not implemented
    validBetween: {
      fromDate: validity.validityStart,
      toDate: null,
    },
  };

  const stopPointInput: ServicePatternScheduledStopPointInsertInput = {
    ...pick(originalStop, [
      'direction',
      'label',
      'located_on_infrastructure_link_id',
      'measured_location',
      'timing_place_id',
    ]),
    validity_start: validity.validityStart,
    validity_end: validity.validityEnd,
    priority: state.priority,
    vehicle_mode_on_scheduled_stop_point: {
      data: [
        {
          vehicle_mode:
            originalStop.vehicle_mode_on_scheduled_stop_point[0].vehicle_mode,
        },
      ],
    },
  };

  return { stopPlaceInput, stopPointInput };
}

export const useCreateStopVersion = () => {
  const [insertStopPlaceMutation] = useInsertStopPlaceMutation();
  const [insertStopMutation] = useInsertStopMutation();
  const deleteStopPlace = useDeleteStopPlace();

  const createNewVersion = async (
    state: StopVersionFormState,
    originalStop: StopWithDetails,
  ) => {
    const { stopPlaceInput, stopPointInput } = mapFormStateToInputs(
      state,
      originalStop,
    );

    const response = await insertStopPlaceMutation({
      variables: { object: stopPlaceInput },
    });

    // TODO: Update ref to stop point
    const id = response?.data?.stop_registry?.mutateStopPlace?.at(0)?.id;

    if (!id) {
      throw new Error('No id!');
    }

    try {
      await insertStopMutation({
        variables: { object: { ...stopPointInput, stop_place_ref: id } },
      });
    } catch (e) {
      await deleteStopPlace(id);
      throw e;
    }
  };

  return { createNewVersion };
};
