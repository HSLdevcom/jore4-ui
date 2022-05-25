import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteRoute } from '../../../generated/graphql';
import {
  getStopsAlongRouteGeometry,
  stopBelongsToJourneyPattern,
} from '../../../graphql';
import { useEditRouteJourneyPattern } from '../../../hooks';
import { showDangerToast, showSuccessToast } from '../../../utils';
import { RouteStopsHeaderRow } from './RouteStopsHeaderRow';
import { RouteStopsRow } from './RouteStopsRow';

interface Props {
  className?: string;
  route: RouteRoute;
  showUnusedStops: boolean;
}

export const RouteStopsSection = ({
  className,
  route,
  showUnusedStops,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const { t } = useTranslation();

  const {
    prepareAddStopToRoute,
    mapAddStopToRouteChangesToVariables,
    addStopToRouteMutation,
  } = useEditRouteJourneyPattern();

  const onToggle = () => {
    setOpen(!isOpen);
  };

  const stopsAlongRoute = getStopsAlongRouteGeometry(route);
  const displayedRoutes = stopsAlongRoute.filter((item) => {
    const belongsToJourneyPattern = stopBelongsToJourneyPattern(
      item,
      route.route_id,
    );
    return belongsToJourneyPattern || showUnusedStops;
  });

  const onAddToRoute = async (stopToAdd: string) => {
    try {
      const changes = prepareAddStopToRoute({
        stopPointLabel: stopToAdd,
        route,
      });

      const variables = mapAddStopToRouteChangesToVariables(changes);

      await addStopToRouteMutation(variables);
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
