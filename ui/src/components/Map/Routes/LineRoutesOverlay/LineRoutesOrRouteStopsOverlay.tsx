import { FC } from 'react';
import { selectHasChangesInProgress, useAppSelector } from '../../../../redux';
import { RouteStopsOverlay } from '../RouteStopsOverlay';
import { LineRoutesOverlay } from './LineRoutesOverlay';

type LineRoutesOrRouteStopsOverlayProps = {
  readonly className?: string;
};

export const LineRoutesOrRouteStopsOverlay: FC<
  LineRoutesOrRouteStopsOverlayProps
> = ({ className }) => {
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  return routeEditingInProgress ? (
    <RouteStopsOverlay className={className} />
  ) : (
    <LineRoutesOverlay className={className} />
  );
};
