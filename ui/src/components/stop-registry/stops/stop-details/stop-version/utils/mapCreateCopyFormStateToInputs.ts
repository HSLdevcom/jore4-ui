import compact from 'lodash/compact';
import pick from 'lodash/pick';
import { DateTime } from 'luxon';
import {
  ServicePatternScheduledStopPointInsertInput,
  StopRegistryKeyValues,
  StopRegistryStopPlaceInput,
} from '../../../../../../generated/graphql';
import { ScheduledStopPointSetInput } from '../../../../../../graphql';
import { StopWithDetails } from '../../../../../../hooks';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  patchKeyValues,
} from '../../../../../../utils';
import { mapStopPlaceToInput } from '../../../../stop-areas/stop-area-details/mapStopPlaceToInput';
import { mapCompactOrNull, mapInfoSpotToInput } from '../../../../utils';
import { FailedToResolveExistingShelter } from '../errors';
import { InfoSpotInputHelper, StopVersionFormState } from '../types';

type CreateCopyInputs = {
  readonly stopPlaceInput: StopRegistryStopPlaceInput;
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

function mapStopPlaceInput(
  state: StopVersionFormState,
  originalStop: StopWithDetails,
): StopRegistryStopPlaceInput {
  return {
    ...mapStopPlaceToInput(originalStop),
    id: null,
    keyValues: getKeyValues(state, originalStop),
    versionComment: state.versionName,
    // versionDescription: state.versionDescription, // Not implemented
    validBetween: {
      fromDate: DateTime.now(),
      toDate: null,
    },
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
  return mapCompactOrNull(originalStop.stop_place?.infoSpots, (infoSpot) => {
    const shelters =
      originalStop.stop_place?.quays?.at(0)?.placeEquipments?.shelterEquipment;

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
  const stopPlaceInput = mapStopPlaceInput(state, originalStop);
  const stopPointInput = mapStopPointInput(state, originalStop);
  const infoSpotInputs = mapInfoSpotsToInputs(originalStop);

  return { stopPlaceInput, stopPointInput, infoSpotInputs };
}
