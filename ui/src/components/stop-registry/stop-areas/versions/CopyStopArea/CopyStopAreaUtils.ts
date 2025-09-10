import compact from 'lodash/compact';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { DateTime } from 'luxon';
import {
  InputMaybe,
  ScheduledStopPointDetailFieldsFragment,
  ServicePatternScheduledStopPointInsertInput,
  StopRegistryQuayInput,
} from '../../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../../types';
import {
  ElementWithKeyValues,
  findKeyValue,
  patchKeyValues,
} from '../../../../../utils';
import { mapStopPlaceToInput } from '../../stop-area-details/mapStopPlaceToInput';
import { CopyStopAreaInputs, StopRegistryStopAreaCopyInput } from './types';

export function isObjectValidDuringPeriod(
  object: ElementWithKeyValues | null | undefined,
  validityStart: string,
  validityEnd?: string,
): boolean {
  if (!object) {
    return false;
  }

  const objectValidityStart = findKeyValue(object, 'validityStart');
  const objectValidityEnd = findKeyValue(object, 'validityEnd');

  // Should not be possible to have object without validity start
  if (!objectValidityStart) {
    return false;
  }

  const objectIsIndefiniteOrIsValidAfterStart: boolean =
    !objectValidityEnd || objectValidityEnd >= validityStart;

  if (validityEnd) {
    return (
      objectValidityStart <= validityEnd &&
      objectIsIndefiniteOrIsValidAfterStart
    );
  }

  return (
    objectValidityStart <= validityStart &&
    objectIsIndefiniteOrIsValidAfterStart
  );
}

function setInputQuayValidityDates(
  quay: InputMaybe<StopRegistryQuayInput>,
  validityStart: string,
  validityEnd?: string,
): InputMaybe<StopRegistryQuayInput> {
  if (!quay) {
    return null;
  }

  const quayValidityStart = findKeyValue(quay, 'validityStart');
  const quayValidityEnd = findKeyValue(quay, 'validityEnd');
  const quayIsIndefinite = !quayValidityEnd;

  // Determine if we need to update validityStart
  const shouldUpdateValidityStart =
    quayValidityStart && quayValidityStart < validityStart;

  // Determine new validityEnd for quay
  let newValidityEnd: string | undefined;
  if (!validityEnd) {
    // If state validity end is not set, retain original quay end date (do nothing)
    newValidityEnd = quayValidityEnd ?? undefined;
  } else if (
    quayIsIndefinite ||
    (quayValidityEnd && quayValidityEnd > validityEnd)
  ) {
    // If quay is indefinite or its end is after the new end, set to new end
    newValidityEnd = validityEnd;
  } else {
    // If quay end is before or equal to new end, keep original
    newValidityEnd = quayValidityEnd;
  }

  return {
    ...quay,
    keyValues: patchKeyValues(
      quay,
      compact([
        shouldUpdateValidityStart
          ? {
              key: 'validityStart',
              values: [validityStart],
            }
          : undefined,
        newValidityEnd
          ? {
              key: 'validityEnd',
              values: [newValidityEnd],
            }
          : undefined,
      ]),
    ).filter((kv) => (kv?.key !== 'validityEnd' ? true : !!newValidityEnd)),
  };
}

export function mapToStopAreaCopyInput({
  stopArea,
  state,
}: CopyStopAreaInputs): StopRegistryStopAreaCopyInput {
  const input = mapStopPlaceToInput(stopArea);

  // Set new validity dates to the keyvalues
  const keyValues = patchKeyValues(
    stopArea,
    compact([
      {
        key: 'validityStart',
        values: [state.validityStart],
      },
      state.validityEnd
        ? {
            key: 'validityEnd',
            values: [state.validityEnd],
          }
        : undefined,
    ]),
  ).filter((kv) => (kv?.key !== 'validityEnd' ? true : !state.indefinite));

  const filteredQuays = input.quays
    ?.filter((quay) =>
      isObjectValidDuringPeriod(quay, state.validityStart, state.validityEnd),
    )
    .map((quay) =>
      setInputQuayValidityDates(quay, state.validityStart, state.validityEnd),
    );

  return {
    ...omit(input, 'id'),
    keyValues,
    versionComment: state.versionName,
    quays: filteredQuays,
  };
}

function mapStopPointInput(
  scheduledStopPoint: ScheduledStopPointDetailFieldsFragment,
  quayId: string,
  validityStart: string,
  validityEnd: string | null,
): ServicePatternScheduledStopPointInsertInput {
  const start = DateTime.fromISO(validityStart);
  const end = validityEnd ? DateTime.fromISO(validityEnd) : undefined;

  return {
    ...pick(scheduledStopPoint, [
      'direction',
      'label',
      'located_on_infrastructure_link_id',
      'measured_location',
      'timing_place_id',
      'priority',
    ]),
    stop_place_ref: quayId,
    validity_start: start,
    validity_end: end,
    vehicle_mode_on_scheduled_stop_point: {
      data: [
        {
          vehicle_mode:
            scheduledStopPoint.vehicle_mode_on_scheduled_stop_point[0]
              .vehicle_mode,
        },
      ],
    },
  };
}

// This should be improved
export function filterAndMapScheduledStopPoints({
  stopArea,
  state,
  mutationResult,
}: CopyStopAreaInputs & {
  mutationResult: EnrichedStopPlace;
}): ReadonlyArray<ServicePatternScheduledStopPointInsertInput> {
  const filteredQuays = (mutationResult.quays ?? []).filter((quay) =>
    isObjectValidDuringPeriod(quay, state.validityStart, state.validityEnd),
  );

  const results = filteredQuays.map((quay) => {
    if (!quay?.id) {
      return undefined;
    }

    // TODO: Rework this logic later
    const oldQuay = (stopArea.quays ?? []).find(
      (q) => q?.publicCode === quay.publicCode,
    );
    if (!oldQuay?.id || !oldQuay.scheduled_stop_point) {
      return undefined;
    }

    const validityStart = findKeyValue(quay, 'validityStart');
    const validityEnd = findKeyValue(quay, 'validityEnd');
    if (!validityStart) {
      return undefined;
    }

    return mapStopPointInput(
      oldQuay.scheduled_stop_point, // This needs to come from the existing quay that we are copying
      quay.id,
      validityStart,
      validityEnd,
    );
  });

  return compact(results);
}
