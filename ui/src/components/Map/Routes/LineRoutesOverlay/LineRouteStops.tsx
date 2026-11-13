import { FC } from 'react';
import { selectHasChangesInProgress, useAppSelector } from '../../../../redux';
import { Priority } from '../../../../types/enums';
import {
  filterDistinctConsecutiveStops,
  filterHighestPriorityCurrentStops,
} from '../../../../utils';
import { useMapObservationDate } from '../../Utils/mapUrlState';
import { RouteStopsOverlayRow } from '../RouteStopsOverlay/RouteStopsOverlayRow';
import { useRouteInfo } from '../RouteStopsOverlay/useRouteInfo';

type LineRouteStopsProps = {
  readonly routeId: UUID;
};

export const LineRouteStops: FC<LineRouteStopsProps> = ({ routeId }) => {
  const observationDate = useMapObservationDate();
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  const { routeMetadata, includedStopLabels, stopsEligibleForJourneyPattern } =
    useRouteInfo(routeId);

  if (!routeMetadata) {
    return null;
  }

  const stopsToShow = filterDistinctConsecutiveStops(
    filterHighestPriorityCurrentStops(
      stopsEligibleForJourneyPattern,
      observationDate,
      routeMetadata.priority === Priority.Draft,
    ),
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
