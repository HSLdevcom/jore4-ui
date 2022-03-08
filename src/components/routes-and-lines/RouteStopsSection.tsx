import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteRoute } from '../../generated/graphql';
import { getStopsAlongRouteGeometry } from '../../graphql';
import { useEditRouteGeometry } from '../../hooks';
import { showDangerToast, showSuccessToast } from '../../utils';
import { RouteStopsHeaderRow } from './RouteStopsHeaderRow'; // eslint-disable-line import/no-cycle
import { RouteStopsRow } from './RouteStopsRow';

interface Props {
  className?: string;
  route: RouteRoute;
}

export const RouteStopsSection = ({ className, route }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const { t } = useTranslation();

  const { addStopToRouteJourneyPattern } = useEditRouteGeometry();

  const onToggle = () => {
    setOpen(!isOpen);
  };

  const stopsAlongRoute = getStopsAlongRouteGeometry(route);

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
        isOpen={isOpen}
        onToggle={onToggle}
      />
      {isOpen &&
        stopsAlongRoute.map((item) => (
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
