import compact from 'lodash/compact';
import pick from 'lodash/pick';
import { DateTime } from 'luxon';
import {
  ServicePatternScheduledStopPointInsertInput,
  StopRegistryKeyValues,
  StopRegistryNameType,
  StopRegistryQuayInput,
} from '../../../../../../generated/graphql';
import { EnrichedQuay, StopWithDetails } from '../../../../../../types';
import {
  KeyValueKeysEnum,
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapPointToGeoJSON,
  mapPointToStopRegistryGeoJSON,
  patchKeyValues,
} from '../../../../../../utils';
import { StopFormState } from '../../../../../forms/stop';
import {
  mapAlternativeNames,
  mapCompactOrNull,
  mapInfoSpotToInput,
  mapQuayToInput,
} from '../../../../utils';
import { FailedToResolveExistingShelter } from '../errors';
import { InfoSpotInputHelper, StopVersionFormState } from '../types';
import { CopyStopInputs } from './useCopyStop';

function getStopPlaceId(originalStop: StopWithDetails): string {
  const id = originalStop.stop_place?.id;

  if (!id) {
    throw new Error(
      "StopPlace or it's Netex ID missing from the stop that is being copied!",
    );
  }

  return id;
}

type ValidityInput = {
  validityStart: DateTime;
  validityEnd: DateTime | null;
};

function getValidity(
  state: StopVersionFormState | StopFormState,
): ValidityInput {
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
  state: StopVersionFormState | StopFormState,
  originalStop: StopWithDetails,
): Array<StopRegistryKeyValues | null> {
  return patchKeyValues(
    getQuayFromStopWithDetails(originalStop),
    compact([
      { key: KeyValueKeysEnum.ValidityStart, values: [state.validityStart] },
      !state.indefinite
        ? {
            key: KeyValueKeysEnum.ValidityEnd,
            values: [state.validityEnd as string],
          }
        : undefined,
      { key: KeyValueKeysEnum.Priority, values: [state.priority.toString(10)] },
      // Make Tiamat see this copy as a unique Quay, and not a duplicate.
      {
        key: KeyValueKeysEnum.ImportedId,
        values: [
          `${getQuayNetexId(originalStop)}-${state.validityStart}-${state.priority}`,
        ],
      },
    ]),
  );
}

function isStopFormState(
  state: StopVersionFormState | StopFormState,
): state is StopFormState {
  return (state as StopFormState).latitude !== undefined;
}

function mapQuayAndFormToInput(
  state: StopVersionFormState | StopFormState,
  originalStop: StopWithDetails,
): StopRegistryQuayInput {
  const input = {
    ...mapQuayToInput(getQuayFromStopWithDetails(originalStop)),
    id: null,
    keyValues: getKeyValues(state, originalStop),
    versionComment: state.reasonForChange,
  };

  if (!isStopFormState(state)) {
    return input;
  }

  // Replace swedish location from the alternative names
  const alternativeNames = mapAlternativeNames(
    originalStop.quay?.alternativeNames,
  )?.filter((alt) => alt.name.lang !== 'swe' && alt.nameType !== 'other');

  alternativeNames?.push({
    name: { lang: 'swe', value: state.locationSwe ?? null },
    nameType: StopRegistryNameType.Other,
  });

  // In case of StopFormState get some properties from state
  return {
    ...input,
    geometry: mapPointToStopRegistryGeoJSON({
      latitude: state.latitude,
      longitude: state.longitude,
    }),
    description: { lang: 'fin', value: state.locationFin ?? null },
    alternativeNames,
  };
}

function mapStopPointInput(
  state: StopVersionFormState | StopFormState,
  originalStop: StopWithDetails,
): ServicePatternScheduledStopPointInsertInput {
  const validity = getValidity(state);

  const input = {
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

  if (!isStopFormState(state)) {
    return input;
  }

  // In case of StopFormState get some properties from state
  return {
    ...input,
    measured_location: mapPointToGeoJSON({
      latitude: state.latitude,
      longitude: state.longitude,
    }),
    timing_place_id: state.timingPlaceId ?? null,
  };
}

function mapInfoSpotsToInputs(
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
): CopyStopInputs {
  const quayInput = mapQuayAndFormToInput(state, originalStop);
  const stopPointInput = mapStopPointInput(state, originalStop);
  const infoSpotInputs = mapInfoSpotsToInputs(originalStop);
  const originalStopPlaceId = getStopPlaceId(originalStop);

  return { quayInput, stopPointInput, infoSpotInputs, originalStopPlaceId };
}

export function mapStopFormStateToInputs(
  state: StopFormState,
  originalStop: StopWithDetails,
): CopyStopInputs {
  const quayInput = mapQuayAndFormToInput(state, originalStop);
  const stopPointInput = mapStopPointInput(state, originalStop);
  const infoSpotInputs = mapInfoSpotsToInputs(originalStop);
  const originalStopPlaceId = getStopPlaceId(originalStop);

  return { quayInput, stopPointInput, infoSpotInputs, originalStopPlaceId };
}
