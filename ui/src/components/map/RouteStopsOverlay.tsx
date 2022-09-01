import { useTranslation } from 'react-i18next';
import {
  RouteRoute,
  useGetRoutesWithInfrastructureLinksQuery,
} from '../../generated/graphql';
import { getStopsFromRoute, mapRouteResultToRoutes } from '../../graphql';
import { getRouteStops, useAppDispatch, useAppSelector } from '../../hooks';
import { mapDirectionToShortUiName } from '../../i18n/uiNameMappings';
import { Row, Visible } from '../../layoutComponents';
import {
  selectHasChangesInProgress,
  selectMapEditor,
  setRouteMetadataFormOpenAction,
  setStopOnRouteAction,
} from '../../redux';
import { parseDate } from '../../time';
import {
  AlignDirection,
  EditButton,
  SimpleDropdownMenu,
} from '../../uiComponents';
import { mapToVariables } from '../../utils';
import { RouteFormState } from '../forms/route/RoutePropertiesForm.types';
import { MapOverlay, MapOverlayHeader } from './MapOverlay';
import { PriorityBadge } from './PriorityBadge';

const testIds = {
  mapOverlayHeader: 'RouteStopsOverlay::mapOverlayHeader',
  stopRow: (label: string) => `StopRow::${label}`,
};

interface Props {
  className?: string;
}

const StopRow = ({
  label,
  onRoute,
  isReadOnly,
  testId,
}: {
  label: string;
  onRoute: boolean;
  isReadOnly?: boolean;
  testId?: string;
}) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const setOnRoute = (belongsToJourneyPattern: boolean) => {
    dispatch(
      setStopOnRouteAction({
        stopLabel: label,
        belongsToJourneyPattern,
      }),
    );
  };

  return (
    <div
      data-testid={testId}
      className="flex items-center justify-between border-b p-2"
    >
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
          <SimpleDropdownMenu alignItems={AlignDirection.Left}>
            <button type="button" onClick={() => setOnRoute(!onRoute)}>
              {onRoute ? t('stops.removeFromRoute') : t('stops.addToRoute')}
            </button>
          </SimpleDropdownMenu>
        </div>
      )}
    </div>
  );
};

export const RouteStopsOverlay = ({ className = '' }: Props) => {
  const dispatch = useAppDispatch();
  const { editedRouteData, selectedRouteId, creatingNewRoute } =
    useAppSelector(selectMapEditor);
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  const routesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: [selectedRouteId] }),
  );

  const routes = mapRouteResultToRoutes(routesResult);
  const selectedRoute = routes?.[0];

  // FIXME: the typings are off, shouldn't compare editedRouteData.metaData with selectedRoute
  const routeMetadata = editedRouteData.metaData || selectedRoute;
  const routeName =
    editedRouteData.metaData?.finnishName || selectedRoute?.name_i18n?.fi_FI;

  const selectedRouteStops = selectedRoute
    ? getStopsFromRoute(selectedRoute)
    : [];

  // If creating/editing a route, show edited route stops
  // otherwise show selected route's stops
  const routeStops = routeEditingInProgress
    ? editedRouteData.stops
    : getRouteStops(
        selectedRouteStops.map((stop) => stop.scheduled_stop_points[0]),
      );

  const validityStart = routeEditingInProgress
    ? parseDate((routeMetadata as RouteFormState)?.validityStart)
    : (routeMetadata as RouteRoute)?.validity_start;
  const validityEnd = routeEditingInProgress
    ? parseDate((routeMetadata as RouteFormState)?.validityEnd)
    : (routeMetadata as RouteRoute)?.validity_end;

  if (!routeMetadata) {
    return null;
  }

  return (
    <MapOverlay className={className}>
      <MapOverlayHeader testId={testIds.mapOverlayHeader}>
        <i className="icon-bus-alt text-2xl text-tweaked-brand" />
        <div>
          <h2 className="text-2xl font-bold text-tweaked-brand">
            {routeMetadata.label}
          </h2>
          <div className="text-light text-xs text-gray-500">{routeName}</div>
        </div>
        <Visible visible={creatingNewRoute}>
          <EditButton
            onClick={() => dispatch(setRouteMetadataFormOpenAction(true))}
          />
        </Visible>
      </MapOverlayHeader>
      <div className="flex items-start border-b py-2 px-3">
        <div className="ml-1 mt-1 flex h-6 w-6 items-center justify-center rounded-sm bg-brand font-bold text-white">
          {mapDirectionToShortUiName(routeMetadata.direction)}
        </div>
        <div className="ml-2 flex flex-col">
          <Row className="items-center gap-2">
            <h2 className="text-base font-bold text-black">
              {routeMetadata.label}
            </h2>
            <PriorityBadge
              priority={routeMetadata.priority}
              validityStart={validityStart}
              validityEnd={validityEnd}
            />
          </Row>
          <div className="text-light text-xs text-gray-500">{routeName}</div>
        </div>
      </div>
      <div className="overflow-y-auto">
        {routeStops?.map((routeStop, index) => (
          <StopRow
            // This list is recreated every time when changes happen, so we can
            // use index as key here
            // eslint-disable-next-line react/no-array-index-key
            key={`${routeStop.label}_${index}`}
            testId={testIds.stopRow(routeStop.label)}
            label={routeStop.label}
            onRoute={routeStop.belongsToJourneyPattern}
            isReadOnly={!routeEditingInProgress}
          />
        ))}
      </div>
    </MapOverlay>
  );
};
