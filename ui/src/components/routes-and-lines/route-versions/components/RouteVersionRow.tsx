import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { LocatorButton } from '../../../../uiComponents';
import { useShowRoutesOnMap } from '../../../common/hooks';
import { VersionRowCells } from '../../../common/versions';
import { RouteVersion } from '../types';
import { RouteVersionActionMenu } from './RouteVersionActionMenu';

type RouteVersionRowProps = {
  readonly className?: string;
  readonly routeVersion: RouteVersion;
};

export const RouteVersionRow: FC<RouteVersionRowProps> = ({
  className,
  routeVersion,
}) => {
  const { t } = useTranslation();
  const { showRouteOnMap } = useShowRoutesOnMap();

  const onClickShowRouteOnMap = () => {
    showRouteOnMap(routeVersion);
  };

  return (
    <tr
      className={twMerge('border-b text-nowrap *:border-x', className)}
      data-test-element-type="RouteVersionRow"
    >
      <VersionRowCells version={routeVersion} testIdPrefix="RouteVersionRow" />

      <td className="p-2">
        <LocatorButton
          onClick={onClickShowRouteOnMap}
          disabled={
            !routeVersion.route_shape /* some routes imported from jore3 are missing the geometry */
          }
          tooltipText={t(($) => $.accessibility.common.showOnMap, {
            label: routeVersion.label,
          })}
        />
      </td>

      <td>
        <RouteVersionActionMenu className="p-2" routeVersion={routeVersion} />
      </td>
    </tr>
  );
};
