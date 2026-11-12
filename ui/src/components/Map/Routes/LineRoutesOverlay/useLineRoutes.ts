import orderBy from 'lodash/orderBy';
import { useEffect, useMemo } from 'react';
import {
  DisplayedRouteFragment,
  RouteDirectionEnum,
} from '../../../../generated/graphql';
import {
  selectSelectedRouteId,
  selectVisibleRouteIds,
  setSelectedRouteIdAction,
  setVisibleRouteIdsAction,
  useAppDispatch,
  useAppSelector,
} from '../../../../redux';
import { areEqual } from '../../../../utils';
import { useGetRoutesDisplayedInMap } from '../../Stops/utils/useGetRoutesDisplayedInMap';

const directionOrder: Partial<Record<RouteDirectionEnum, number>> = {
  [RouteDirectionEnum.Outbound]: 1,
  [RouteDirectionEnum.Inbound]: 2,
};

export function sortRoutes(
  routes: ReadonlyArray<DisplayedRouteFragment>,
): ReadonlyArray<DisplayedRouteFragment> {
  return orderBy(
    routes,
    [
      (route) => route.label,
      (route) => route.variant ?? 0,
      (route) => directionOrder[route.direction] ?? 99,
      // lodash compares values with < and >, which Temporal objects do not
      // support, so sort by the ISO string instead.
      (route) => route.validity_start?.toString(),
    ],
    ['asc', 'asc', 'asc', 'asc'],
  );
}

/**
 * Resolves which of the line's routes should be drawn on the map. Drops ids
 * that are no longer on the list (e.g. after a filter change) and falls back
 * to a default route when nothing on the list is visible.
 */
export function resolveVisibleRouteIds(
  routes: ReadonlyArray<DisplayedRouteFragment>,
  visibleRouteIds: ReadonlyArray<UUID>,
  selectedRouteId: UUID | undefined,
): ReadonlyArray<UUID> {
  const routeIds = routes.map((route) => route.route_id);
  const visibleInList = visibleRouteIds.filter((routeId) =>
    routeIds.includes(routeId),
  );

  if (visibleInList.length) {
    return visibleInList;
  }

  const defaultRouteId =
    selectedRouteId && routeIds.includes(selectedRouteId)
      ? selectedRouteId
      : routeIds.at(0);

  return defaultRouteId ? [defaultRouteId] : [];
}

/**
 * Lists the line's route variants for the map overlay and makes sure that one
 * of them is always drawn on the map when the user has not chosen otherwise.
 */
export function useLineRoutes() {
  const dispatch = useAppDispatch();
  const { displayedRoutes, loading } = useGetRoutesDisplayedInMap();
  const visibleRouteIds = useAppSelector(selectVisibleRouteIds);
  const selectedRouteId = useAppSelector(selectSelectedRouteId);

  const routes = useMemo(() => sortRoutes(displayedRoutes), [displayedRoutes]);

  useEffect(() => {
    // Without the loading guard the momentarily empty route list of a filter
    // change would reset the user's selections.
    if (loading) {
      return;
    }

    const resolvedVisibleRouteIds = resolveVisibleRouteIds(
      routes,
      visibleRouteIds,
      selectedRouteId,
    );

    if (!areEqual(resolvedVisibleRouteIds, visibleRouteIds)) {
      dispatch(setVisibleRouteIdsAction(resolvedVisibleRouteIds));
    }

    if (!selectedRouteId && resolvedVisibleRouteIds.length) {
      dispatch(setSelectedRouteIdAction(resolvedVisibleRouteIds[0]));
    }
  }, [dispatch, loading, routes, selectedRouteId, visibleRouteIds]);

  return { routes, loading };
}
