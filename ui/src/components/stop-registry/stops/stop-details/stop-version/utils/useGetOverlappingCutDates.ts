import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { OverlappingStopVersionsDataFragment } from '../../../../../../generated/graphql';
import { UnableToCutOverlappingStopVersion } from '../errors/UnableToCutOverlappingStopVersion';
import { StopVersionFormState } from '../types';
import { OverlappingCutDatesResult } from '../types/OverLappingCutDatesResult';

export function useGetOverlappingCutDates() {
  const getOverlapCutDates = (
    state: StopVersionFormState,
    version: Readonly<OverlappingStopVersionsDataFragment>,
  ): OverlappingCutDatesResult => {
    const versionStart = version.validity_start as DateTime;
    const versionEnd = version.validity_end ?? null;

    const stateStart = DateTime.fromISO(state.validityStart);
    const stateEnd =
      state.indefinite || !state.validityEnd
        ? null
        : DateTime.fromISO(state.validityEnd);

    const currentVersion = {
      start: versionStart,
      end: versionEnd ?? undefined,
      indefinite: !versionEnd,
    };

    // End date has been defined
    if (stateEnd) {
      if (
        versionStart < stateStart &&
        (!versionEnd || versionEnd >= stateStart)
      ) {
        // Version start is before state start and end is after state start or is indefinite
        return {
          currentVersion,
          newVersion: {
            start: versionStart,
            end: stateStart.minus({ days: 1 }),
            indefinite: false,
            cutToEnd: true,
          },
        };
      }

      if (versionStart >= stateStart && versionStart <= stateEnd) {
        // Version start is between state start and state end
        if (!versionEnd || versionEnd >= stateEnd) {
          // Version end is after state end or is indefinity
          return {
            currentVersion,
            newVersion: {
              start: stateEnd.plus({ days: 1 }),
              end: versionEnd ?? undefined,
              indefinite: !versionEnd,
              cutToEnd: false,
            },
          };
        }

        // Version end is before state end => Whole version is inside the new version
        throw new UnableToCutOverlappingStopVersion(
          'Can not cut a version that is completely inside the new version!',
        );
      }
    } else if (
      versionStart < stateStart &&
      (!versionEnd || versionEnd >= stateStart)
    ) {
      // Version start is before state start and end is after state start or is indefinite
      return {
        currentVersion,
        newVersion: {
          start: versionStart,
          end: stateStart.minus({ days: 1 }),
          indefinite: false,
          cutToEnd: true,
        },
      };
    } else if (versionStart >= stateStart) {
      // Version start is equal or later than state start and state doesn't end => Can't cut version
      throw new UnableToCutOverlappingStopVersion(
        'Can not cut a version that starts after an indefinite version!',
      );
    }

    // No cutting required
    return {
      currentVersion,
      newVersion: undefined,
    };
  };

  return useCallback(getOverlapCutDates, []);
}
