import { useAppSelector } from '../../../hooks';
import { selectEditedRouteData } from '../../../redux';
import { RouteGeometryLayer } from './RouteGeometryLayer';

const SNAPPING_LINE_LAYER_ID = 'snapping-line';

export const DraftRouteGeometryLayer = (): JSX.Element => {
  const { geometry } = useAppSelector(selectEditedRouteData);

  if (!geometry) {
    return <></>;
  }

  return (
    <RouteGeometryLayer
      layerId={SNAPPING_LINE_LAYER_ID}
      geometry={geometry}
      isHighlighted
    />
  );
};
