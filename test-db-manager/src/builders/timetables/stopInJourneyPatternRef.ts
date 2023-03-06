import { v4 as uuid } from 'uuid';
import { StopInJourneyPatternRefInsertInput } from '../../types';

export type StopInJourneyPatternRefBuildInput = RequiredKeysOnly<
  StopInJourneyPatternRefInsertInput,
  | 'journey_pattern_ref_id'
  | 'scheduled_stop_point_label'
  | 'scheduled_stop_point_sequence'
>;

/**
 * Builds a stop in a journey pattern
 */
export const buildStopInJourneyPatternRef = (
  stopInJpBase: StopInJourneyPatternRefBuildInput,
): StopInJourneyPatternRefInsertInput => ({
  scheduled_stop_point_in_journey_pattern_ref_id: uuid(),
  ...stopInJpBase,
});

/**
 * Builds a sequence of stops in journey pattern based on a list of stop labels
 * @param stopInJpBase common attributes for all stops within the journey pattern
 * @param labels labels of the journey pattern stops to be used
 * @returns list of stops in journey pattern
 */
export const buildStopSequence = (
  stopInJpBase: RequiredKeysOnly<
    StopInJourneyPatternRefBuildInput,
    'journey_pattern_ref_id'
  >,
  labels: Array<
    StopInJourneyPatternRefBuildInput['scheduled_stop_point_label']
  >,
): StopInJourneyPatternRefInsertInput[] =>
  labels.map((label, index) =>
    buildStopInJourneyPatternRef({
      ...stopInJpBase,
      scheduled_stop_point_label: label,
      scheduled_stop_point_sequence: index + 1,
    }),
  );
