import { OverlappingStopVersionsDataFragment } from '../../../../../../generated/graphql';
import { parseDate } from '../../../../../../time';
import { UnableToCutOverlappingStopVersion } from '../Errors/UnableToCutOverlappingStopVersion';
import { StopVersionFormState } from '../Types';
import { OverlappingCutDatesResult } from '../Types/OverLappingCutDatesResult';

export function getOverlapCutDates(
  state: StopVersionFormState,
  version: Readonly<OverlappingStopVersionsDataFragment>,
): OverlappingCutDatesResult {
  const versionStart = version.validity_start as Temporal.PlainDate;
  const versionEnd = version.validity_end ?? null;

  const stateStart = parseDate(state.validityStart);
  const stateEnd =
    state.indefinite || !state.validityEnd
      ? null
      : parseDate(state.validityEnd);

  const currentVersion = {
    start: versionStart,
    end: versionEnd ?? undefined,
    indefinite: !versionEnd,
  };

  // End date has been defined
  if (stateEnd) {
    if (
      Temporal.PlainDate.compare(versionStart, stateStart) < 0 &&
      (!versionEnd || Temporal.PlainDate.compare(versionEnd, stateStart) >= 0)
    ) {
      // Version start is before state start and end is after state start or is indefinite
      return {
        currentVersion,
        newVersion: {
          start: versionStart,
          end: stateStart.subtract({ days: 1 }),
          indefinite: false,
          cutToEnd: true,
        },
      };
    }

    if (
      Temporal.PlainDate.compare(versionStart, stateStart) >= 0 &&
      Temporal.PlainDate.compare(versionStart, stateEnd) <= 0
    ) {
      // Version start is between state start and state end
      if (
        !versionEnd ||
        Temporal.PlainDate.compare(versionEnd, stateEnd) >= 0
      ) {
        // Version end is after state end or is indefinity
        return {
          currentVersion,
          newVersion: {
            start: stateEnd.add({ days: 1 }),
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
    Temporal.PlainDate.compare(versionStart, stateStart) < 0 &&
    (!versionEnd || Temporal.PlainDate.compare(versionEnd, stateStart) >= 0)
  ) {
    // Version start is before state start and end is after state start or is indefinite
    return {
      currentVersion,
      newVersion: {
        start: versionStart,
        end: stateStart.subtract({ days: 1 }),
        indefinite: false,
        cutToEnd: true,
      },
    };
  } else if (Temporal.PlainDate.compare(versionStart, stateStart) >= 0) {
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
}
