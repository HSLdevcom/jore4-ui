import produce from 'immer';
import { groupBy } from 'lodash';
import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';
import {
  RouteDirectionEnum,
  RouteLine,
  RouteRoute,
  useGetHighestPriorityLineDetailsWithRoutesQuery,
  useGetLineDetailsWithRoutesByIdQuery,
} from '../../generated/graphql';
import {
  mapHighestPriorityLineDetailsWithRoutesResult,
  mapLineDetailsWithRoutesResult,
} from '../../graphql';
import { parseDate } from '../../time';
import {
  constructActiveDateGqlFilter,
  constructDraftPriorityGqlFilter,
  constructLabelGqlFilter,
  mapToVariables,
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
  selectedISODate: string,
  validityStart?: DateTime | null,
  validityEnd?: DateTime | null,
) => {
  if (selectedISODate) {
    return parseDate(selectedISODate);
  }

  const isActiveToday =
    validityStart &&
    validityStart <= DateTime.now() &&
    (!validityEnd || validityEnd >= DateTime.now());

  if (isActiveToday) {
    // DateTime.now() triggers infinite re-renders, so need to doublecast it
    return DateTime.fromISO(DateTime.now().toISODate());
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
    variables: {
      lineFilters,
      lineRouteFilters,
      routeStopFilters,
    },
  };
};

/** Gets the line details depending on query parameters. */
export const useGetLineDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryParams = useUrlQuery();

  const [selectedDate, showAll] = [
    queryParams.selectedDate as string,
    queryParams.showAll === 'true',
  ];

  const lineDetailsResult = useGetLineDetailsWithRoutesByIdQuery(
    mapToVariables({ line_id: id }),
  );

  const line = mapLineDetailsWithRoutesResult(lineDetailsResult);
  const observationDate = showAll
    ? undefined
    : getInitialDate(selectedDate, line?.validity_start, line?.validity_end);

  const lineByDateResult = useGetHighestPriorityLineDetailsWithRoutesQuery(
    constructLineDetailsGqlFilters(line, observationDate),
  );

  const lineByDate =
    mapHighestPriorityLineDetailsWithRoutesResult(lineByDateResult);

  const filteredLine =
    !showAll && lineByDate ? filterLineDetailsByDate(lineByDate) : undefined;

  return {
    line: showAll ? line : filteredLine,
    observationDate,
  };
};
