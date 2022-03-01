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

interface Props {
  className?: string;
}

const StopRow = ({ stop }: { stop: ServicePatternScheduledStopPoint }) => {
  const { label } = stop;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { editedRouteData },
  } = useContext(MapEditorContext);

  const deleteFromJourneyPattern = () => {
    dispatch({
      type: 'setState',
      payload: {
        editedRouteData: {
          ...editedRouteData,
          stopIds: editedRouteData.stopIds?.filter(
            (item) => item !== stop.scheduled_stop_point_id,
          ),
        },
      },
    });
  };

  return (
    <div className="flex items-center justify-between border-b p-2">
      <div className="flex flex-col pl-10">
        <div className="text-sm font-bold">{label}</div>
      </div>
      <div className="text-tweaked-brand">
        <SimpleDropdownMenu>
          <button type="button" onClick={deleteFromJourneyPattern}>
            {t('stops.removeFromRoute')}
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
  const stopsToDisplay = editedRouteData.stopIds?.map((stopId) =>
    stops?.find((item) => item.scheduled_stop_point_id === stopId),
  );

  if (!route) {
    return null;
  }

  return (
    <div className={`inline-block w-72 ${className}`}>
      <div className="flex flex-col bg-white shadow-md">
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
          {stopsToDisplay?.map((stop) => (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <StopRow key={stop?.scheduled_stop_point_id} stop={stop!} />
          ))}
        </div>
      </div>
    </div>
  );
};
