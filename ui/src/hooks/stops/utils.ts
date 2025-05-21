import uniqBy from 'lodash/uniqBy';
import { JourneyPatternJourneyPattern } from '../../generated/graphql';

// gets the unique list of parent routes for the input journey patterns
export const getRoutesOfJourneyPatterns = (
  journeyPatterns: ReadonlyArray<JourneyPatternJourneyPattern>,
) => {
  const allRoutes = journeyPatterns
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((item) => item.journey_pattern_route!);

  // in the future, multiple journey patterns may have the same route,
  // so let's make sure we only return unique results
  return uniqBy(allRoutes, (route) => route.route_id);
};
