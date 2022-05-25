import { useCallback } from 'react';
import { getBusRoute } from '../api/routing';
import {
  GetStopsAlongInfrastructureLinksDocument,
  GetStopsAlongInfrastructureLinksQuery,
  GetStopsAlongInfrastructureLinksQueryVariables,
  InfrastructureNetworkDirectionEnum,
  MapExternalLinkIdsToInfraLinksWithStopsDocument,
  MapExternalLinkIdsToInfraLinksWithStopsQuery,
  MapExternalLinkIdsToInfraLinksWithStopsQueryVariables,
  ReusableComponentsVehicleModeEnum,
  RouteRoute,
} from '../generated/graphql';
import {
  getRouteStopLabels,
  InfrastructureLinkAlongRoute,
  mapGetStopsResult,
  mapGraphQLRouteToInfraLinks,
  orderInfraLinksByExternalLinkId,
} from '../graphql';
import { RouteStop } from '../redux';
import { mapGeoJSONtoFeature } from '../utils';
import { useAsyncQuery } from './useAsyncQuery';

interface ExtractScheduledStopPointIdsParams {
  orderedInfraLinksWithStops: MapExternalLinkIdsToInfraLinksWithStopsQuery['infrastructure_network_infrastructure_link'];
  infraLinks: InfrastructureLinkAlongRoute[];
  vehicleMode: ReusableComponentsVehicleModeEnum;
}

export type LineStringFeature = GeoJSON.Feature<GeoJSON.LineString>;

export const getRouteStops = (
  stopLabels: string[],
  removedStopLabels?: string[],
): RouteStop[] => {
  return stopLabels.map((item) => ({
    label: item,
    belongsToRoute: !removedStopLabels?.includes(item),
  }));
};

export const useExtractRouteFromFeature = () => {
  const [fetchInfraLinksWithStopsByExternalIds] = useAsyncQuery<
    MapExternalLinkIdsToInfraLinksWithStopsQuery,
    MapExternalLinkIdsToInfraLinksWithStopsQueryVariables
  >(MapExternalLinkIdsToInfraLinksWithStopsDocument);

  const [fetchStopsAlongInfrastructureLinks] = useAsyncQuery<
    GetStopsAlongInfrastructureLinksQuery,
    GetStopsAlongInfrastructureLinksQueryVariables
  >(GetStopsAlongInfrastructureLinksDocument);

  const mapRouteStopsToStopLabels = (routeStops: RouteStop[]) =>
    routeStops.filter((item) => item.belongsToRoute).map((item) => item.label);

  /**
   * Sort and filter the stop point labels
   * from a MapExternalLinkIdsToInfraLinksWithStops query result.
   */
  const extractScheduledStopPointLabels = useCallback(
    ({
      orderedInfraLinksWithStops,
      infraLinks,
      vehicleMode,
    }: ExtractScheduledStopPointIdsParams) =>
      orderedInfraLinksWithStops.flatMap((infraLinkWithStops, index) => {
        const isLinkTraversalForwards = infraLinks[index].isTraversalForwards;

        return (
          infraLinkWithStops.scheduled_stop_point_located_on_infrastructure_link
            // only include the ids of the stops
            // - suitable for the given vehicle mode AND
            // - traversable in the direction in which the route is going
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

              return suitableForVehicleMode && matchingDirection;
            })
            // sort the stops on the same link according to the link traversal direction
            .sort((stop1, stop2) =>
              isLinkTraversalForwards
                ? stop1.relative_distance_from_infrastructure_link_start -
                  stop2.relative_distance_from_infrastructure_link_start
                : stop2.relative_distance_from_infrastructure_link_start -
                  stop1.relative_distance_from_infrastructure_link_start,
            )
            .map((stop) => stop.label)
        );
      }),
    [],
  );

  const extractCoordinatesFromFeatures = useCallback(
    (features: LineStringFeature[]) => {
      const addedFeatureIndex = features.length - 1;
      const routeId = String(addedFeatureIndex);
      const { coordinates } = features[addedFeatureIndex].geometry;

      return { routeId, coordinates };
    },
    [],
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

      const infraLinksWithStops =
        infraLinksWithStopsResponse.data
          ?.infrastructure_network_infrastructure_link;

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

      return mapGetStopsResult(stopsResult)
        ?.map((item) => item.label)
        .filter((stop) => !currentStopLabels.includes(stop));
    },

    [fetchStopsAlongInfrastructureLinks],
  );

  const getOldRouteGeometryVariables = useCallback(
    (
      stateStops: RouteStop[],
      stateInfraLinks: InfrastructureLinkAlongRoute[] | undefined,
      routes: RouteRoute[],
      extractFromExistingRoute: boolean,
    ) => {
      const previouslyEditedRouteStops = mapRouteStopsToStopLabels(stateStops);
      const previouslyEditedRouteInfrastructureLinks = stateInfraLinks || [];

      // If we are editing existing route and it has not been edited yet,
      // extract and return stops and infra links from the original route
      if (
        (!previouslyEditedRouteStops.length ||
          !previouslyEditedRouteInfrastructureLinks.length) &&
        extractFromExistingRoute
      ) {
        return {
          oldStopLabels: routes.flatMap((route) => getRouteStopLabels(route)),
          oldInfraLinks: mapGraphQLRouteToInfraLinks(routes[0]),
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
    extractScheduledStopPointLabels,
    mapInfraLinksToFeature,
    extractCoordinatesFromFeatures,
    getInfraLinksWithStopsForCoordinates,
    getRemovedStopLabels,
    getRouteStops,
    getOldRouteGeometryVariables,
    mapRouteStopsToStopLabels,
  };
};
