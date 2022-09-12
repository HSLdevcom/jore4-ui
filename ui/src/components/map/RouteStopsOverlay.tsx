import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useActiveRouteInfo } from '../../hooks/routes/useActiveRouteInfo';
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
import {
  AlignDirection,
  EditButton,
  SimpleDropdownMenu,
} from '../../uiComponents';
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
  routeStop: { belongsToJourneyPattern, stop },
  isReadOnly,
  testId,
}: {
  routeStop: RouteStop;
  isReadOnly?: boolean;
  testId?: string;
}) => {
  const { t } = useTranslation();

  const stopMetadata = mapFromStoreType(stop);
  const dispatch = useAppDispatch();

  const setOnRoute = (onRoute: boolean) => {
    dispatch(
      setStopOnRouteAction({
        stopLabel: stopMetadata.label,
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
          {stopMetadata.label}
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
  const { creatingNewRoute } = useAppSelector(selectMapEditor);
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  const { routeMetadata, routeStops } = useActiveRouteInfo();

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
        {routeStops?.map((routeStop, index) => (
          <StopRow
            // This list is recreated every time when changes happen, so we can
            // use index as key here
            // eslint-disable-next-line react/no-array-index-key
            key={`${routeStop.stop.label}_${index}`}
            testId={testIds.stopRow(routeStop.stop.label)}
            routeStop={routeStop}
            isReadOnly={!routeEditingInProgress}
          />
        ))}
      </div>
    </MapOverlay>
  );
};
