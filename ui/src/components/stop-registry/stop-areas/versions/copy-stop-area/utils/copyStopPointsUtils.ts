import compact from 'lodash/compact';
import pick from 'lodash/pick';
import {
  QuayDetailsFragment,
  ScheduledStopPointDetailFieldsFragment,
  ServicePatternScheduledStopPointInsertInput,
} from '../../../../../../generated/graphql';
import { parseDate } from '../../../../../../time';
import { EnrichedStopPlace } from '../../../../../../types';
import { findKeyValue } from '../../../../../../utils';
import { BidirectionalQuayMap } from '../types';

function mapStopPointInput(
  scheduledStopPoint: ScheduledStopPointDetailFieldsFragment,
  quayId: string,
  validityStart: string,
  validityEnd: string | null,
): ServicePatternScheduledStopPointInsertInput {
  const start = parseDate(validityStart);
  const end = parseDate(validityEnd);

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

function mapQuayToStopPoint(
  oldQuay: QuayDetailsFragment | null | undefined,
  mapping: BidirectionalQuayMap,
): ServicePatternScheduledStopPointInsertInput | null {
  if (!oldQuay?.id || !oldQuay.scheduled_stop_point || !oldQuay.publicCode) {
    // Should not happen
    return null;
  }

  const newQuay = mapping.copiedQuays.get(oldQuay.id);
  if (!newQuay || !newQuay.id) {
    return null;
  }

  const validityStart = findKeyValue(newQuay, 'validityStart');
  const validityEnd = findKeyValue(newQuay, 'validityEnd');
  if (!validityStart) {
    return null;
  }

  return mapStopPointInput(
    oldQuay.scheduled_stop_point, // This needs to come from the existing quay that we are copying
    newQuay.id,
    validityStart,
    validityEnd,
  );
}

export function filterAndMapScheduledStopPoints(
  stopArea: EnrichedStopPlace,
  mutatedStopPoints: ReadonlyArray<UUID>,
  mapping: BidirectionalQuayMap,
): ReadonlyArray<ServicePatternScheduledStopPointInsertInput> {
  // Take only the quays that had stop points edited previously
  const quaysWithEditedStopPoints = compact(stopArea.quays).filter((quay) => {
    if (!quay.scheduled_stop_point) {
      return false;
    }

    return mutatedStopPoints.includes(
      quay.scheduled_stop_point.scheduled_stop_point_id,
    );
  });

  const combinedInputs = quaysWithEditedStopPoints.map((oldQuay) =>
    mapQuayToStopPoint(oldQuay, mapping),
  );

  return compact(combinedInputs);
}
