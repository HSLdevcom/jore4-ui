import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOpenInNew } from 'react-icons/md';
import { Link } from 'react-router';
import { twJoin } from 'tailwind-merge';
import {
  selectHasChangesInProgress,
  selectVisibleRouteIds,
  useAppSelector,
} from '../../../../redux';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { getTransportModeIcon } from '../../../../utils';
import { EditButton } from '../../../common/Buttons';
import { CustomOverlay } from '../../CustomOverlay';
import { MapOverlay, MapOverlayHeader } from '../../MapOverlay';
import { useMapObservationDate } from '../../Utils/mapUrlState';
import { RouteStopsOverlay } from '../RouteStopsOverlay';
import { LineRouteRow } from './LineRouteRow';
import { useLineRoutes } from './useLineRoutes';

const testIds = {
  overlay: 'LineRoutesOverlay',
  mapOverlayHeader: 'LineRoutesOverlay::mapOverlayHeader',
  lineLink: 'LineRoutesOverlay::lineLink',
};
export const lineRoutesOverlayTestIds = testIds;

type LineRoutesOverlayProps = {
  readonly className?: string;
};

export const LineRoutesOverlay: FC<LineRoutesOverlayProps> = ({
  className,
}) => {
  const { t } = useTranslation();
  const observationDate = useMapObservationDate();
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);
  const visibleRouteIds = useAppSelector(selectVisibleRouteIds);

  const { routes } = useLineRoutes();

  // While creating or editing a route the overlay is dedicated to that route.
  if (routeEditingInProgress) {
    return <RouteStopsOverlay className={className} />;
  }

  const line = routes.at(0)?.route_line;

  if (!line) {
    return null;
  }

  const lineName = line.name_i18n.fi_FI;

  return (
    <CustomOverlay position="top-left">
      <MapOverlay className={className} testId={testIds.overlay}>
        <MapOverlayHeader testId={testIds.mapOverlayHeader}>
          <i
            className={twJoin(
              getTransportModeIcon(
                line.primary_vehicle_mode,
                line.type_of_line,
              ),
              'text-xl',
            )}
          />

          <div className="flex-1">
            <p className="flex items-center gap-1 text-base text-tweaked-brand">
              {line.label}
              <Link
                to={routeDetails[Path.lineDetails].getLink(line.line_id, {
                  observationDate,
                })}
                data-testid={testIds.lineLink}
                title={t(($) => $.accessibility.map.showLineDetails, {
                  lineLabel: line.label,
                })}
              >
                <MdOpenInNew aria-hidden className="text-base" />
              </Link>
            </p>
            <p className="text-light text-xs text-gray-500">{lineName}</p>
          </div>

          <EditButton
            href={routeDetails[Path.editLine].getLink(line.line_id)}
            tooltip={t(($) => $.accessibility.map.editLine, {
              lineLabel: line.label,
            })}
          />
        </MapOverlayHeader>

        <div className="overflow-y-auto">
          {routes.map((route) => (
            <LineRouteRow
              key={route.route_id}
              route={route}
              isVisible={visibleRouteIds.includes(route.route_id)}
            />
          ))}
        </div>
      </MapOverlay>
    </CustomOverlay>
  );
};
