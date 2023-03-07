import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { TimetablesResources } from '../../db-helpers';
import {
  JourneyPatternRefInsertInput,
  JourneyPatternRefInsertInputDeep,
} from '../../types';
import {
  buildStopInJourneyPatternSequence,
  StopInJourneyPatternSequenceBuilder,
} from './stopInJourneyPatternRef';

export type JourneyPatternRefInstanceBuilder =
  Partial<JourneyPatternRefInsertInput>;
export const buildJourneyPatternRefInstance = (
  journeyPatternId: UUID,
  jpBase: JourneyPatternRefInstanceBuilder,
): JourneyPatternRefInsertInput => ({
  journey_pattern_ref_id: uuid(),
  observation_timestamp: DateTime.fromISO('2023-01-01'),
  snapshot_timestamp: DateTime.fromISO('2022-12-01'),
  ...jpBase,
  journey_pattern_id: journeyPatternId,
});

export type JourneyPatternDeepBuilder = StopInJourneyPatternSequenceBuilder & {
  jpBase: JourneyPatternRefInstanceBuilder;
};
export const buildJourneyPatternRefDeep = (
  journeyPatternId: UUID,
  { jpBase, stopBase, stopLabels }: JourneyPatternDeepBuilder,
): JourneyPatternRefInsertInputDeep => {
  const jpRef = buildJourneyPatternRefInstance(journeyPatternId, jpBase);

  const stops = buildStopInJourneyPatternSequence(
    jpRef.journey_pattern_ref_id,
    { stopBase, stopLabels },
  );

  return {
    ...jpRef,
    scheduled_stop_point_in_journey_pattern_refs: { data: stops },
  };
};

export const flattenJourneyPatternRef = (
  jp: JourneyPatternRefInsertInputDeep,
): TimetablesResources => ({
  journeyPatternRefs: [jp],
  stopsInJourneyPatternRefs:
    jp.scheduled_stop_point_in_journey_pattern_refs.data,
});
