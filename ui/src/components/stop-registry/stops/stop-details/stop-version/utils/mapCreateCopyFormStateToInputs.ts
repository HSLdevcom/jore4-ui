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
import { StopVersionFormState } from '../types';
import { mapOriginalToInput } from './mapOriginalToInput';

type CreateCopyInputs = {
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

export function mapCreateCopyFormStateToInputs(
  state: StopVersionFormState,
  originalStop: StopWithDetails,
): CreateCopyInputs {
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
