import { gql } from '@apollo/client';
import {
  filterHighestPriorityCurrentStops,
  useAppDispatch,
  useAppSelector,
  useObservationDateQueryParam,
} from '../../hooks';
import {
  belongsToJourneyPattern,
  useRouteInfo,
} from '../../hooks/routes/useRouteInfo';
import { mapDirectionToShortUiName } from '../../i18n/uiNameMappings';
import { Row, Visible } from '../../layoutComponents';
import {
  selectHasChangesInProgress,
  selectMapEditor,
  setRouteMetadataFormOpenAction,
} from '../../redux';
import { EditButton } from '../../uiComponents';
import { MapOverlay, MapOverlayHeader } from './MapOverlay';
import { PriorityBadge } from './PriorityBadge';
import { RouteStopsOverlayRow } from './RouteStopsOverlayRow';

const testIds = {
  mapOverlayHeader: 'RouteStopsOverlay::mapOverlayHeader',
};

interface Props {
  className?: string;
}

const GQL_ROUTE_METADATA = gql`
  fragment route_metadata on route_route {
    name_i18n
    label
    priority
    validity_start
    validity_end
    direction
  }
`;

export const RouteStopsOverlay = ({ className = '' }: Props) => {
  const dispatch = useAppDispatch();
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);
  const { observationDate } = useObservationDateQueryParam();
  const { selectedRouteId, creatingNewRoute } = useAppSelector(selectMapEditor);

  const {
    routeMetadata,
    includedStopLabels,
    stopsEligibleForJourneyPattern,
    // selectedRouteId is undefined if we are creating a new route
  } = useRouteInfo(selectedRouteId);

  if (!routeMetadata) {
    return null;
  }

  const highestPriorityStopsEligibleForJourneyPattern =
    filterHighestPriorityCurrentStops(
      stopsEligibleForJourneyPattern,
      observationDate,
    );

  /**
   * When editing a route, we want to show all stops eligible for route,
   * When displaying, we don't want to show stops that are not in the journey pattern
   */
  const stopsToShow = routeEditingInProgress
    ? highestPriorityStopsEligibleForJourneyPattern
    : highestPriorityStopsEligibleForJourneyPattern.filter((stop) =>
        belongsToJourneyPattern(includedStopLabels, stop.label),
      );

  return (
    <MapOverlay className={className}>
      <MapOverlayHeader testId={testIds.mapOverlayHeader}>
        <i className="icon-bus-alt text-2xl text-tweaked-brand" />
        <div>
          <h2 className="text-2xl font-bold text-tweaked-brand">
            {routeMetadata.label}
          </h2>
          <div className="text-light text-xs text-gray-500">
            {routeMetadata?.name_i18n.fi_FI}
          </div>
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
              validityStart={routeMetadata.validity_start}
              validityEnd={routeMetadata.validity_end}
            />
          </Row>
          <div className="text-light text-xs text-gray-500">
            {routeMetadata.name_i18n.fi_FI}
          </div>
        </div>
      </div>
      <div className="overflow-y-auto">
        {stopsToShow?.map((stop, index) => (
          <RouteStopsOverlayRow
            // This list is recreated every time when changes happen, so we can
            // use index as key here
            // eslint-disable-next-line react/no-array-index-key
            key={`${stop.label}_${index}`}
            stop={stop}
            isReadOnly={!routeEditingInProgress}
            belongsToJourneyPattern={belongsToJourneyPattern(
              includedStopLabels,
              stop.label,
            )}
          />
        ))}
      </div>
    </MapOverlay>
  );
};
