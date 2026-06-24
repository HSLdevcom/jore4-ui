import { DateTime } from 'luxon';
import { StopPlaceState } from '../../../../types/stop-registry';

/**
 * Returns the effective stop state at the given observation date.
 * If the stored stop state has a validity period and the observation date
 * falls outside it, the stop is considered InOperation.
 */
export function getEffectiveStopState(
  stopState: StopPlaceState | null | undefined,
  validityStart: string | null | undefined,
  validityEnd: string | null | undefined,
  observationDate: DateTime,
): StopPlaceState {
  if (!stopState || stopState === StopPlaceState.InOperation) {
    return StopPlaceState.InOperation;
  }

  const obsDate = observationDate.startOf('day');

  if (
    validityStart &&
    obsDate < DateTime.fromISO(validityStart).startOf('day')
  ) {
    return StopPlaceState.InOperation;
  }

  if (validityEnd && obsDate > DateTime.fromISO(validityEnd).startOf('day')) {
    return StopPlaceState.InOperation;
  }

  return stopState;
}
