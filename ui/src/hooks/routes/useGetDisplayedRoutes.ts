import { useEffect } from 'react';
import {
  GetRouteDetailsByIdsDocument,
  GetRouteDetailsByIdsQuery,
  GetRouteDetailsByIdsQueryVariables,
  GetRouteDetailsByLabelsDocument,
  GetRouteDetailsByLabelsQuery,
  GetRouteDetailsByLabelsQueryVariables,
} from '../../generated/graphql';
import { mapRouteResultToRoutes } from '../../graphql';
import {
  selectMapEditor,
  selectMapObservationDate,
  setDisplayedRouteIdsAction,
} from '../../redux';
import { useAppDispatch, useAppSelector } from '../redux';
import { useAsyncQuery } from '../useAsyncQuery';

export const useGetDisplayedRoutes = () => {
  const [getRouteDetailsByLabels] = useAsyncQuery<
    GetRouteDetailsByLabelsQuery,
    GetRouteDetailsByLabelsQueryVariables
  >(GetRouteDetailsByLabelsDocument);

  const [getRouteDetailsByIds] = useAsyncQuery<
    GetRouteDetailsByIdsQuery,
    GetRouteDetailsByIdsQueryVariables
  >(GetRouteDetailsByIdsDocument);

  const observationDate = useAppSelector(selectMapObservationDate);

  const dispatch = useAppDispatch();
  const { displayedRouteIds, initiallyDisplayedRouteIds } =
    useAppSelector(selectMapEditor);

  useEffect(() => {
    const updateDisplayedRoutes = async () => {
      if (!initiallyDisplayedRouteIds) {
        return [];
      }
      const routeDetailsResult = await getRouteDetailsByIds({
        route_ids: initiallyDisplayedRouteIds,
      });
      const routeDetails = mapRouteResultToRoutes(routeDetailsResult);

      if (!routeDetails.length) {
        return [];
      }

      const labels = routeDetails?.map((route) => route.label);

      const displayedRouteDetailsResult = await getRouteDetailsByLabels({
        labels,
        date: observationDate,
      });

      const displayedRouteDetails = mapRouteResultToRoutes(
        displayedRouteDetailsResult,
      );

      dispatch(
        setDisplayedRouteIdsAction(
          displayedRouteDetails.map((route) => route.route_id),
        ),
      );

      return displayedRouteDetails;
    };

    updateDisplayedRoutes();
  }, [
    getRouteDetailsByLabels,
    observationDate,
    dispatch,
    getRouteDetailsByIds,
    initiallyDisplayedRouteIds,
  ]);

  return { displayedRouteIds };
};
