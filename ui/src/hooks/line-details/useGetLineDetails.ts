import produce from 'immer';
import groupBy from 'lodash/groupBy';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DisplayedRouteFragment,
  RouteDirectionEnum,
  RouteLine,
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
  buildActiveDateGqlFilter,
  buildDraftPriorityGqlFilter,
  buildLabelGqlFilter,
} from '../../utils';
import { getRouteLabelVariantText } from '../../utils/route';
import { useObservationDateQueryParam } from '../urlQuery';

const findHighestPriorityRoute = <TRoute extends DisplayedRouteFragment>(
  routes: TRoute[],
) =>
  routes.reduce((prev, curr) => (prev.priority > curr.priority ? prev : curr));

/** Returns highest priority routes filtered by given direction */
const filterRoutesByHighestPriorityAndDirection = <
  TRoute extends DisplayedRouteFragment,
>(
  direction: RouteDirectionEnum,
  routes: TRoute[],
): TRoute[] => {
  const routesFilteredByDirection = routes.filter(
    (route) => route.direction === direction,
  );
  const routesGroupedByLabelAndVariant = groupBy(
    routesFilteredByDirection,
    getRouteLabelVariantText,
  );

  const highestPriorityRoutes = Object.keys(routesGroupedByLabelAndVariant).map(
    (key) => findHighestPriorityRoute(routesGroupedByLabelAndVariant[key]),
  );

  return highestPriorityRoutes;
};

export const filterRoutesByHighestPriority = <
  TRoute extends DisplayedRouteFragment,
>(
  lineRoutes: TRoute[],
): TRoute[] => {
  // TODO: what if RouteDirectionEnum is not Inbound or Outbound?
  // In that case we are currently just filtering those routes out!
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

const buildLineDetailsGqlFilters = (
  line?: RouteLine,
  observationDate?: DateTime | null,
) => {
  const lineFilters = {
    ...buildLabelGqlFilter(line?.label),
    ...buildActiveDateGqlFilter(observationDate),
    ...buildDraftPriorityGqlFilter(line?.priority),
  };

  const lineRouteFilters = {
    ...buildActiveDateGqlFilter(observationDate),
    ...buildDraftPriorityGqlFilter(line?.priority),
  };

  const routeStopFilters = buildActiveDateGqlFilter(observationDate);

  return {
    lineFilters,
    lineRouteFilters,
    routeStopFilters,
  };
};

/** Gets the line details depending on query parameters. */
export const useGetLineDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { observationDate, setObservationDateToUrl } =
    useObservationDateQueryParam();

  const [getLineValidityPeriodByIdQuery] =
    useGetLineValidityPeriodByIdAsyncQuery();

  const [getHighestPriorityLineDetails] =
    useGetHighestPriorityLineDetailsWithRoutesAsyncQuery();

  const [line, setLine] = useState<RouteLine>();

  const lineDetailsResult = useGetLineDetailsWithRoutesByIdQuery({
    variables: { line_id: id },
  });

  /** Determines and sets date to query parameters if it's not there */
  const initializeObservationDate = useCallback(async () => {
    if (!observationDate) {
      const result = await getLineValidityPeriodByIdQuery({ line_id: id });
      const lineDetails = mapLineValidityPeriod(result);
      if (lineDetails) {
        const initialDate = getInitialDate(
          lineDetails?.validity_start,
          lineDetails?.validity_end,
        );

        if (initialDate?.isValid) {
          setObservationDateToUrl(initialDate, true);
        }
      }
    }
  }, [
    getLineValidityPeriodByIdQuery,
    id,
    observationDate,
    setObservationDateToUrl,
  ]);

  /** Fetches line details and filters results by observation date */
  const fetchLineDetails = useCallback(async () => {
    if (lineDetailsResult?.data && observationDate?.isValid) {
      const lineDetails = mapLineDetailsWithRoutesResult(lineDetailsResult);

      const lineByDateResult = await getHighestPriorityLineDetails(
        buildLineDetailsGqlFilters(lineDetails, observationDate),
      );

      const lineByDate =
        mapHighestPriorityLineDetailsWithRoutesResult(lineByDateResult);

      const filteredLine = lineByDate
        ? filterLineDetailsByDate(lineByDate)
        : undefined;

      setLine(filteredLine);
    }
  }, [getHighestPriorityLineDetails, lineDetailsResult, observationDate]);

  useEffect(() => {
    initializeObservationDate();
  }, [initializeObservationDate]);

  useEffect(() => {
    fetchLineDetails();
  }, [fetchLineDetails]);

  return {
    line,
  };
};
