import { FC, useState } from 'react';
import { useGetRouteDetailsByIdQuery } from '../../../generated/graphql';
import { stopBelongsToJourneyPattern } from '../../../graphql';
import { useObservationDateQueryParam } from '../../../hooks';
import { Priority } from '../../../types/enums';
import { filterHighestPriorityCurrentStops } from '../../../utils';
import { getEligibleStopsAlongRoute } from '../edit-route/useEditRouteJourneyPattern';
import { RouteRow } from './RouteRow';
import { RouteRowLoader } from './RouteRowLoader';
import { RouteStopListItem } from './RouteStopListItem';

type LineRouteListItemProps = {
  readonly routeId: UUID;
  readonly showUnusedStops: boolean;
  readonly isLast: boolean;
};

const testIds = {
  lineRouteListItem: 'LineRouteListItem',
};
export const LineRouteListItem: FC<LineRouteListItemProps> = ({
  routeId,
  showUnusedStops,
  isLast,
}) => {
  const [isExpanded, expand] = useState(false);

  const onToggle = () => {
    expand(!isExpanded);
  };

  const { observationDate } = useObservationDateQueryParam();

  const routeResult = useGetRouteDetailsByIdQuery({
    variables: { routeId },
  });
  const route = routeResult.data?.route_route_by_pk;

  if (!route) {
    // Display a loader until all details have been loaded.
    // Note: we would actually have some information about the route that we could display already,
    // but made a design decision not to show anything until whole row can be shown.
    return (
      <li>
        <RouteRowLoader />
      </li>
    );
  }

  /**
   * Stops to display. Show the highest priority version of stops' valid instances.
   * If "show unused stops" is selected, also show stops that are not in the journey pattern
   * but are along route geometry.
   */
  const stopsAlongRoute = getEligibleStopsAlongRoute(route);
  const highestPriorityCurrentStops = filterHighestPriorityCurrentStops(
    stopsAlongRoute,
    observationDate,
    route.priority === Priority.Draft,
  );
  const displayedStops = showUnusedStops
    ? highestPriorityCurrentStops // Return stops array unchanged
    : highestPriorityCurrentStops.filter((stop) =>
        stopBelongsToJourneyPattern(stop, route.route_id),
      );

  const directionAndLabelElementId = `direction-and-label-${route.label}-${route.variant}-${route.direction}`;
  const routeStopListElementId = 'route-stop-list';

  return (
    <li data-testid={testIds.lineRouteListItem}>
      <RouteRow
        directionAndLabelId={directionAndLabelElementId}
        key={routeId}
        route={route}
        observationDate={observationDate}
        isExpanded={isExpanded}
        onToggle={onToggle}
        isLast={isLast}
        controls={routeStopListElementId}
      />
      {isExpanded && (
        <ul id={routeStopListElementId}>
          {displayedStops.map((item) => (
            <RouteStopListItem
              key={item.scheduled_stop_point_id}
              stop={item}
              route={route}
              labelledBy={directionAndLabelElementId}
              observationDate={observationDate}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
