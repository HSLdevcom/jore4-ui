import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteRoute } from '../../../generated/graphql';
import {
  getEligibleStopsAlongRouteGeometry,
  stopBelongsToJourneyPattern,
} from '../../../graphql';
import {
  filterHighestPriorityCurrentStops,
  useEditRouteJourneyPattern,
} from '../../../hooks';
import { Priority } from '../../../types/Priority';
import { showDangerToast, showSuccessToast } from '../../../utils';
import { RouteStopsHeaderRow } from './RouteStopsHeaderRow';
import { RouteStopsRow } from './RouteStopsRow';

interface Props {
  className?: string;
  route: RouteRoute;
  observationDate: DateTime;
  showUnusedStops: boolean;
}

export const RouteStopsSection = ({
  className = '',
  route,
  observationDate,
  showUnusedStops,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const { t } = useTranslation();

  const {
    prepareAddStopToRoute,
    prepareDeleteStopFromRoute,
    mapEditJourneyPatternChangesToVariables,
    updateRouteGeometryMutation,
  } = useEditRouteJourneyPattern();

  const onToggle = () => {
    setOpen(!isOpen);
  };

  const stopsAlongRoute = getEligibleStopsAlongRouteGeometry(route);

  // Fetch the stop with highest priority that is valid on observation date.
  // If route is draft, allow adding draft stops to it.
  const highestPriorityStopInstances = filterHighestPriorityCurrentStops(
    stopsAlongRoute,
    observationDate || DateTime.now(),
    route.priority === Priority.Draft,
  );

  const displayedStops = stopsAlongRoute.filter((item) => {
    const belongsToJourneyPattern = stopBelongsToJourneyPattern(
      item,
      route.route_id,
    );

    // Only display one stop instance for each stop label.
    const isHighestPriorityInstance = highestPriorityStopInstances?.find(
      (stop) => item.scheduled_stop_point_id === stop.scheduled_stop_point_id,
    );

    return (
      !!isHighestPriorityInstance &&
      (belongsToJourneyPattern || showUnusedStops)
    );
  });

  const onAddToRoute = async (stopLabel: string) => {
    try {
      const changes = prepareAddStopToRoute({
        stopPointLabel: stopLabel,
        route,
      });

      const variables = mapEditJourneyPatternChangesToVariables(changes);

      await updateRouteGeometryMutation(variables);
      showSuccessToast(t('routes.saveSuccess'));
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
    }
  };

  const onDeleteFromRoute = async (stopLabel: string) => {
    try {
      const changes = prepareDeleteStopFromRoute({
        stopPointLabel: stopLabel,
        route,
      });

      const variables = mapEditJourneyPatternChangesToVariables(changes);

      await updateRouteGeometryMutation(variables);
      showSuccessToast(t('routes.saveSuccess'));
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
    }
  };

  return (
    <tbody className={className}>
      <RouteStopsHeaderRow
        key={route.route_id}
        route={route}
        isOpen={isOpen}
        onToggle={onToggle}
      />
      {isOpen &&
        displayedStops.map((item, index) => (
          <RouteStopsRow
            // This list is recreated every time when changes happen, so we can
            // use index as key here
            // eslint-disable-next-line react/no-array-index-key
            key={`${item.label}_${index}`}
            stop={item}
            routeId={route.route_id}
            onAddToRoute={onAddToRoute}
            onDeleteFromRoute={onDeleteFromRoute}
          />
        ))}
    </tbody>
  );
};
