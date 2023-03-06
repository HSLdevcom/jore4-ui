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
  jpBase: JourneyPatternRefBuildInput,
): JourneyPatternRefInsertInput => ({
  journey_pattern_ref_id: uuid(),
  observation_timestamp: DateTime.fromISO('2023-01-01'),
  snapshot_timestamp: DateTime.fromISO('2022-12-01'),
  ...jpBase,
});

export const buildJourneyPatternRefWithStops = (
  jpBase: JourneyPatternRefBuildInput,
  stops: StopInJourneyPatternRefInsertInput[],
): JourneyPatternRefInsertInputDeep => {
  const jpRef = buildJourneyPatternRef(jpBase);

  return {
    ...jpRef,
    scheduled_stop_point_in_journey_pattern_refs: { data: stops },
  };
};

export const buildJourneyPatternRefWithStopLabels = (
  jpBase: JourneyPatternRefBuildInput,
  stopLabels: string[],
): JourneyPatternRefInsertInputDeep => {
  const stops = buildStopSequence(
    { journey_pattern_ref_id: jpBase.journey_pattern_ref_id },
    stopLabels,
  );
  return buildJourneyPatternRefWithStops(jpBase, stops);
};
