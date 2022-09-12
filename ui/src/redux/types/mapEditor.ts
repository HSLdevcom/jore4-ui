import {
  ScheduledStopPointAllFieldsFragment,
  ScheduledStopPointInJourneyPatternAllFieldsFragment,
} from '../../generated/graphql';
import { RouteInfraLink } from '../../graphql';
import { StoreType } from '../mappers/storeType';

export interface RouteGeometry {
  routeStops: RouteStop[];
  infraLinksAlongRoute: RouteInfraLink[];
}

/**
 * An interface containing a stop along route's geometry.
 * We need a type like this, because for example in route creation
 * we want to have a list of all the stops that are along the route geometry
 * with also the info if they are selected to the journey pattern or not.
 */
export interface RouteStop {
  /**
   * Is this route selected to the route's journey pattern
   */
  belongsToJourneyPattern: boolean;
  /**
   * Metadata (e.g. via point informaiton) of the stop in journey pattern
   */
  stopInJourneyPattern?: ScheduledStopPointInJourneyPatternAllFieldsFragment;
  /**
   * Current stop instance attached to the route (journey pattern)
   */
  stop: StoreType<ScheduledStopPointAllFieldsFragment>;
}
