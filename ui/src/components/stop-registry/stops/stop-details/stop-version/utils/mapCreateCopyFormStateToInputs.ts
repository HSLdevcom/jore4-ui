import compact from 'lodash/compact';
import pick from 'lodash/pick';
import { DateTime } from 'luxon';
import {
  ServicePatternScheduledStopPointInsertInput,
  StopRegistryKeyValues,
  StopRegistryQuayInput,
} from '../../../../../../generated/graphql';
import { ScheduledStopPointSetInput } from '../../../../../../graphql';
import { EnrichedQuay, StopWithDetails } from '../../../../../../types';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  patchKeyValues,
} from '../../../../../../utils';
import {
  mapCompactOrNull,
  mapInfoSpotToInput,
  mapQuayToInput,
} from '../../../../utils';
import { FailedToResolveExistingShelter } from '../errors';
import { InfoSpotInputHelper, StopVersionFormState } from '../types';
import { StopRegistryQuayCopyInput } from '../types/StopRegistryQuayCopyInput';

type CreateCopyInputs = {
  readonly quayInput: StopRegistryQuayCopyInput;
  readonly stopPointInput: ScheduledStopPointSetInput;
  readonly infoSpotInputs: ReadonlyArray<InfoSpotInputHelper> | null;
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

function getQuayFromStopWithDetails({ quay }: StopWithDetails): EnrichedQuay {
  if (!quay) {
    throw new Error('Quay is missing from the stop that is being copied!');
  }

  return quay;
}

function getQuayNetexId({ stop_place_ref: id }: StopWithDetails): string {
  if (!id) {
    throw new Error('Quay ref is missing from the stop that is being copied!');
  }

  return id;
}

function getKeyValues(
  state: StopVersionFormState,
  originalStop: StopWithDetails,
): Array<StopRegistryKeyValues | null> {
  return patchKeyValues(
    getQuayFromStopWithDetails(originalStop),
    compact([
      { key: 'validityStart', values: [state.validityStart] },
      !state.indefinite
        ? {
            key: 'validityEnd',
            values: [state.validityEnd as string],
          }
        : undefined,
      { key: 'priority', values: [state.priority.toString(10)] },
      // Make Tiamat see this copy as a unique Quay, and not a duplicate.
      {
        key: 'imported-id',
        values: [
          `${getQuayNetexId(originalStop)}-${state.validityStart}-${state.priority}`,
        ],
      },
    ]),
  );
}

function mapQuayAndFormToInput(
  state: StopVersionFormState,
  originalStop: StopWithDetails,
): StopRegistryQuayInput {
  return {
    ...mapQuayToInput(getQuayFromStopWithDetails(originalStop)),
    id: null,
    keyValues: getKeyValues(state, originalStop),
    versionComment: state.versionName,
    // versionDescription: state.versionDescription, // Not implemented
  };
}

function mapStopPointInput(
  state: StopVersionFormState,
  originalStop: StopWithDetails,
): ServicePatternScheduledStopPointInsertInput {
  const validity = getValidity(state);

  return {
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
}

export function mapInfoSpotsToInputs(
  originalStop: StopWithDetails,
): ReadonlyArray<InfoSpotInputHelper> | null {
  const shelters = originalStop.quay?.placeEquipments?.shelterEquipment;

  return mapCompactOrNull(originalStop.quay?.infoSpots, (infoSpot) => {
    const originalShelter =
      shelters?.find(
        (shelter) =>
          shelter &&
          shelter.id &&
          infoSpot.infoSpotLocations?.includes(shelter.id),
      ) ?? null;

    const originalShelterIndex = shelters?.indexOf(originalShelter) ?? -1;

    if (!originalShelter || originalShelterIndex < 0) {
      throw new FailedToResolveExistingShelter(
        `Failed to resolve existing shelter for infoSpot: ${JSON.stringify(infoSpot)}`,
      );
    }

    return {
      originalShelter,
      originalShelterIndex,
      infoSpotInput: mapInfoSpotToInput(infoSpot),
    };
  });
}

export function mapCreateCopyFormStateToInputs(
  state: StopVersionFormState,
  originalStop: StopWithDetails,
): CreateCopyInputs {
  const quayInput = mapQuayAndFormToInput(state, originalStop);
  const stopPointInput = mapStopPointInput(state, originalStop);
  const infoSpotInputs = mapInfoSpotsToInputs(originalStop);

  return { quayInput, stopPointInput, infoSpotInputs };
}
