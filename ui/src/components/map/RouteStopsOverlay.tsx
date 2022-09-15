import { gql } from '@apollo/client';
import {
  useAppDispatch,
  useAppSelector,
  useObservationDateQueryParam,
} from '../../hooks';
import { useRouteInfo } from '../../hooks/routes/useRouteInfo';
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

export const RouteStopsOverlay = ({ className = '' }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);
  const { observationDate } = useObservationDateQueryParam();
  const { selectedRouteId, creatingNewRoute } = useAppSelector(selectMapEditor);

  const {
    routeMetadata,
    highestPriorityStopsEligibleForJourneyPattern,
    belongsToJourneyPattern,
  } = useRouteInfo(
    creatingNewRoute ? undefined : selectedRouteId,
    observationDate,
  );

  if (!routeMetadata) {
    return <></>;
  }

  const stopsToShow = highestPriorityStopsEligibleForJourneyPattern.filter(
    (stop) => routeEditingInProgress || belongsToJourneyPattern(stop),
  );

  return (
    <MapOverlay className={className}>
      <MapOverlayHeader testId={testIds.mapOverlayHeader}>
        <i className="icon-bus-alt text-2xl text-tweaked-brand" />
        <div>
          <h2 className="text-tweaked-brand">{routeMetadata.label}</h2>
          <p className="text-light text-xs text-gray-500">
            {routeMetadata?.name_i18n.fi_FI}
          </p>
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
            <p className="text-base font-bold text-black">
              {routeMetadata.label}
            </p>
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
            belongsToJourneyPattern={belongsToJourneyPattern(stop)}
          />
        ))}
      </div>
    </MapOverlay>
  );
};
