import { useContext, useEffect } from 'react';
import { MapFilterContext } from '../../context/MapFilter';
import {
  GetRouteDetailsByIdsDocument,
  GetRouteDetailsByIdsQuery,
  GetRouteDetailsByIdsQueryVariables,
  GetRouteDetailsByLabelsDocument,
  GetRouteDetailsByLabelsQuery,
  GetRouteDetailsByLabelsQueryVariables,
} from '../../generated/graphql';
import { mapRoutesDetailsResult } from '../../graphql';
import { selectMapEditor, setDisplayedRouteIdsAction } from '../../redux';
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

  const {
    state: { observationDate },
  } = useContext(MapFilterContext);

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
      const routeDetails = mapRoutesDetailsResult(routeDetailsResult);

      if (!routeDetails.length) {
        return [];
      }

      const labels = routeDetails?.map((route) => route.label);

      const displayedRouteDetailsResult = await getRouteDetailsByLabels({
        labels,
        date: observationDate,
      });

      const displayedRouteDetails = mapRoutesDetailsResult(
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
