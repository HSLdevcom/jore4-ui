import {
  QueryClosestLinkDocument,
  QueryClosestLinkQuery,
  QueryClosestLinkQueryVariables,
  QueryPointDirectionOnLinkDocument,
  QueryPointDirectionOnLinkQuery,
  QueryPointDirectionOnLinkQueryVariables,
} from '../../generated/graphql';
import {
  mapClosestLinkResult,
  mapGetPointDirectionOnLinkResult,
} from '../../graphql';
import { Point } from '../../types';
import {
  DirectionNotResolvedError,
  LinkNotResolvedError,
  mapPointToGeoJSON,
} from '../../utils';
import { useAsyncQuery } from '../useAsyncQuery';

interface Params {
  stopLocation: Point;
  maxSearchDistance?: number;
}

export const useGetStopLinkAndDirection = () => {
  const [fetchClosestLink] = useAsyncQuery<
    QueryClosestLinkQuery,
    QueryClosestLinkQueryVariables
  >(QueryClosestLinkDocument);
  const [fetchStopDirection] = useAsyncQuery<
    QueryPointDirectionOnLinkQuery,
    QueryPointDirectionOnLinkQueryVariables
  >(QueryPointDirectionOnLinkDocument);

  const getStopLinkAndDirection = async ({
    stopLocation,
    maxSearchDistance = 50,
  }: Params) => {
    const locationGeoJson = mapPointToGeoJSON(stopLocation);

    // fetch the closest link to the stop location
    const closestLinkResult = await fetchClosestLink({
      point: locationGeoJson,
    });
    const closestLinkId = mapClosestLinkResult(closestLinkResult);

    if (!closestLinkId) {
      throw new LinkNotResolvedError(
        closestLinkResult.error,
        `Could not resolve closest link to point ${stopLocation}`,
      );
    }

    // fetch the direction for the link
    const stopDirectionResult = await fetchStopDirection({
      point_of_interest: locationGeoJson,
      infrastructure_link_uuid: closestLinkId,
      point_max_distance_in_meters: maxSearchDistance,
    });
    const direction = mapGetPointDirectionOnLinkResult(stopDirectionResult);

    if (!direction) {
      throw new DirectionNotResolvedError(
        stopDirectionResult.error,
        `Could not resolve direction for link ${closestLinkId}`,
      );
    }

    return {
      closestLinkId,
      direction,
    };
  };

  return [getStopLinkAndDirection];
};
