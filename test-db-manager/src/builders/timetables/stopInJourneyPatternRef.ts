import {
  PartialKeys,
  RequiredKeysOnly,
  StopInJourneyPatternRefInsertInput,
} from '../../types';

export type StopInJourneyPatternInstanceBuilder = RequiredKeysOnly<
  StopInJourneyPatternRefInsertInput,
  'scheduled_stop_point_label' | 'scheduled_stop_point_sequence'
>;
export const buildStopInJourneyPatternRefInstance = (
  journeyPatternRefId: UUID,
  stopBase: StopInJourneyPatternInstanceBuilder,
): StopInJourneyPatternRefInsertInput => ({
  scheduled_stop_point_in_journey_pattern_ref_id: crypto.randomUUID(),
  ...stopBase,
  journey_pattern_ref_id: journeyPatternRefId,
});

export type StopInJourneyPatternSequenceBuilder = {
  stopBase: PartialKeys<
    StopInJourneyPatternInstanceBuilder,
    'scheduled_stop_point_sequence' | 'scheduled_stop_point_label'
  >;
  stopLabels: string[];
};
export const buildStopInJourneyPatternSequence = (
  journeyPatternRefId: UUID,
  { stopBase, stopLabels }: StopInJourneyPatternSequenceBuilder,
): StopInJourneyPatternRefInsertInput[] =>
  stopLabels.map((label, index) =>
    buildStopInJourneyPatternRefInstance(journeyPatternRefId, {
      ...stopBase,
      scheduled_stop_point_label: label,
      scheduled_stop_point_sequence: index + 1,
    }),
  );
