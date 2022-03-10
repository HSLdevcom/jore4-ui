import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MapEditorContext } from '../../context/MapEditorContext';
import {
  ServicePatternScheduledStopPoint,
  useGetRoutesWithInfrastructureLinksQuery,
  useGetStopsQuery,
} from '../../generated/graphql';
import { mapGetStopsResult, mapRoutesDetailsResult } from '../../graphql';
import { SimpleDropdownMenu } from '../../uiComponents/SimpleDropdownMenu';
import { mapToVariables } from '../../utils';
import { MapOverlay, MapOverlayHeader } from './MapOverlay';

interface Props {
  className?: string;
}

const StopRow = ({
  stop,
  onRoute,
}: {
  stop: ServicePatternScheduledStopPoint;
  onRoute: boolean;
}) => {
  const { label } = stop;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { editedRouteData },
  } = useContext(MapEditorContext);

  const setOnRoute = (belongsToRoute: boolean) => {
    dispatch({
      type: 'setState',
      payload: {
        editedRouteData: {
          ...editedRouteData,
          stops: editedRouteData.stops?.map((item) =>
            item.id === stop.scheduled_stop_point_id
              ? { ...item, belongsToRoute }
              : item,
          ),
        },
      },
    });
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
      <div className="text-tweaked-brand">
        <SimpleDropdownMenu>
          <button type="button" onClick={() => setOnRoute(!onRoute)}>
            {onRoute ? t('stops.removeFromRoute') : t('stops.addToRoute')}
          </button>
        </SimpleDropdownMenu>
      </div>
    </div>
  );
};

export const RouteStopsOverlay = ({ className }: Props) => {
  const {
    state: { displayedRouteIds, editedRouteData },
  } = useContext(MapEditorContext);

  const routesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: displayedRouteIds || [] }),
  );

  const routes = mapRoutesDetailsResult(routesResult);

  const route = editedRouteData.metaData || routes?.[0];

  const stopsResult = useGetStopsQuery({});
  const stops = mapGetStopsResult(stopsResult);
  const stopsToDisplay = editedRouteData.stops?.map((stop) => ({
    stop: stops?.find((item) => item.scheduled_stop_point_id === stop.id),
    belongsToRoute: stop.belongsToRoute,
  }));

  if (!route) {
    return null;
  }

  return (
    <MapOverlay className={className}>
      <MapOverlayHeader>
        <i className="icon-bus-alt text-2xl text-tweaked-brand" />
        <div>
          <h2 className="text-2xl font-bold text-tweaked-brand">
            {route.description_i18n}
          </h2>
          <div className="text-light text-xs text-gray-500">{route.label}</div>
        </div>
      </MapOverlayHeader>
      {stopsToDisplay?.map(
        (routeStop) =>
          routeStop.stop && (
            <StopRow
              key={routeStop?.stop?.scheduled_stop_point_id}
              stop={routeStop.stop}
              onRoute={routeStop.belongsToRoute}
            />
          ),
      )}
    </MapOverlay>
  );
};
