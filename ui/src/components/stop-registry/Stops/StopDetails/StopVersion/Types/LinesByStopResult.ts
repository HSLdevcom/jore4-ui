import { JourneyPatternRouteFragment } from '../../../../../../generated/graphql';

export type LinesByStop = Omit<
  JourneyPatternRouteFragment,
  '__typename' | 'validity_start' | 'validity_end'
>;
