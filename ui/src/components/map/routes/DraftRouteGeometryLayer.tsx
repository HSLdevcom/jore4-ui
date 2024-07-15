import { useAppSelector } from '../../../hooks';
import { selectEditedRouteData } from '../../../redux';
import { RouteGeometryLayer } from './RouteGeometryLayer';

export const DraftRouteGeometryLayer = (): React.ReactElement => {
  const { geometry } = useAppSelector(selectEditedRouteData);

  if (!geometry) {
    return <></>;
  }

  return <RouteGeometryLayer geometry={geometry} isHighlighted />;
};
