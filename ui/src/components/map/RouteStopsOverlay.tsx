import { useTranslation } from 'react-i18next';
import { pipe } from 'remeda';
import {
  belongsToJourneyPattern,
  useAppDispatch,
  useAppSelector,
  useObservationDateQueryParam,
  useRouteInfo,
} from '../../hooks';
import { mapDirectionToShortUiName } from '../../i18n/uiNameMappings';
import { Row, Visible } from '../../layoutComponents';
import {
  selectHasChangesInProgress,
  selectMapRouteEditor,
  setRouteMetadataFormOpenAction,
} from '../../redux';
import { Priority } from '../../types/enums';
import { EditButton } from '../../uiComponents';
import {
  filterDistinctConsecutiveStops,
  filterHighestPriorityCurrentStops,
} from '../../utils';
import { RouteLabel } from '../common/RouteLabel';
import { MapOverlay, MapOverlayHeader } from './MapOverlay';
import { PriorityBadge } from './PriorityBadge';
import { RouteStopsOverlayRow } from './RouteStopsOverlayRow';

const testIds = {
  mapOverlayHeader: 'RouteStopsOverlay::mapOverlayHeader',
};

interface Props {
  className?: string;
}

export const RouteStopsOverlay = ({ className = '' }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);
  const { observationDate } = useObservationDateQueryParam();
  const { selectedRouteId, creatingNewRoute } =
    useAppSelector(selectMapRouteEditor);

  const { t } = useTranslation();

  const {
    routeMetadata,
    includedStopLabels,
    stopsEligibleForJourneyPattern,
    // selectedRouteId is undefined if we are creating a new route
  } = useRouteInfo(selectedRouteId);

  if (!routeMetadata) {
    return <></>;
  }

  const highestPriorityStopsEligibleForJourneyPattern = pipe(
    filterHighestPriorityCurrentStops(
      stopsEligibleForJourneyPattern,
      observationDate,
      routeMetadata.priority === Priority.Draft,
    ),
    filterDistinctConsecutiveStops,
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
  const routeName = routeMetadata?.name_i18n.fi_FI;
  return (
    <MapOverlay className={className}>
      <MapOverlayHeader testId={testIds.mapOverlayHeader}>
        <i className="icon-bus-alt text-2xl text-tweaked-brand" />
        <div>
          <h2 className="text-tweaked-brand">
            <RouteLabel
              label={routeMetadata.label}
              variant={routeMetadata.variant}
            />
          </h2>
          <p className="text-light text-xs text-gray-500">{routeName}</p>
        </div>
        <Visible visible={creatingNewRoute}>
          <EditButton
            onClick={() => dispatch(setRouteMetadataFormOpenAction(true))}
            tooltip={t('accessibility:map.editRoute', { routeName })}
          />
        </Visible>
      </MapOverlayHeader>
      <div className="flex items-start border-b px-3 py-2">
        <div className="ml-1 mt-1 flex h-6 w-6 items-center justify-center rounded-sm bg-brand font-bold text-white">
          {mapDirectionToShortUiName(routeMetadata.direction)}
        </div>
        <div className="ml-2 flex flex-col">
          <Row className="items-center gap-2">
            <p className="text-base text-black">
              <RouteLabel
                label={routeMetadata.label}
                variant={routeMetadata.variant}
              />
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
