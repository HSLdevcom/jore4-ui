import { useAppSelector } from '../../../hooks';
import { selectEditedRouteData } from '../../../redux';
import { mapVehicleModeToRouteColor } from '../../../utils/colors';
import { RouteGeometryLayer } from './RouteGeometryLayer';

const SNAPPING_LINE_LAYER_ID = 'snapping-line';

export const DraftRouteGeometryLayer = (): JSX.Element => {
  const { geometry, lineInfo } = useAppSelector(selectEditedRouteData);

  if (!geometry) {
    return <></>;
  }

  const routeColor = mapVehicleModeToRouteColor(
    // If we have draft route geometry,
    // we must have set the line the route belongs to
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    lineInfo!.primary_vehicle_mode,
  );

  return (
    <RouteGeometryLayer
      layerId={SNAPPING_LINE_LAYER_ID}
      geometry={geometry}
      defaultColor={routeColor}
      isHighlighted
    />
  );
};
