import { useState } from 'react';
import { identity, pipe } from 'remeda';
import {
  RouteUniqueFieldsFragment,
  useGetRouteDetailsByIdQuery,
} from '../../../generated/graphql';
import { stopBelongsToJourneyPattern } from '../../../graphql';
import {
  getEligibleStopsAlongRoute,
  useObservationDateQueryParam,
} from '../../../hooks';
import { Priority } from '../../../types/enums';
import { filterHighestPriorityCurrentStops } from '../../../utils';
import { ExpandableRouteRow } from './ExpandableRouteRow';
import { RouteRowLoader } from './RouteRowLoader';
import { RouteStopsRow } from './RouteStopsRow';

interface Props {
  className?: string;
  routeUniqueFields: RouteUniqueFieldsFragment;
  showUnusedStops: boolean;
}

export const RouteStopsSection = ({
  className = '',
  routeUniqueFields,
  showUnusedStops,
}: Props): JSX.Element => {
  const [isExpanded, expand] = useState(false);

  const onToggle = () => {
    expand(!isExpanded);
  };

  const { observationDate } = useObservationDateQueryParam();

  const routeResult = useGetRouteDetailsByIdQuery({
    variables: { routeId: routeUniqueFields.route_id },
  });
  const route = routeResult.data?.route_route_by_pk;

  if (!route) {
    // Display a loader until all details have been loaded.
    // Note: we would actually have some information about the route that we could display already,
    // but made a design decision not to show anything until whole row can be shown.
    return (
      <tbody>
        <RouteRowLoader className="[&>td]:h-[75px]" />
      </tbody>
    );
  }

  /**
   * Stops to display. Show the highest priority version of stops' valid instances.
   * If "show unused stops" is selected, also show stops that are not in the journey pattern
   * but are along route geometry.
   */
  const displayedStops = pipe(
    route,
    getEligibleStopsAlongRoute,
    (stops) =>
      filterHighestPriorityCurrentStops(
        stops,
        observationDate,
        route.priority === Priority.Draft,
      ),
    showUnusedStops
      ? identity // Return stops array unchanged
      : (stops) =>
          stops.filter((stop) =>
            stopBelongsToJourneyPattern(stop, route.route_id),
          ),
  );

  return (
    <tbody className={className}>
      <ExpandableRouteRow
        className="[&>td]:h-[75px]"
        key={route.route_id}
        route={route}
        observationDate={observationDate}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      {isExpanded &&
        displayedStops.map((item, index) => (
          <RouteStopsRow
            // This list is recreated every time when changes happen, so we can
            // use index as key here
            // eslint-disable-next-line react/no-array-index-key
            key={`${item.label}_${index}`}
            stop={item}
            route={route}
          />
        ))}
    </tbody>
  );
};
