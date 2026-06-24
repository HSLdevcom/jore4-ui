import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import {
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
} from '../../../generated/graphql';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { mapDirectionToSymbol } from '../../../i18n/uiNameMappings';
import { Row, Visible } from '../../../layoutComponents';
import {
  selectHasChangesInProgress,
  selectMapRouteEditor,
  setRouteMetadataFormOpenAction,
} from '../../../redux';
import { Priority } from '../../../types/enums';
import { EditButton } from '../../../uiComponents';
import {
  filterDistinctConsecutiveStops,
  filterHighestPriorityCurrentStops,
} from '../../../utils';
import { RouteLabel } from '../../common/RouteLabel';
import { CustomOverlay } from '../CustomOverlay';
import { MapOverlay, MapOverlayHeader } from '../MapOverlay';
import { PriorityBadge } from '../PriorityBadge';
import { useMapObservationDate } from '../utils/mapUrlState';
import { belongsToJourneyPattern, useRouteInfo } from './hooks';
import { RouteStopsOverlayRow } from './RouteStopsOverlayRow';

const testIds = {
  mapOverlayHeader: 'RouteStopsOverlay::mapOverlayHeader',
  routeStopListHeader: (label: string, direction: RouteDirectionEnum) =>
    `RouteStopsOverlay::routeStopListHeader::${label}-${direction}`,
};

type RouteStopsOverlayProps = {
  readonly className?: string;
};

type VehicleModeStyles = {
  readonly icon: string;
  readonly backgroundColor: string;
};

const vehicleModeStylesMap: Readonly<
  Record<ReusableComponentsVehicleModeEnum, VehicleModeStyles>
> = {
  [ReusableComponentsVehicleModeEnum.Bus]: {
    icon: 'icon-bus-alt text-tweaked-brand',
    backgroundColor: 'bg-tweaked-brand',
  },
  [ReusableComponentsVehicleModeEnum.Tram]: {
    icon: 'icon-tram-filled text-hsl-tram-dark-green',
    backgroundColor: 'bg-hsl-tram-dark-green',
  },
  [ReusableComponentsVehicleModeEnum.Metro]: {
    icon: 'icon-metro-filled text-hsl-metro-orange',
    backgroundColor: 'bg-hsl-metro-orange',
  },
  [ReusableComponentsVehicleModeEnum.Train]: {
    icon: 'icon-train-filled text-hsl-train-purple',
    backgroundColor: 'bg-hsl-train-purple',
  },
  [ReusableComponentsVehicleModeEnum.Ferry]: {
    icon: 'icon-ferry-filled text-hsl-ferry-blue',
    backgroundColor: 'bg-hsl-ferry-blue',
  },
};

export const RouteStopsOverlay: FC<RouteStopsOverlayProps> = ({
  className,
}) => {
  const dispatch = useAppDispatch();
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);
  const observationDate = useMapObservationDate();
  const { selectedRouteId, creatingNewRoute } =
    useAppSelector(selectMapRouteEditor);

  const { t } = useTranslation();

  const {
    routeMetadata,
    routeVehicleMode,
    includedStopLabels,
    stopsEligibleForJourneyPattern,
    // selectedRouteId is undefined if we are creating a new route
  } = useRouteInfo(selectedRouteId);

  if (!routeMetadata || !routeVehicleMode) {
    return null;
  }

  const vehicleModeStyles = vehicleModeStylesMap[routeVehicleMode];

  const highestPriorityCurrentStops = filterHighestPriorityCurrentStops(
    stopsEligibleForJourneyPattern,
    observationDate,
    routeMetadata.priority === Priority.Draft,
  );
  const highestPriorityStopsEligibleForJourneyPattern =
    filterDistinctConsecutiveStops(highestPriorityCurrentStops);

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
    <CustomOverlay position="top-left">
      <MapOverlay className={className}>
        <MapOverlayHeader testId={testIds.mapOverlayHeader}>
          <i className={twJoin(vehicleModeStyles.icon, 'mt-1 text-xl')} />

          <div>
            <p className="text-base text-tweaked-brand">
              <RouteLabel
                label={routeMetadata.label}
                variant={routeMetadata.variant}
              />
            </p>
            <p className="text-light text-xs text-gray-500">{routeName}</p>
          </div>
          <Visible visible={creatingNewRoute}>
            <EditButton
              onClick={() => dispatch(setRouteMetadataFormOpenAction(true))}
              tooltip={t(($) => $.accessibility.map.editRoute, {
                routeName,
              })}
            />
          </Visible>
        </MapOverlayHeader>
        <div className="flex items-start border-b px-3 py-2">
          <div
            className={twJoin(
              'mt-1 ml-1 flex h-6 w-6 items-center justify-center rounded-xs font-bold text-white',
              vehicleModeStyles.backgroundColor,
            )}
          >
            {mapDirectionToSymbol(t, routeMetadata.direction)}
          </div>
          <div
            data-testid={testIds.routeStopListHeader(
              routeMetadata.label,
              routeMetadata.direction,
            )}
            className="ml-2 flex flex-col"
          >
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
    </CustomOverlay>
  );
};
