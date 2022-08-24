import { useEffect } from 'react';
import {
  useGetRouteDetailsByIdsAsyncQuery,
  useGetRouteDetailsByLabelsAsyncQuery,
} from '../../generated/graphql';
import { mapRouteResultToRoutes } from '../../graphql';
import { selectMapEditor, setDisplayedRouteIdsAction } from '../../redux';
import { useAppDispatch, useAppSelector } from '../redux';
import { useObservationDateQueryParam } from '../urlQuery';

export const useGetDisplayedRoutes = () => {
  const [getRouteDetailsByLabels] = useGetRouteDetailsByLabelsAsyncQuery();
  const [getRouteDetailsByIds] = useGetRouteDetailsByIdsAsyncQuery();

  const { observationDate } = useObservationDateQueryParam();

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
