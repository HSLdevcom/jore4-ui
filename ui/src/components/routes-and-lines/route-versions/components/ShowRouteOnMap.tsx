import { ForwardRefRenderFunction, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenuItem } from '../../../../uiComponents';
import { useShowRoutesOnMap } from '../../../common/hooks';
import { RouteVersion } from '../types';

const testIds = {
  showOnMap: 'RouteVersionRow::ActionMenu::ShowOnMap',
};

type ShowRouteOnMapProps = {
  readonly className?: string;
  readonly routeVersion: RouteVersion;
};

const ShowRouteOnMapImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  ShowRouteOnMapProps
> = ({ className, routeVersion }, ref) => {
  const { t } = useTranslation();
  const { showRouteOnMap } = useShowRoutesOnMap();

  const handleClick = () => {
    showRouteOnMap(routeVersion);
  };

  return (
    <SimpleDropdownMenuItem
      ref={ref}
      className={className}
      text={t(($) => $.accessibility.common.showOnMap, {
        label: routeVersion.label,
      })}
      onClick={handleClick}
      testId={testIds.showOnMap}
      disabled={!routeVersion.route_shape}
    />
  );
};

export const ShowRouteOnMap = forwardRef(ShowRouteOnMapImpl);
