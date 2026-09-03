import { gql, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getBusRoute, getTramRoute } from '../../../../../api/routing';
import {
  GetLinksWithStopsByExternalLinkIdsDocument,
  GetLinksWithStopsByExternalLinkIdsQuery,
  GetLinksWithStopsByExternalLinkIdsQueryVariables,
  InfraLinkMatchingFieldsFragment,
  ReusableComponentsVehicleModeEnum,
} from '../../../../../generated/graphql';
import {
  Operation,
  selectEditedRouteData,
  useAppSelector,
  useLoader,
} from '../../../../../redux';
import {
  MapMatchingNoSegmentError,
  showDangerToast,
} from '../../../../../utils';

const GQL_GET_LINKS_WITH_STOPS_BY_EXTERNAL_LINK_IDS = gql`
  query GetLinksWithStopsByExternalLinkIds($externalLinkIds: [String!]) {
    infrastructure_network_infrastructure_link(
      where: { external_link_id: { _in: $externalLinkIds } }
    ) {
      ...InfraLinkMatchingFields
      external_link_source
      scheduled_stop_points_located_on_infrastructure_link {
        ...RouteStopFields
      }
    }
  }

  fragment InfraLinkMatchingFields on infrastructure_network_infrastructure_link {
    external_link_id
    infrastructure_link_id
    shape
    direction
  }
`;

// Order the given infra links to match the order of the given external ids. Throws if there is no infra link
// present for a given external link id.
// NB: We cannot use sort on the infra link array, because some links might be traversed multiple times and thus
// have to be duplicated.
function orderInfraLinksByExternalLinkId<
  TLink extends InfraLinkMatchingFieldsFragment,
>(
  infraLinksWithStops: ReadonlyArray<TLink>,
  externalLinkIds: ReadonlyArray<string>,
) {
  return externalLinkIds.map((externalLinkId) => {
    const infraLinkWithStop = infraLinksWithStops.find(
      (link) => link.external_link_id === externalLinkId,
    );

    if (!infraLinkWithStop) {
      throw new Error(
        `Could not find link with stop for external link id ${externalLinkId}`,
      );
    }

    return infraLinkWithStop;
  });
}

function useFetchInfraLinksWithStopsByExternalIds() {
  const apollo = useApolloClient();

  return useCallback(
    async (externalLinkIds: ReadonlyArray<string>) => {
      // Retrieve the infra links from the external link ids returned by map-matching.
      // This will return the links in arbitrary order.
      const { data } = await apollo.query<
        GetLinksWithStopsByExternalLinkIdsQuery,
        GetLinksWithStopsByExternalLinkIdsQueryVariables
      >({
        query: GetLinksWithStopsByExternalLinkIdsDocument,
        variables: { externalLinkIds },
      });

      // Order the infra links to match the order of the route returned by map-matching
      return orderInfraLinksByExternalLinkId(
        data.infrastructure_network_infrastructure_link,
        externalLinkIds,
      );
    },
    [apollo],
  );
}

function useGetInfraLinksWithStopsForGeometry() {
  const { lineInfo, vehicleMode } = useAppSelector(selectEditedRouteData);
  const activeVehicleMode = lineInfo?.primary_vehicle_mode ?? vehicleMode;

  const fetchInfraLinksWithStopsByExternalIds =
    useFetchInfraLinksWithStopsByExternalIds();

  /**
   * Gets the infra links and the nearby stops that are along a line geometry
   * @param coordinates the list of coordinates in order along the line geometry. E.g. coordinates
   * of the snapping line.
   */
  return useCallback(
    async (geometry: GeoJSON.LineString) => {
      // Do map-matching for the given geometry
      const mapMatchingResult =
        activeVehicleMode === ReusableComponentsVehicleModeEnum.Tram
          ? await getTramRoute(geometry.coordinates)
          : await getBusRoute(geometry.coordinates);

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
      const infraLinksWithStops = orderedInfraLinksWithStops.map(
        (item, index) => ({
          ...item,
          is_traversal_forwards:
            mapMatchingResult.routes[0]?.paths[index]?.isTraversalForwards,
        }),
      );

      return {
        infraLinksWithStops,
        matchedGeometry: matchedRoute?.geometry,
      };
    },
    [activeVehicleMode, fetchInfraLinksWithStopsByExternalIds],
  );
}

export function useFetchInfraLinksWithStops() {
  const { t } = useTranslation();

  const { setIsLoading } = useLoader(Operation.FetchInfraLinksWithStops);

  const getInfraLinksWithStopsForGeometry =
    useGetInfraLinksWithStopsForGeometry();

  return useCallback(
    async (geometry: GeoJSON.LineString) => {
      setIsLoading(true);
      try {
        return await getInfraLinksWithStopsForGeometry(geometry);
      } catch (err) {
        if (err instanceof MapMatchingNoSegmentError) {
          showDangerToast(
            t(($) => $.errors.tooFarFromInfrastructureLink),
            'tooFarFromInfrastructureLink',
          );
        } else {
          setIsLoading(false);
          throw err;
        }
      } finally {
        setIsLoading(false);
      }

      return undefined;
    },
    [getInfraLinksWithStopsForGeometry, setIsLoading, t],
  );
}
