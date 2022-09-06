import { useTranslation } from 'react-i18next';
import {
  RouteRoute,
  useGetRoutesWithInfrastructureLinksQuery,
} from '../../generated/graphql';
import { getStopsFromRoute, mapRouteResultToRoutes } from '../../graphql';
import {
  filterHighestPriorityCurrentStops,
  getRouteStops,
  useAppDispatch,
  useAppSelector,
  useObservationDateQueryParam,
} from '../../hooks';
import { mapDirectionToShortUiName } from '../../i18n/uiNameMappings';
import { Row, Visible } from '../../layoutComponents';
import {
  mapFromStoreType,
  selectHasChangesInProgress,
  selectMapEditor,
  setRouteMetadataFormOpenAction,
  setStopOnRouteAction,
} from '../../redux';
import { RouteStop } from '../../redux/types/mapEditor';
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
  routeStop: { label, belongsToJourneyPattern, stopInstance },
  isReadOnly,
  testId,
}: {
  routeStop: RouteStop;
  isReadOnly?: boolean;
  testId?: string;
}) => {
  const { t } = useTranslation();

  const stop = mapFromStoreType(stopInstance);
  const dispatch = useAppDispatch();

  const setOnRoute = (onRoute: boolean) => {
    dispatch(
      setStopOnRouteAction({
        stopLabel: label,
        belongsToJourneyPattern: onRoute,
      }),
    );
  };

  return (
    <div
      className="flex h-10 items-center justify-between border-b p-2"
      data-testid={testId}
    >
      <div className="flex items-center">
        <div className="w-10">
          <PriorityBadge
            priority={stop.priority}
            validityStart={stop.validity_start}
            validityEnd={stop.validity_end}
          />
        </div>
        <div
          className={`text-sm font-bold ${
            belongsToJourneyPattern ? 'text-black' : 'text-gray-300'
          }`}
        >
          {label}
        </div>
      </div>
      {!isReadOnly && (
        <div className="text-tweaked-brand">
          <SimpleDropdownMenu alignItems={AlignDirection.Left}>
            <button
              type="button"
              onClick={() => setOnRoute(!belongsToJourneyPattern)}
            >
              {belongsToJourneyPattern
                ? t('stops.removeFromRoute')
                : t('stops.addToRoute')}
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

  const { observationDate } = useObservationDateQueryParam();

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
        selectedRouteStops.flatMap((stop) =>
          filterHighestPriorityCurrentStops(
            stop.scheduled_stop_points,
            observationDate,
            true,
          ),
        ),
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
            routeStop={routeStop}
            isReadOnly={!routeEditingInProgress}
          />
        ))}
      </div>
    </MapOverlay>
  );
};
