import { useTranslation } from 'react-i18next';
import { useGetRoutesWithInfrastructureLinksQuery } from '../../generated/graphql';
import { getRouteStopLabels, mapRoutesDetailsResult } from '../../graphql';
import { getRouteStops, useAppDispatch, useAppSelector } from '../../hooks';
import { mapDirectionToShortUiName } from '../../i18n/uiNameMappings';
import { Visible } from '../../layoutComponents';
import {
  selectHasChangesInProgress,
  selectMapEditor,
  setRouteMetadataFormOpenAction,
  setStopOnRouteAction,
} from '../../redux';
import { EditButton, SimpleDropdownMenu } from '../../uiComponents';
import { mapToVariables } from '../../utils';
import { MapOverlay, MapOverlayHeader } from './MapOverlay';

interface Props {
  className?: string;
}

const StopRow = ({
  label,
  onRoute,
  isReadOnly,
}: {
  label: string;
  onRoute: boolean;
  isReadOnly?: boolean;
}) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const setOnRoute = (belongsToRoute: boolean) => {
    dispatch(
      setStopOnRouteAction({
        stopLabel: label,
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
  const dispatch = useAppDispatch();
  const { editedRouteData, selectedRouteId, creatingNewRoute } =
    useAppSelector(selectMapEditor);
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  const routesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: [selectedRouteId] }),
  );

  const routes = mapRoutesDetailsResult(routesResult);
  const selectedRoute = routes?.[0];

  // FIXME: the typings are off, shouldn't compare editedRouteData.metaData with selectedRoute
  const routeMetadata = editedRouteData.metaData || selectedRoute;
  const routeName =
    editedRouteData.metaData?.finnishName || selectedRoute?.name_i18n?.fi_FI;

  const selectedRouteStopLabels = selectedRoute
    ? getRouteStopLabels(selectedRoute)
    : [];

  // If creating/editing a route, show edited route stops
  // otherwise show selected route's stops
  const routeStops = routeEditingInProgress
    ? editedRouteData.stops
    : getRouteStops(selectedRouteStopLabels);

  if (!routeMetadata) {
    return null;
  }

  return (
    <MapOverlay className={className}>
      <MapOverlayHeader>
        <i className="icon-bus-alt text-2xl text-tweaked-brand" />
        <div>
          <h2 className="text-2xl font-bold text-tweaked-brand">{routeName}</h2>
          <div className="text-light text-xs text-gray-500">
            {routeMetadata.label}
          </div>
        </div>
        <Visible visible={creatingNewRoute}>
          <EditButton
            onClick={() => dispatch(setRouteMetadataFormOpenAction(true))}
          />
        </Visible>
      </MapOverlayHeader>
      <div className="flex items-center border-b py-2 px-3">
        <div className="ml-1 flex h-6 w-6 items-center justify-center rounded-sm bg-brand font-bold text-white">
          {mapDirectionToShortUiName(routeMetadata.direction)}
        </div>
        <div className="ml-2 flex flex-col">
          <h2 className="text-base font-bold text-black">{routeName}</h2>
          <div className="text-light text-xs text-gray-500">
            {routeMetadata.label}
          </div>
        </div>
      </div>
      {routeStops?.map((routeStop) => (
        <StopRow
          key={routeStop.label}
          label={routeStop.label}
          onRoute={routeStop.belongsToRoute}
          isReadOnly={!routeEditingInProgress}
        />
      ))}
    </MapOverlay>
  );
};
