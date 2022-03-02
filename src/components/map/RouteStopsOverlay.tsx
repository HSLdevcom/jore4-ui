import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MapEditorContext } from '../../context/MapEditorContext';
import { RouteStop } from '../../context/MapEditorReducer';
import {
  RouteRoute,
  ServicePatternScheduledStopPoint,
  useGetStopsQuery,
} from '../../generated/graphql';
import { mapGetStopsResult } from '../../graphql';
import { SimpleDropdownMenu } from '../../uiComponents/SimpleDropdownMenu';

interface Props {
  className?: string;
  routeStops: RouteStop[];
  route: Partial<RouteRoute>;
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
            onRoute ? ' text-black' : ' text-gray-300'
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

export const RouteStopsOverlay = ({
  className,
  route,
  routeStops,
}: Props): JSX.Element => {
  const stopsResult = useGetStopsQuery({});
  const stops = mapGetStopsResult(stopsResult);
  const stopsToDisplay = routeStops.map((stop) => ({
    stop: stops?.find((item) => item.scheduled_stop_point_id === stop.id),
    belongsToRoute: stop.belongsToRoute,
  }));

  return (
    <div className={`inline-block w-72 ${className}`}>
      <div className="flex flex-col bg-white  shadow-md">
        <div className="flex flex-row items-center space-x-1 border-b border-gray-200 bg-background p-2">
          <i className="icon-bus-alt text-2xl text-tweaked-brand" />
          <div>
            <h2 className="text-bold text-2xl text-tweaked-brand">
              {route.description_i18n}
            </h2>
            <div className="text-light text-xs text-gray-500">
              {route.label}
            </div>
          </div>
        </div>
        <div>
          {stopsToDisplay?.map((routeStop) => (
            <StopRow
              key={routeStop?.stop?.scheduled_stop_point_id}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              stop={routeStop.stop!}
              onRoute={routeStop.belongsToRoute}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
