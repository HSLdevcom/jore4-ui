import { useCallback } from 'react';
import { getBusRoute } from '../api/routing';
import {
  GetStopsAlongInfrastructureLinksDocument,
  GetStopsAlongInfrastructureLinksQuery,
  GetStopsAlongInfrastructureLinksQueryVariables,
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkInfrastructureLink,
  MapExternalLinkIdsToInfraLinksWithStopsDocument,
  MapExternalLinkIdsToInfraLinksWithStopsQuery,
  MapExternalLinkIdsToInfraLinksWithStopsQueryVariables,
  ReusableComponentsVehicleModeEnum,
  RouteRoute,
  ServicePatternScheduledStopPoint,
} from '../generated/graphql';
import {
  getRouteStopLabels,
  InfrastructureLinkAlongRoute,
  mapGraphQLRouteToInfraLinks,
  mapInfraLinkWithStopsResult,
  mapStopResultToStops,
  mapStopToRouteStop,
  orderInfraLinksByExternalLinkId,
  RouteStop,
} from '../graphql';
import { mapGeoJSONtoFeature, sortStopsOnInfraLink } from '../utils';
import { useAsyncQuery } from './useAsyncQuery';
import { useFilterStops } from './useFilterStops';

interface ExtractScheduledStopPointIdsParams {
  orderedInfraLinksWithStops: InfrastructureNetworkInfrastructureLink[];
  infraLinks: InfrastructureLinkAlongRoute[];
  vehicleMode: ReusableComponentsVehicleModeEnum;
}

export type LineStringFeature = GeoJSON.Feature<GeoJSON.LineString>;

/**
 * Get RouteStops for stops along route geometry
 * @param stops List of stops along route geometry
 * @param removedStopLabels List of stop labels that have been removed from the route
 * @param routeId Id of the route which has this stop along it's route geometry
 * @returns List of RouteStops
 */
export const getRouteStops = (
  stops: ServicePatternScheduledStopPoint[],
  removedStopLabels?: string[],
  routeId?: UUID,
): RouteStop[] => {
  return stops.map((item) => {
    const belongsToRoute = !removedStopLabels?.includes(item.label);

    return mapStopToRouteStop(item, belongsToRoute, routeId);
  });
};

export const mapRouteStopsToStopLabels = (routeStops: RouteStop[]) =>
  routeStops
    .filter((item) => item.belongsToJourneyPattern)
    .map((item) => item.label);

export const useExtractRouteFromFeature = () => {
  const [fetchInfraLinksWithStopsByExternalIds] = useAsyncQuery<
    MapExternalLinkIdsToInfraLinksWithStopsQuery,
    MapExternalLinkIdsToInfraLinksWithStopsQueryVariables
  >(MapExternalLinkIdsToInfraLinksWithStopsDocument);

  const [fetchStopsAlongInfrastructureLinks] = useAsyncQuery<
    GetStopsAlongInfrastructureLinksQuery,
    GetStopsAlongInfrastructureLinksQueryVariables
  >(GetStopsAlongInfrastructureLinksDocument);

  const { filter } = useFilterStops();

  /**
   * Get stops that are along route geometry
   * and are visible to user (filtered by stop filters in map view)
   */
  const getFilteredStopIdsAlongRouteGeometry = useCallback(
    (orderedInfraLinksWithStops: InfrastructureNetworkInfrastructureLink[]) => {
      const unfilteredStops = orderedInfraLinksWithStops.flatMap(
        (link) => link.scheduled_stop_point_located_on_infrastructure_link,
      ) as ServicePatternScheduledStopPoint[];

      const stops = filter(unfilteredStops || []);

      return stops.map((stop) => stop.scheduled_stop_point_id);
    },
    [filter],
  );

  /**
   * Sort and filter the stop points
   * from a MapExternalLinkIdsToInfraLinksWithStops query result.
   */
  const extractScheduledStopPoints = useCallback(
    ({
      orderedInfraLinksWithStops,
      infraLinks,
      vehicleMode,
    }: ExtractScheduledStopPointIdsParams) => {
      // We need to filter all stops at once instead of filtering them
      // for each infrastructure link separately, because for example
      // separate versions of a stop might be on different infrastructure links,
      // and we only want all but the hightest priority instance to be filtered out.
      // Filtering for infra links separately could result in the same stop being
      // multiple times in the result set.
      const filteredStopIds = getFilteredStopIdsAlongRouteGeometry(
        orderedInfraLinksWithStops,
      );

      return orderedInfraLinksWithStops.flatMap((infraLinkWithStops, index) => {
        const isLinkTraversalForwards = infraLinks[index].isTraversalForwards;

        const eligibleStops =
          infraLinkWithStops.scheduled_stop_point_located_on_infrastructure_link
            // only include the ids of the stops
            // - suitable for the given vehicle mode AND
            // - traversable in the direction in which the route is going AND
            // - visible to the user after applying filters
            .filter((stop) => {
              const suitableForVehicleMode =
                !!stop.vehicle_mode_on_scheduled_stop_point.find(
                  (item) => item.vehicle_mode === vehicleMode,
                );

              const matchingDirection =
                stop.direction ===
                  InfrastructureNetworkDirectionEnum.Bidirectional ||
                (isLinkTraversalForwards &&
                  stop.direction ===
                    InfrastructureNetworkDirectionEnum.Forward) ||
                (!isLinkTraversalForwards &&
                  stop.direction ===
                    InfrastructureNetworkDirectionEnum.Backward);

              const visibleAfterFiltering = filteredStopIds.includes(
                stop.scheduled_stop_point_id,
              );

              return (
                suitableForVehicleMode &&
                matchingDirection &&
                visibleAfterFiltering
              );
            });

        const sortedEligibleStops = sortStopsOnInfraLink(
          eligibleStops,
          isLinkTraversalForwards,
        );

        return sortedEligibleStops;
      });
    },
    [getFilteredStopIdsAlongRouteGeometry],
  );

  const mapInfraLinksToFeature = useCallback(
    (infraLinks: InfrastructureLinkAlongRoute[]): LineStringFeature => {
      const coordinates: GeoJSON.Position[] = infraLinks.flatMap(
        (link, index) => {
          const isFirst = index === 0;
          const linkCoordinates = link.shape.coordinates;

          // Order coordinates properly

          const shouldReverseCoordinates =
            linkCoordinates.length && !link.isTraversalForwards;

          // TODO: Could be optimized since only first and last coordinates are being used
          const featureCoordinates = shouldReverseCoordinates
            ? [...linkCoordinates].reverse()
            : linkCoordinates;

          // To simplify the path drawn,
          // remove points in the middle of the infrastructure link
          const firstPoint = featureCoordinates[0];
          const lastPoint = featureCoordinates[featureCoordinates.length - 1];

          const pointsToDraw = isFirst ? [firstPoint, lastPoint] : [lastPoint];

          // Remove z-coordinate
          return pointsToDraw.map(
            (coordinate: number[]) =>
              coordinate.slice(0, 2) as GeoJSON.Position,
          );
        },
      );

      return mapGeoJSONtoFeature({ type: 'LineString', coordinates });
    },
    [],
  );

  const getInfraLinksWithStopsForCoordinates = useCallback(
    async (coordinates: GeoJSON.Position[]) => {
      const routeResponse = await getBusRoute(coordinates);

      const externalLinkIds = routeResponse.routes[0]?.paths?.map(
        (item) => item.externalLinkRef.externalLinkId,
      );

      // Retrieve the infra links from the external link ids returned by map-matching.
      // This will return the links in arbitrary order.
      const infraLinksWithStopsResponse =
        await fetchInfraLinksWithStopsByExternalIds({
          externalLinkIds,
        });

      const infraLinksWithStops = mapInfraLinkWithStopsResult(
        infraLinksWithStopsResponse,
      );

      if (!infraLinksWithStops) {
        throw new Error("could not fetch route's infra links");
      }

      // Order the infra links to match the order of the route returned by map-matching
      const orderedInfraLinksWithStops = orderInfraLinksByExternalLinkId(
        infraLinksWithStops,
        externalLinkIds,
      );

      // Create the list of links used for route creation
      const infraLinks: InfrastructureLinkAlongRoute[] =
        orderedInfraLinksWithStops.map((item, index) => ({
          infrastructureLinkId: item.infrastructure_link_id,
          isTraversalForwards:
            routeResponse.routes[0]?.paths[index]?.isTraversalForwards,
          shape: item.shape,
        }));

      return {
        infraLinks,
        orderedInfraLinksWithStops,
        geometry: routeResponse?.routes?.[0]?.geometry,
      };
    },

    [fetchInfraLinksWithStopsByExternalIds],
  );

  const getRemovedStopLabels = useCallback(
    async (infrastructureLinkIds: UUID[], currentStopLabels: string[]) => {
      const stopsResult = await fetchStopsAlongInfrastructureLinks({
        infrastructure_link_ids: infrastructureLinkIds,
      });

      return mapStopResultToStops(stopsResult)
        .map((item) => item.label)
        .filter((stop) => !currentStopLabels.includes(stop));
    },

    [fetchStopsAlongInfrastructureLinks],
  );

  const getOldRouteGeometryVariables = useCallback(
    (
      stateStops: RouteStop[],
      stateInfraLinks: InfrastructureLinkAlongRoute[] | undefined,
      baseRoute?: RouteRoute,
    ) => {
      const previouslyEditedRouteStops = mapRouteStopsToStopLabels(stateStops);
      const previouslyEditedRouteInfrastructureLinks = stateInfraLinks || [];

      // If we are editing existing route and it has not been edited yet,
      // extract and return stops and infra links from the original route
      if (
        (!previouslyEditedRouteStops.length ||
          !previouslyEditedRouteInfrastructureLinks.length) &&
        baseRoute
      ) {
        return {
          oldStopLabels: getRouteStopLabels(baseRoute),
          oldInfraLinks: mapGraphQLRouteToInfraLinks(baseRoute),
        };
      }

      // If route has been edited, return edited route's stops and infra links
      return {
        oldStopLabels: previouslyEditedRouteStops,
        oldInfraLinks: previouslyEditedRouteInfrastructureLinks,
      };
    },
    [],
  );

  return {
    extractScheduledStopPoints,
    mapInfraLinksToFeature,
    getInfraLinksWithStopsForCoordinates,
    getRemovedStopLabels,
    getRouteStops,
    getOldRouteGeometryVariables,
    mapRouteStopsToStopLabels,
    getFilteredStopIdsAlongRouteGeometry,
  };
};
