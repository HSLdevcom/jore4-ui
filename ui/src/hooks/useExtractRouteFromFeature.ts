import { partialRight } from 'lodash';
import flow from 'lodash/flow';
import { useCallback } from 'react';
import { getBusRoute } from '../api/routing';
import {
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkInfrastructureLink,
  ReusableComponentsVehicleModeEnum,
  RouteDefaultFieldsWithLineFragment,
  RouteRoute,
  RouteValidityFragment,
  ServicePatternScheduledStopPoint,
  useGetLinksWithStopsByExternalLinkIdsAsyncQuery,
  useGetStopsAlongInfrastructureLinksAsyncQuery,
} from '../generated/graphql';
import {
  getRouteStopLabels,
  mapInfraLinkWithStopsResult,
  mapRouteToInfraLinksAlongRoute,
  mapStopResultToStops,
  mapStopToRouteStop,
  orderInfraLinksByExternalLinkId,
  RouteInfraLink,
  RouteStop,
} from '../graphql';
import { doValiditiesOverlap } from '../time';
import { Priority } from '../types/Priority';
import { mapGeoJSONtoFeature } from '../utils';
import { useFilterStops } from './useFilterStops';

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
  const [fetchLinksWithStopsByExternalLinkIds] =
    useGetLinksWithStopsByExternalLinkIdsAsyncQuery();
  const [fetchStopsAlongInfrastructureLinks] =
    useGetStopsAlongInfrastructureLinksAsyncQuery();

  const { filter } = useFilterStops();

  /**
   * Get stops that are along route geometry
   * and are visible to user (filtered by stop filters in map view)
   */
  const getFilteredStopIdsAlongRouteGeometry = useCallback(
    (infraLinksWithStops: RouteInfraLink[]) => {
      const unfilteredStops = infraLinksWithStops.flatMap(
        (link) => link.scheduled_stop_points_located_on_infrastructure_link,
      ) as ServicePatternScheduledStopPoint[];

      const stops = filter(unfilteredStops || []);

      return stops.map((stop) => stop.scheduled_stop_point_id);
    },
    [filter],
  );

  const mapInfraLinksToFeature = useCallback(
    (infraLinks: RouteInfraLink[]): LineStringFeature => {
      const coordinates: GeoJSON.Position[] = infraLinks.flatMap(
        (link, index) => {
          const isFirst = index === 0;
          const linkCoordinates = link.shape.coordinates;

          // Order coordinates properly

          const shouldReverseCoordinates =
            linkCoordinates.length && !link.is_traversal_forwards;

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

  const fetchInfraLinksWithStopsByExternalIds = useCallback(
    async (externalLinkIds: string[]) => {
      // Retrieve the infra links from the external link ids returned by map-matching.
      // This will return the links in arbitrary order.
      const infraLinksWithStopsResponse =
        await fetchLinksWithStopsByExternalLinkIds({
          externalLinkIds,
        });
      const unorderedInfraLinksWithStops = mapInfraLinkWithStopsResult(
        infraLinksWithStopsResponse,
      );
      if (!unorderedInfraLinksWithStops) {
        throw new Error("could not fetch route's infra links");
      }

      // Order the infra links to match the order of the route returned by map-matching
      const orderedInfraLinksWithStops = orderInfraLinksByExternalLinkId(
        unorderedInfraLinksWithStops,
        externalLinkIds,
      );

      return orderedInfraLinksWithStops;
    },
    [fetchLinksWithStopsByExternalLinkIds],
  );

  /**
   * Gets the infra links and the nearby stops that are along a line geometry
   * @param coordinates the list of coordinates in order along the line geometry. E.g. coordinates
   * of the snapping line.
   */
  const getInfraLinksWithStopsForGeometry = useCallback(
    async (geometry: GeoJSON.LineString) => {
      // Do map-matching for the given geometry
      const mapMatchingResult = await getBusRoute(geometry.coordinates);
      const matchedRoute = mapMatchingResult.routes[0];

      // Collect all the infra links' external ids, in order
      const externalLinkIds = matchedRoute?.paths?.map(
        (item) => item.externalLinkRef.externalLinkId,
      );

      // Retrieve the infra links from the external link ids returned by map-matching.
      // This returns the infra links in order
      const orderedInfraLinksWithStops =
        await fetchInfraLinksWithStopsByExternalIds(externalLinkIds);

      // Enrich the infra link with some routing data
      const infraLinksWithStops: RouteInfraLink[] =
        orderedInfraLinksWithStops.map((item, index) => ({
          ...item,
          is_traversal_forwards:
            mapMatchingResult.routes[0]?.paths[index]?.isTraversalForwards,
        }));

      return {
        infraLinksWithStops,
        matchedGeometry: matchedRoute?.geometry,
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
      stateInfraLinks: RouteInfraLink[] | undefined,
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
          oldInfraLinks: mapRouteToInfraLinksAlongRoute(baseRoute),
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

  /**
   * Filters stops that are on the correct side of the road for the route
   * @param stops list of stops on a single infra link
   * @param isTraversalForwards the traversal direction of the route along the link
   */
  const filterStopsByTraversalCompatibility = useCallback(
    (
      stops: ServicePatternScheduledStopPoint[],
      isTraversalForwards: boolean,
    ) => {
      return stops.filter((stop) => {
        return (
          stop.direction === InfrastructureNetworkDirectionEnum.Bidirectional ||
          (isTraversalForwards &&
            stop.direction === InfrastructureNetworkDirectionEnum.Forward) ||
          (!isTraversalForwards &&
            stop.direction === InfrastructureNetworkDirectionEnum.Backward)
        );
      });
    },

    [],
  );

  /**
   * Filters stops that are compatible with the route's vehicle mode
   * @param stops list of stops
   * @param vehicleMode the vehicle mode of the route
   */
  const filterStopsByVehicleMode = (
    stops: ServicePatternScheduledStopPoint[],
    vehicleMode: ReusableComponentsVehicleModeEnum,
  ) => {
    return stops.filter((stop) => {
      return stop.vehicle_mode_on_scheduled_stop_point.some(
        (item) => item.vehicle_mode === vehicleMode,
      );
    });
  };

  /**
   * Filters stops that have an overlapping validity period with the route
   * @param stops list of stops
   * @param routeValidity the validity period of the route
   */
  const filterStopsByValidityPeriod = (
    stops: ServicePatternScheduledStopPoint[],
    routeValidity: RouteValidityFragment,
  ) => {
    return stops.filter((stop) => {
      return doValiditiesOverlap(routeValidity, stop);
    });
  };

  /**
   * Checks whether a stop instance is along a route's geometry
   * @param stop stop instance
   * @param routeInfraLinks all the infra links along the route
   */
  const isStopAlongInfraLinks = (
    stop: ServicePatternScheduledStopPoint,
    routeInfraLinks: InfrastructureNetworkInfrastructureLink[],
  ) =>
    routeInfraLinks.some(
      (link) =>
        link.infrastructure_link_id === stop.located_on_infrastructure_link_id,
    );

  /**
   * Filters stops that only have same-label instances along the route.
   * We don't allow stops that may have active instances outside or the route geometry
   * @param stops list of stops
   * @param routeValidity the validity period of the route
   * @param routeInfraLinks all the infra links along the route
   */
  const filterStopsByInstancesAlongGeometry = (
    stops: ServicePatternScheduledStopPoint[],
    routeValidity: RouteValidityFragment,
    routeInfraLinks: InfrastructureNetworkInfrastructureLink[],
  ) => {
    return stops.filter((stop) => {
      // We always allow draft stops along routes, no integrity checks are done
      if (stop.priority === Priority.Draft) {
        return true;
      }

      const stopInstances = stop.other_label_instances;
      return stopInstances.every((instance) => {
        // For the stop instance itself, no integrity checks are done
        if (instance.scheduled_stop_point_id === stop.scheduled_stop_point_id) {
          return true;
        }

        // For the stop's other instances that are drafts, no integrity checks are done
        if (instance.priority === Priority.Draft) {
          return true;
        }

        // For the stop's other instances that are not valid during the route's validity period,
        // no integrity checks are done
        if (!doValiditiesOverlap(routeValidity, instance)) {
          return true;
        }

        // For other, non-draft instances we verify that they are also along the same route
        return isStopAlongInfraLinks(instance, routeInfraLinks);
      });
    });
  };

  /**
   * Removes all duplicate labeled consecutive stops from the list
   * This is used for example removing different versions of stops from the
   * journey pattern list where only the labels are shown
   */
  const filterDistinctConsecutiveRouteStops = (stops: RouteStop[]) =>
    stops.filter((route, index) => stops[index - 1]?.label !== route.label);

  /**
   * Finds all the stops along a route's geometry that are eligible to be part of the journey pattern
   * - only keeps stops that are on the correct side of the road
   * - only keeps stops that are compatible with the route's vehicle mode
   * - only keeps stops that are valid during the route's validity period
   * - for draft routes, no journey pattern integrity checks are done
   * - for non-draft routes, we verify that all stops' other instances are also along the same route
   * We don't check/filter however that:
   * - there are consecutive duplicate instances of the same stop along the route geometry (e.g. A-B1-B2-C)
   *   -> these could be filtered out in the lists. However probably they should all be marker somehow on the map
   * - there are stops that have non-neighboring instances along the route geometry (e.g. A-B1-C-B2-D)
   *   -> this journey pattern would actually be valid if "C" is excluded from it. So either "B" or
   *      "C" stops should be excluded from the journey pattern, but the choise is up to the user
   * - we don't check whether the result stops are actually showing up on the map.
   *   -> the stops visible on the map are controlled by the user and should not affect the list of eligible stops
   * @param infraLinksWithStops: list of infra links (in order) with the stops on them
   * @param routeMetadata: metadata about the edited route (e.g. vehicle mode, validity period)
   */
  const extractJourneyPatternCandidateStops = (
    infraLinksWithStops: RouteInfraLink[],
    routeMetadata: RouteDefaultFieldsWithLineFragment,
  ) => {
    // getting the (ordered) list of all the stops that are along the infra links,
    // prefiltered by route compatibility
    const filteredStops = infraLinksWithStops.flatMap((infraLinkWithStops) => {
      const isTraversalForwards = infraLinkWithStops.is_traversal_forwards;
      const linkStops =
        infraLinkWithStops.scheduled_stop_points_located_on_infrastructure_link;
      const vehicleMode = routeMetadata.route_line.primary_vehicle_mode;
      return flow(
        partialRight(filterStopsByTraversalCompatibility, isTraversalForwards),
        partialRight(filterStopsByVehicleMode, vehicleMode),
        partialRight(filterStopsByValidityPeriod, routeMetadata),
        partialRight(sortStopsOnInfraLink, isTraversalForwards),
      )(linkStops);
    });

    // for draft routes, we don't check the integrity of the journey pattern
    // e.g. are all the stop instances along the route and in the correct order
    if (routeMetadata.priority === Priority.Draft) {
      return filteredStops;
    }

    // checking the integrity of the journey pattern
    return flow(
      partialRight(filterStopsByInstancesAlongGeometry, infraLinksWithStops),
    )(filteredStops);
  };

  return {
    mapInfraLinksToFeature,
    getInfraLinksWithStopsForGeometry,
    getRemovedStopLabels,
    getRouteStops,
    getOldRouteGeometryVariables,
    mapRouteStopsToStopLabels,
    getFilteredStopIdsAlongRouteGeometry,
    extractJourneyPatternCandidateStops,
    filterDistinctConsecutiveRouteStops,
  };
};
