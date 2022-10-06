import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pipe } from 'remeda';
import { RouteRoute } from '../../../generated/graphql';
import { stopBelongsToJourneyPattern } from '../../../graphql';
import {
  getEligibleStopsAlongRoute,
  useEditRouteJourneyPattern,
  useObservationDateQueryParam,
} from '../../../hooks';
import { getHighestPriorityStopsEligibleForJourneyPattern } from '../../../hooks/routes/useRouteInfo';
import { Priority } from '../../../types/Priority';
import { showDangerToast, showSuccessToast } from '../../../utils';
import { RouteStopsHeaderRow } from './RouteStopsHeaderRow';
import { RouteStopsRow } from './RouteStopsRow';

interface Props {
  className?: string;
  route: RouteRoute;
  showUnusedStops: boolean;
}

export const RouteStopsSection = ({
  className = '',
  route,
  showUnusedStops,
}: Props): JSX.Element => {
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

  const { observationDate } = useObservationDateQueryParam();

  /**
   * Stops to display. Show the highest priority version of stops' valid instances.
   * If "show unused stops" is selected, also show stops that are not in the journey pattern
   * but are along route geometry.
   */
  const displayedStops = pipe(
    route,
    getEligibleStopsAlongRoute,
    (stops) =>
      getHighestPriorityStopsEligibleForJourneyPattern(
        stops,
        observationDate,
        route.priority === Priority.Draft,
      ),
    (stops) =>
      showUnusedStops
        ? stops
        : stops.filter((stop) =>
            stopBelongsToJourneyPattern(stop, route.route_id),
          ),
  );

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

  const onRemoveFromRoute = async (stopLabel: string) => {
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
        observationDate={observationDate}
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
            onRemoveFromRoute={onRemoveFromRoute}
          />
        ))}
    </tbody>
  );
};
