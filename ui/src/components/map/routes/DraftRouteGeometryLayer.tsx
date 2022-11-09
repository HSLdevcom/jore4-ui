import { useAppSelector } from '../../../hooks';
import { selectEditedRouteData } from '../../../redux';
import { RouteGeometryLayer } from './RouteGeometryLayer';

export const DraftRouteGeometryLayer = (): JSX.Element => {
  const { geometry } = useAppSelector(selectEditedRouteData);

  if (!geometry) {
    return <></>;
  }

  return <RouteGeometryLayer geometry={geometry} isHighlighted />;
};
