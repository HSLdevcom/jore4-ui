import { useTranslation } from 'react-i18next';
import {
  ServicePatternScheduledStopPoint,
  useGetRoutesWithInfrastructureLinksQuery,
  useGetStopsByIdsQuery,
} from '../../generated/graphql';
import {
  getRouteStopIds,
  mapGetStopsResult,
  mapRoutesDetailsResult,
} from '../../graphql';
import { getRouteStops, useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectHasChangesInProgress,
  selectMapEditor,
  setStopOnRouteAction,
} from '../../redux';
import { SimpleDropdownMenu } from '../../uiComponents/SimpleDropdownMenu';
import { mapToVariables } from '../../utils';
import { MapOverlay, MapOverlayHeader } from './MapOverlay';

interface Props {
  className?: string;
}

const StopRow = ({
  stop,
  onRoute,
  isReadOnly,
}: {
  stop: ServicePatternScheduledStopPoint;
  onRoute: boolean;
  isReadOnly?: boolean;
}) => {
  const { label } = stop;
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const setOnRoute = (belongsToRoute: boolean) => {
    dispatch(
      setStopOnRouteAction({
        stopId: stop.scheduled_stop_point_id,
        belongsToRoute,
      }),
    );
  };

  return (
    <div className="flex items-center justify-between border-b p-2">
      <div className="flex flex-col pl-10">
        <div
          className={`text-sm font-bold ${
            onRoute ? 'text-black' : 'text-gray-300'
          }`}
        >
          {label}
        </div>
      </div>
      {!isReadOnly && (
        <div className="text-tweaked-brand">
          <SimpleDropdownMenu>
            <button type="button" onClick={() => setOnRoute(!onRoute)}>
              {onRoute ? t('stops.removeFromRoute') : t('stops.addToRoute')}
            </button>
          </SimpleDropdownMenu>
        </div>
      )}
    </div>
  );
};

export const RouteStopsOverlay = ({ className }: Props) => {
  const { editedRouteData, selectedRouteId } = useAppSelector(selectMapEditor);
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  const routesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: [selectedRouteId] }),
  );

  const routes = mapRoutesDetailsResult(routesResult);
  const selectedRoute = routes?.[0];

  const routeMetadata = editedRouteData.metaData || selectedRoute;
  const selectedRouteStopIds = selectedRoute
    ? getRouteStopIds(selectedRoute)
    : [];

  // If creating/editing a route, fetch edited route stops
  // otherwise fetch selected route's stops
  const stopIdsToFetch = routeEditingInProgress
    ? editedRouteData.stops.map((stop) => stop.id)
    : selectedRouteStopIds;

  const stopsResult = useGetStopsByIdsQuery(
    mapToVariables({
      stopIds: stopIdsToFetch,
    }),
  );

  const stops = mapGetStopsResult(stopsResult);

  // If creating/editing a route, show edited route stops
  // otherwise show selected route's stops
  const routeStops = routeEditingInProgress
    ? editedRouteData.stops
    : getRouteStops(selectedRouteStopIds);

  const stopsToDisplay = routeStops?.map((stop) => ({
    stop: stops?.find((item) => item.scheduled_stop_point_id === stop.id),
    belongsToRoute: stop.belongsToRoute,
  }));

  if (!routeMetadata) {
    return null;
  }

  return (
    <MapOverlay className={className}>
      <MapOverlayHeader>
        <i className="icon-bus-alt text-2xl text-tweaked-brand" />
        <div>
          <h2 className="text-2xl font-bold text-tweaked-brand">
            {routeMetadata.description_i18n}
          </h2>
          <div className="text-light text-xs text-gray-500">
            {routeMetadata.label}
          </div>
        </div>
      </MapOverlayHeader>
      {stopsToDisplay?.map(
        (routeStop) =>
          routeStop.stop && (
            <StopRow
              key={routeStop?.stop?.scheduled_stop_point_id}
              stop={routeStop.stop}
              onRoute={routeStop.belongsToRoute}
              isReadOnly={!routeEditingInProgress}
            />
          ),
      )}
    </MapOverlay>
  );
};
