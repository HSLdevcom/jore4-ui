import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { OverlappingStopVersionsDataFragment } from '../../../../../../generated/graphql';
import { FailedToCutOverlappingStopVersion } from '../errors/FailedToCutOverlappingStopVersion';
import { UnableToCutOverlappingStopVersion } from '../errors/UnableToCutOverlappingStopVersion';
import { StopVersionFormState } from '../types';
import { useEditStopValidity } from './useEditStopValidity';

export function useCutOverlappingStopVersion() {
  const editStopValidity = useEditStopValidity();

  const cutOverlappingStopVersion = async (
    state: StopVersionFormState,
    version: Readonly<OverlappingStopVersionsDataFragment>,
  ) => {
    const versionStart = version.validity_start as DateTime;
    const versionEnd = version.validity_end ?? null;

    const stateStart = DateTime.fromISO(state.validityStart);
    const stateEnd =
      state.indefinite || !state.validityEnd
        ? null
        : DateTime.fromISO(state.validityEnd);

    // End date has been defined
    if (stateEnd) {
      if (
        versionStart < stateStart &&
        (!versionEnd || versionEnd >= stateStart)
      ) {
        // Version start is before state start and end is after state start or is indefinite
        try {
          await editStopValidity(
            version.stop_place_ref,
            version.priority,
            state.versionName,
            versionStart.toISODate(),
            stateStart.minus({ days: 1 }).toISODate(),
            false,
          );
        } catch {
          throw new FailedToCutOverlappingStopVersion(
            `Failed to cut overlapping stop version ${version.stop_place_ref}`,
          );
        }
      } else if (versionStart >= stateStart && versionStart < stateEnd) {
        // Version start is between state start and state end
        if (!versionEnd || versionEnd > stateEnd) {
          // Version end is after state end or is indefinite
          try {
            await editStopValidity(
              version.stop_place_ref,
              version.priority,
              state.versionName,
              stateEnd.plus({ days: 1 }).toISODate(),
              versionEnd?.toISODate(),
              !versionEnd,
            );
          } catch {
            throw new FailedToCutOverlappingStopVersion(
              `Failed to cut overlapping stop version ${version.stop_place_ref}`,
            );
          }
        } else {
          // Version end is before state end => Whole version is inside the new version
          throw new UnableToCutOverlappingStopVersion(
            'Can not cut a version that is completely inside the new version!',
          );
        }
      }
    } else if (
      versionStart < stateStart &&
      (!versionEnd || versionEnd >= stateStart)
    ) {
      // Version start is before state start and end is after state start or is indefinite
      try {
        await editStopValidity(
          version.stop_place_ref,
          version.priority,
          state.versionName,
          versionStart.toISODate(),
          stateStart.minus({ days: 1 }).toISODate(),
          false,
        );
      } catch {
        throw new FailedToCutOverlappingStopVersion(
          `Failed to cut overlapping stop version ${version.stop_place_ref}`,
        );
      }
    } else if (versionStart >= stateStart) {
      // Version start is equal or later than state start and state doesn't end => Can't cut version
      throw new UnableToCutOverlappingStopVersion(
        'Can not cut a version that starts after an indefinite version!',
      );
    }
  };

  return useCallback(cutOverlappingStopVersion, [editStopValidity]);
}
