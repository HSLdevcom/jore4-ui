import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteRoute } from '../../generated/graphql';
import {
  getStopsAlongRouteGeometry,
  stopBelongsToJourneyPattern,
} from '../../graphql';
import { useEditRouteGeometry } from '../../hooks';
import { showDangerToast, showSuccessToast } from '../../utils';
import { RouteStopsHeaderRow } from './RouteStopsHeaderRow'; // eslint-disable-line import/no-cycle
import { RouteStopsRow } from './RouteStopsRow';

interface Props {
  className?: string;
  routeDirections: RouteRoute[];
  showUnusedStops: boolean;
}

export const RouteStopsSection = ({
  className,
  routeDirections,
  showUnusedStops,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [routeToDisplayIndex, setRouteToDisplayIndex] = useState(0);

  const { t } = useTranslation();

  const { addStopToRouteJourneyPattern } = useEditRouteGeometry();

  const onToggleShowStops = () => {
    setOpen(!isOpen);
  };

  const route = routeDirections[routeToDisplayIndex];

  const stopsAlongRoute = getStopsAlongRouteGeometry(route);
  const displayedRoutes = stopsAlongRoute.filter((item) => {
    const belongsToJourneyPattern = stopBelongsToJourneyPattern(
      item,
      route.route_id,
    );
    return belongsToJourneyPattern || showUnusedStops;
  });

  const onAddToRoute = async (stopToAdd: UUID) => {
    try {
      await addStopToRouteJourneyPattern(stopToAdd, route);
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
        showStops={isOpen}
        onToggleShowStops={onToggleShowStops}
        onToggleDirection={
          routeDirections.length > 1
            ? () => setRouteToDisplayIndex(routeToDisplayIndex ? 0 : 1)
            : undefined
        }
      />
      {isOpen &&
        displayedRoutes.map((item) => (
          <RouteStopsRow
            key={item.scheduled_stop_point_id}
            stop={item}
            routeId={route.route_id}
            onAddToRoute={onAddToRoute}
          />
        ))}
    </tbody>
  );
};
