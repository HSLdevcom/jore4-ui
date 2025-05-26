import { FC, useState } from 'react';
import { pipe } from 'remeda';
import { useGetRouteDetailsByIdQuery } from '../../../generated/graphql';
import { stopBelongsToJourneyPattern } from '../../../graphql';
import {
  getEligibleStopsAlongRoute,
  useObservationDateQueryParam,
} from '../../../hooks';
import { Priority } from '../../../types/enums';
import { filterHighestPriorityCurrentStops } from '../../../utils';
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
      ? (stops) => stops // Return stops array unchanged
      : (stops) =>
          stops.filter((stop) =>
            stopBelongsToJourneyPattern(stop, route.route_id),
          ),
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
          {displayedStops.map((item, index) => (
            <RouteStopListItem
              // This list is recreated every time when changes happen, so we can
              // use index as key here
              // eslint-disable-next-line react/no-array-index-key
              key={`${item.label}_${index}`}
              stop={item}
              route={route}
              labelledBy={directionAndLabelElementId}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
