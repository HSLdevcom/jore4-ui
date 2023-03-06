import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  JourneyPatternRefInsertInput,
  JourneyPatternRefInsertInputDeep,
  StopInJourneyPatternRefInsertInput,
} from '../../types';
import { buildStopSequence } from './stopInJourneyPatternRef';

export type JourneyPatternRefBuildInput = RequiredKeys<
  Partial<JourneyPatternRefInsertInput>,
  'journey_pattern_id'
>;
export const buildJourneyPatternRef = (
  jp: JourneyPatternRefBuildInput,
): JourneyPatternRefInsertInput => ({
  journey_pattern_ref_id: uuid(),
  observation_timestamp: DateTime.fromISO('2023-01-01'),
  snapshot_timestamp: DateTime.fromISO('2022-12-01'),
  ...jp,
});

export const buildJourneyPatternRefWithStops = (
  jp: JourneyPatternRefBuildInput,
  stops: StopInJourneyPatternRefInsertInput[],
): JourneyPatternRefInsertInputDeep => {
  const jpRef = buildJourneyPatternRef(jp);

  return {
    ...jpRef,
    scheduled_stop_point_in_journey_pattern_refs: { data: stops },
  };
};

export const buildJourneyPatternRefWithStopLabels = (
  jp: JourneyPatternRefBuildInput,
  stopLabels: string[],
): JourneyPatternRefInsertInputDeep => {
  const stops = buildStopSequence({
    stopInJp: { journey_pattern_ref_id: jp.journey_pattern_ref_id },
    labels: stopLabels,
  });
  return buildJourneyPatternRefWithStops(jp, stops);
};
