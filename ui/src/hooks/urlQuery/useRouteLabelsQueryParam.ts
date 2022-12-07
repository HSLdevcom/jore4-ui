import { useMemo } from 'react';
import { QueryParameterName, useUrlQuery } from './useUrlQuery';

/**
 * Query parameter hook for setting and getting displayed routes by their labels.
 */
export const useRouteLabelsQueryParam = () => {
  const { setArrayToUrlQuery, getArrayFromUrlQuery } = useUrlQuery();

  /**
   * Sets routeLabels to URL query
   * Replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setDisplayedRoutesToUrl = (routeLabels: string[], replace = true) => {
    setArrayToUrlQuery(
      { paramName: QueryParameterName.RouteLabels, value: routeLabels },
      { replace },
    );
  };

  // Memoize the actual value to prevent unnecessary updates
  const displayedRouteLabels = useMemo(() => {
    return getArrayFromUrlQuery(QueryParameterName.RouteLabels);
  }, [getArrayFromUrlQuery]);

  const toggleDisplayedRoute = (routeLabel: string) => {
    if (displayedRouteLabels?.includes(routeLabel)) {
      setDisplayedRoutesToUrl(
        displayedRouteLabels.filter((label) => label !== routeLabel),
      );
    } else {
      setDisplayedRoutesToUrl([...(displayedRouteLabels || []), routeLabel]);
    }
  };

  return {
    setDisplayedRoutesToUrl,
    displayedRouteLabels,
    toggleDisplayedRoute,
  };
};
