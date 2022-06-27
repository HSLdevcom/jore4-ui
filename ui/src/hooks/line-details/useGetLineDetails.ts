import produce from 'immer';
import { groupBy } from 'lodash';
import { DateTime } from 'luxon';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  RouteDirectionEnum,
  RouteLine,
  RouteRoute,
  useGetHighestPriorityLineDetailsWithRoutesAsyncQuery,
  useGetLineDetailsWithRoutesByIdQuery,
  useGetLineValidityPeriodByIdAsyncQuery,
} from '../../generated/graphql';
import {
  mapHighestPriorityLineDetailsWithRoutesResult,
  mapLineDetailsWithRoutesResult,
  mapLineValidityPeriod,
} from '../../graphql';
import {
  constructActiveDateGqlFilter,
  constructDraftPriorityGqlFilter,
  constructLabelGqlFilter,
} from '../../utils';
import { useUrlQuery } from '../useUrlQuery';

const findHighestPriorityRoute = (routes: RouteRoute[]) =>
  routes.reduce((prev, curr) => (prev.priority > curr.priority ? prev : curr));

/** Returns highest priority routes filtered by given direction */
const filterRoutesByHighestPriorityAndDirection = (
  direction: RouteDirectionEnum,
  routes: RouteRoute[],
) => {
  const routesFilteredByDirection = routes.filter(
    (route) => route.direction === direction,
  );
  const routesGroupedByLabel = groupBy(routesFilteredByDirection, 'label');

  const highestPriorityRoutes = Object.keys(routesGroupedByLabel).map((key) =>
    findHighestPriorityRoute(routesGroupedByLabel[key]),
  );

  return highestPriorityRoutes;
};

const filterRoutesByHighestPriority = (lineRoutes: RouteRoute[]) => {
  const filteredOutboundRoutes = filterRoutesByHighestPriorityAndDirection(
    RouteDirectionEnum.Outbound,
    lineRoutes,
  );
  const filteredInboundRoutes = filterRoutesByHighestPriorityAndDirection(
    RouteDirectionEnum.Inbound,
    lineRoutes,
  );
  return [...filteredOutboundRoutes, ...filteredInboundRoutes];
};

const filterLineDetailsByDate = (line: RouteLine) => {
  const filteredRoutes = filterRoutesByHighestPriority(line?.line_routes);

  const filteredLine = produce(line, (draft) => {
    draft.line_routes = filteredRoutes;
  });

  return filteredLine;
};

/** Returns the initial observation date depending on the parameters. */
const getInitialDate = (
  validityStart?: DateTime | null,
  validityEnd?: DateTime | null,
) => {
  const isActiveToday =
    (!validityStart || validityStart <= DateTime.now().startOf('day')) &&
    (!validityEnd || validityEnd >= DateTime.now().startOf('day'));

  if (isActiveToday) {
    return DateTime.now().startOf('day');
  }
  return validityStart;
};

const constructLineDetailsGqlFilters = (
  line?: RouteLine,
  observationDate?: DateTime | null,
) => {
  const lineFilters = {
    ...constructLabelGqlFilter(line?.label),
    ...constructActiveDateGqlFilter(observationDate),
    ...constructDraftPriorityGqlFilter(line?.priority),
  };

  const lineRouteFilters = {
    ...constructActiveDateGqlFilter(observationDate),
    ...constructDraftPriorityGqlFilter(line?.priority),
  };

  const routeStopFilters = constructActiveDateGqlFilter(observationDate);

  return {
    lineFilters,
    lineRouteFilters,
    routeStopFilters,
  };
};

/** Gets the line details depending on query parameters. */
export const useGetLineDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryParams = useUrlQuery();
  const history = useHistory();

  const [getLineValidityPeriodByIdQuery] =
    useGetLineValidityPeriodByIdAsyncQuery();

  const [getHighestPriorityLineDetails] =
    useGetHighestPriorityLineDetailsWithRoutesAsyncQuery();

  const [line, setLine] = useState<RouteLine>();

  const observationDate = queryParams.observationDate
    ? DateTime.fromISO(queryParams.observationDate as string)
    : null;

  const lineDetailsResult = useGetLineDetailsWithRoutesByIdQuery({
    variables: { line_id: id },
  });

  /** Determines and sets date to query parameters if it's not there */
  const initializeObservationDate = async () => {
    if (!observationDate) {
      const result = await getLineValidityPeriodByIdQuery({ line_id: id });
      const lineDetails = mapLineValidityPeriod(result);
      if (lineDetails) {
        const initialDate = getInitialDate(
          lineDetails?.validity_start,
          lineDetails?.validity_end,
        );
        const updatedUrlQuery = produce(queryParams, (draft) => {
          if (initialDate?.isValid) {
            draft.observationDate = initialDate.toISODate();
          }
        });

        const queryString = qs.stringify(updatedUrlQuery);
        history.replace({
          search: `?${queryString}`,
        });
      }
    }
  };

  /** Fetches line details and filters results by observation date */
  const fetchLineDetails = async () => {
    if (lineDetailsResult?.data && observationDate?.isValid) {
      const lineDetails = mapLineDetailsWithRoutesResult(lineDetailsResult);

      const lineByDateResult = await getHighestPriorityLineDetails(
        constructLineDetailsGqlFilters(lineDetails, observationDate),
      );

      const lineByDate =
        mapHighestPriorityLineDetailsWithRoutesResult(lineByDateResult);

      const filteredLine = lineByDate
        ? filterLineDetailsByDate(lineByDate)
        : undefined;

      setLine(filteredLine);
    }
  };

  useEffect(() => {
    initializeObservationDate();
    fetchLineDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, queryParams.observationDate, lineDetailsResult]);

  return {
    line,
    observationDate,
  };
};
