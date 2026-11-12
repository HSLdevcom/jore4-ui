import { FC } from 'react';
import { selectHasChangesInProgress, useAppSelector } from '../../../../redux';
import { filterDistinctConsecutiveStops } from '../../../../utils';
import { useFilterStops } from '../../Utils/useFilterStops';
import { RouteStopsOverlayRow } from '../RouteStopsOverlay/RouteStopsOverlayRow';
import { useRouteInfo } from '../RouteStopsOverlay/useRouteInfo';

type LineRouteStopsProps = {
  readonly routeId: UUID;
};

export const LineRouteStops: FC<LineRouteStopsProps> = ({ routeId }) => {
  const filterStops = useFilterStops();
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  const { routeMetadata, includedStopLabels, stopsEligibleForJourneyPattern } =
    useRouteInfo(routeId);

  if (!routeMetadata) {
    return null;
  }

  const stopsToShow = filterDistinctConsecutiveStops(
    filterStops(stopsEligibleForJourneyPattern),
  ).filter((stop) => includedStopLabels.includes(stop.label));

  return stopsToShow.map((stop) => (
    <RouteStopsOverlayRow
      key={stop.scheduled_stop_point_id}
      stop={stop}
      isReadOnly={!routeEditingInProgress}
      belongsToJourneyPattern={includedStopLabels.includes(stop.label)}
    />
  ));
};
