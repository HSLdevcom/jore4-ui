import compact from 'lodash/compact';
import { DateTime } from 'luxon';
import {
  QuayDetailsFragment,
  ServicePatternScheduledStopPointUpdates,
  StopRegistryQuayInput,
  StopRegistryStopPlaceInput,
} from '../../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../../types';
import { findKeyValue, patchKeyValues } from '../../../../../utils';
import { omitTypeName } from '../../../utils';
import { CutDirection } from './types';

function determineNeededUpdatesForQuay(
  quay: QuayDetailsFragment,
  cutDirection: CutDirection,
  validityStart: string,
  validityEnd?: string,
) {
  const quayValidityStart = findKeyValue(quay, 'validityStart');
  const quayValidityEnd = findKeyValue(quay, 'validityEnd');

  // Every quay must have a validity start date, so this should not happen
  if (!quayValidityStart) {
    return undefined;
  }

  // New start date is set if
  // - Quay start date is before the new start date AND its end date is after the new start date (or it doesn't have an end date)
  const needsNewStartDate =
    quayValidityStart < validityStart &&
    (quayValidityEnd === null || quayValidityEnd >= validityStart);

  // New end date is set if (only when cutting from end):
  // - Quay doesn't have an end date and stop area has an end date
  // - Quay's end date is after the new stop area end date AND quay validity starts before the new stop area end date
  const needsNewEndDate =
    ((quayValidityEnd === null && validityEnd !== undefined) ||
      (quayValidityEnd !== null &&
        validityEnd !== undefined &&
        quayValidityEnd > validityEnd &&
        quayValidityStart <= validityEnd)) &&
    cutDirection === 'end';

  if (!needsNewStartDate && !needsNewEndDate) {
    return undefined;
  }

  return { needsNewStartDate, needsNewEndDate };
}

function mapQuayToEditInput(
  quays: ReadonlyArray<QuayDetailsFragment | null>,
  cutDirection: CutDirection,
  validityStart: string,
  validityEnd?: string,
): StopRegistryQuayInput[] {
  const mappedQuays = quays.map((quay) => {
    if (!quay) {
      return undefined;
    }

    const quayUpdates = determineNeededUpdatesForQuay(
      quay,
      cutDirection,
      validityStart,
      validityEnd,
    );

    if (!quayUpdates) {
      return undefined;
    }

    const { needsNewStartDate, needsNewEndDate } = quayUpdates;

    const patchedKeyValues = patchKeyValues(
      quay,
      compact([
        needsNewStartDate
          ? {
              key: 'validityStart',
              values: [validityStart],
            }
          : undefined,
        needsNewEndDate && validityEnd
          ? {
              key: 'validityEnd',
              values: [validityEnd],
            }
          : undefined,
      ]),
    );

    return {
      id: quay.id,
      keyValues: patchedKeyValues.map((kv) => omitTypeName(kv)), // Remove __typename as patch won't if no changes are done,
    };
  });

  return compact(mappedQuays);
}

export function mapToEditStopAreaInput(
  stopArea: EnrichedStopPlace,
  cutDirection: CutDirection,
  validityStart: string,
  validityEnd?: string,
  versionName?: string,
): StopRegistryStopPlaceInput | null {
  const originalStartDate = findKeyValue(stopArea, 'validityStart');
  const originalEndDate = findKeyValue(stopArea, 'validityEnd') ?? undefined;

  const startDateCut = !originalStartDate || validityStart > originalStartDate;
  const endDateCut =
    (!!validityEnd && !originalEndDate) ||
    (!!validityEnd && !!originalEndDate && validityEnd < originalEndDate);

  let keyValues = stopArea.keyValues ?? [];

  // Set new dates as the stop area validity days
  if (startDateCut) {
    keyValues = patchKeyValues({ keyValues }, [
      {
        key: 'validityStart',
        values: [validityStart],
      },
    ]);
  }

  if (endDateCut) {
    keyValues = patchKeyValues(
      { keyValues },
      compact([
        validityEnd
          ? {
              key: 'validityEnd',
              values: [validityEnd],
            }
          : undefined,
      ]),
    ).filter((kv) => (kv?.key !== 'validityEnd' ? true : !!validityEnd));
  }

  const mappedQuays = mapQuayToEditInput(
    stopArea.quays ?? [],
    cutDirection,
    validityStart,
    validityEnd,
  );

  // No changes done
  if (keyValues === stopArea.keyValues && mappedQuays.length === 0) {
    return null;
  }

  return {
    id: stopArea.id,
    keyValues: keyValues.map((kv) => omitTypeName(kv)), // Remove __typename as patch won't if no changes are done
    versionComment: versionName,
    quays: mappedQuays.length > 0 ? mappedQuays : undefined,
  };
}

function determineUpdatesForStopPoints(
  quays: ReadonlyArray<QuayDetailsFragment | null>,
  cutDirection: CutDirection,
  validityStart: string,
  validityEnd?: string,
): { startDateIds: UUID[]; endDateIds: UUID[] } {
  if (!quays || quays.length === 0) {
    return { startDateIds: [], endDateIds: [] };
  }

  // Go through all quays and determine which stop points need
  // their dates changed to the new ones
  const mappedQuays = compact(
    quays.map((quay) => {
      if (!quay || !quay?.scheduled_stop_point) {
        return undefined;
      }

      const quayUpdates = determineNeededUpdatesForQuay(
        quay,
        cutDirection,
        validityStart,
        validityEnd,
      );

      if (!quayUpdates) {
        return undefined;
      }

      const { needsNewStartDate, needsNewEndDate } = quayUpdates;

      return {
        stopPointId: quay.scheduled_stop_point.scheduled_stop_point_id,
        changeStartDate: needsNewStartDate,
        changeEndDate: needsNewEndDate,
      };
    }),
  );

  const startDateIds = mappedQuays
    .filter((q) => q.changeStartDate)
    .map((q) => q.stopPointId);
  const endDateIds = mappedQuays
    .filter((q) => q.changeEndDate)
    .map((q) => q.stopPointId);

  return { startDateIds, endDateIds };
}

type ScheduledStopPointUpdates = {
  readonly startDateUpdates: ServicePatternScheduledStopPointUpdates | null;
  readonly endDateUpdates: ServicePatternScheduledStopPointUpdates | null;
};

export function getScheduledStopPointIdsToEdit(
  stopArea: EnrichedStopPlace,
  cutDirection: CutDirection,
  validityStart: string,
  validityEnd?: string,
): ScheduledStopPointUpdates {
  const { startDateIds, endDateIds } = determineUpdatesForStopPoints(
    stopArea.quays ?? [],
    cutDirection,
    validityStart,
    validityEnd,
  );

  const startDateUpdates = {
    where: { scheduled_stop_point_id: { _in: startDateIds } },
    _set: { validity_start: DateTime.fromISO(validityStart) },
  };

  const endDateUpdates = {
    where: { scheduled_stop_point_id: { _in: endDateIds } },
    _set: { validity_end: validityEnd ? DateTime.fromISO(validityEnd) : null },
  };

  return {
    startDateUpdates: startDateIds.length > 0 ? startDateUpdates : null,
    endDateUpdates: endDateIds.length > 0 ? endDateUpdates : null,
  };
}
