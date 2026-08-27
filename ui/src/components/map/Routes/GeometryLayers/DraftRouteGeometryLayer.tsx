import { FC } from 'react';
import { selectEditedRouteData, useAppSelector } from '../../../../redux';
import { RouteGeometryLayer } from './RouteGeometryLayer';

export const DraftRouteGeometryLayer: FC = () => {
  const { geometry } = useAppSelector(selectEditedRouteData);

  if (!geometry) {
    return null;
  }

  return <RouteGeometryLayer geometry={geometry} isHighlighted />;
};
