import { DateTime } from 'luxon';
import {
  JourneyPatternRefInsertInput,
  JourneyPatternRefInsertInputDeep,
} from '../../types';
import { expectValue } from '../../utils';
import {
  StopInJourneyPatternSequenceBuilder,
  buildStopInJourneyPatternSequence,
} from './stopInJourneyPatternRef';

export type JourneyPatternRefInstanceBuilder =
  Partial<JourneyPatternRefInsertInput>;
export const buildJourneyPatternRefInstance = (
  journeyPatternId: UUID,
  journeyPatternRefBase: JourneyPatternRefInstanceBuilder,
): JourneyPatternRefInsertInput => ({
  journey_pattern_ref_id: crypto.randomUUID(),
  observation_timestamp: DateTime.fromISO('2023-01-01'),
  snapshot_timestamp: DateTime.fromISO('2022-12-01'),
  ...journeyPatternRefBase,
  journey_pattern_id: journeyPatternId,
});

export type JourneyPatternDeepBuilder = StopInJourneyPatternSequenceBuilder & {
  journeyPatternRefBase: JourneyPatternRefInstanceBuilder;
};
export const buildJourneyPatternRefDeep = (
  journeyPatternId: UUID,
  { journeyPatternRefBase, stopBase, stopLabels }: JourneyPatternDeepBuilder,
): JourneyPatternRefInsertInputDeep => {
  const journeyPatternRef = buildJourneyPatternRefInstance(
    journeyPatternId,
    journeyPatternRefBase,
  );

  const stops = buildStopInJourneyPatternSequence(
    expectValue(journeyPatternRef.journey_pattern_ref_id),
    { stopBase, stopLabels },
  );

  return {
    ...journeyPatternRef,
    scheduled_stop_point_in_journey_pattern_refs: { data: stops },
  };
};
