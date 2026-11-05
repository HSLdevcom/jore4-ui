import { RouteStopFieldsFragment } from '../../../../../generated/graphql';
import { isStopInOperation } from '../../../../LinesAndRoutes/Common';

/**
 * Resolves the stops that are included in the journey pattern by default when the
 * route geometry is drawn. Stops that are not in operation are left out: they can
 * still be added to the route manually.
 * @param stops List of stops along route geometry
 * @param removedStopLabels List of stop labels that have been removed from the route
 */
export function getStopLabelsIncludedInRoute<
  TStop extends RouteStopFieldsFragment,
>(
  stops: ReadonlyArray<TStop>,
  removedStopLabels?: ReadonlyArray<string>,
): string[] {
  return stops
    .filter(
      (stop) =>
        !removedStopLabels?.includes(stop.label) && isStopInOperation(stop),
    )
    .map((stop) => stop.label);
}
