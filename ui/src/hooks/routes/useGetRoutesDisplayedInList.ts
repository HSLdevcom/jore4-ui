import uniq from 'lodash/uniq';
import { useEffect, useMemo } from 'react';
import { LineWithRoutesUniqueFieldsFragment } from '../../generated/graphql';
import { QueryParameterName, useUrlQuery } from '../urlQuery/useUrlQuery';

/**
 * Query parameter hook for setting and getting displayed routes by their labels.
 */
export const useGetRoutesDisplayedInList = (
  line: LineWithRoutesUniqueFieldsFragment | undefined,
) => {
  const { setArrayToUrlQuery, getArrayFromUrlQuery } = useUrlQuery();

  const uniqueLineRouteLabels = uniq(
    line?.line_routes.map((route) => route.label),
  );

  /**
   * Sets routeLabels to URL query
   * Replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setDisplayedRoutesToUrl = (
    routeLabels: ReadonlyArray<string>,
    replace = true,
  ) => {
    setArrayToUrlQuery(
      { paramName: QueryParameterName.RouteLabels, value: routeLabels },
      { replace },
    );
  };

  // Memoize the actual value to prevent unnecessary updates
  const displayedRouteLabels = useMemo(() => {
    return getArrayFromUrlQuery(QueryParameterName.RouteLabels);
  }, [getArrayFromUrlQuery]);

  // If no route has been initially selected to display, show all line's routes
  // Set the default value to query params if route labels query param doesn't exist
  useEffect(() => {
    if (!displayedRouteLabels && uniqueLineRouteLabels.length !== 0) {
      setDisplayedRoutesToUrl(uniqueLineRouteLabels);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueLineRouteLabels]);

  const toggleDisplayedRoute = (routeLabel: string) => {
    if (displayedRouteLabels?.includes(routeLabel)) {
      setDisplayedRoutesToUrl(
        displayedRouteLabels.filter((label) => label !== routeLabel),
      );
    } else {
      setDisplayedRoutesToUrl([...(displayedRouteLabels ?? []), routeLabel]);
    }
  };

  return {
    setDisplayedRoutesToUrl,
    displayedRouteLabels,
    toggleDisplayedRoute,
  };
};
