import { gql } from '@apollo/client';
import { produce } from 'immer';
import groupBy from 'lodash/groupBy';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import {
  LineDefaultFieldsFragment,
  LineWithRoutesUniqueFieldsFragment,
  RouteDirectionEnum,
  RouteUniqueFieldsFragment,
  RouteValidityFragment,
  useGetHighestPriorityLineDetailsWithRoutesLazyQuery,
  useGetLineDetailsByIdQuery,
  useGetLineValidityPeriodByIdLazyQuery,
} from '../../generated/graphql';
import { mapLineValidityPeriod } from '../../graphql';
import {
  buildActiveDateGqlFilter,
  buildDraftPriorityGqlFilter,
  buildLabelGqlFilter,
} from '../../utils';
import { getRouteLabelVariantText } from '../../utils/route';
import { useObservationDateQueryParam } from '../urlQuery';
import { useRequiredParams } from '../useRequiredParams';

const GQL_INFRASTRUCTURE_LINK_WITH_STOPS_FRAGMENT = gql`
  fragment infrastructure_link_with_stops on infrastructure_network_infrastructure_link {
    ...infrastructure_link_all_fields
    scheduled_stop_points_located_on_infrastructure_link(
      where: $routeStopFilters
    ) {
      ...scheduled_stop_point_all_fields
      other_label_instances {
        ...scheduled_stop_point_default_fields
      }
      scheduled_stop_point_in_journey_patterns {
        ...scheduled_stop_point_in_journey_pattern_all_fields
        journey_pattern {
          journey_pattern_id
          on_route_id
        }
      }
    }
  }
`;

const GQL_LINE_WITH_ROUTES_FRAGMENT = gql`
  fragment line_with_routes on route_line {
    ...line_all_fields
    line_routes(where: $lineRouteFilters) {
      ...route_with_infrastructure_links_with_stops_and_jps
    }
  }
`;

const GQL_GET_HIGHEST_PRIORITY_LINE_DETAILS_WITH_ROUTES = gql`
  query GetHighestPriorityLineDetailsWithRoutes(
    $lineFilters: route_line_bool_exp
    $lineRouteFilters: route_route_bool_exp
    $routeStopFilters: service_pattern_scheduled_stop_point_bool_exp
  ) {
    route_line(where: $lineFilters, order_by: { priority: desc }, limit: 1) {
      ...line_with_routes_unique_fields
    }
  }
`;

const findHighestPriorityRoute = <TRoute extends RouteValidityFragment>(
  routes: ReadonlyArray<TRoute>,
) =>
  routes.reduce((prev, curr) => (prev.priority > curr.priority ? prev : curr));

/** Returns highest priority routes filtered by given direction */
const filterRoutesByHighestPriorityAndDirection = <
  TRoute extends RouteUniqueFieldsFragment,
>(
  direction: RouteDirectionEnum,
  routes: ReadonlyArray<TRoute>,
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
  TRoute extends RouteUniqueFieldsFragment,
>(
  lineRoutes: ReadonlyArray<TRoute>,
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

const filterLineDetailsByDate = <
  TLine extends LineWithRoutesUniqueFieldsFragment,
>(
  line: TLine,
) => {
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
  line?: LineDefaultFieldsFragment,
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

export enum LineFetchError {
  LINE_MISSING_DEFAULT = 'LINE_MISSING_DEFAULT',
  LINE_NOT_VALID_FOR_DAY = 'LINE_NOT_VALID_FOR_DAY',
}

/** Gets the line details depending on query parameters. */
export const useGetLineDetails = () => {
  const { id } = useRequiredParams<{ id: string }>();

  const { observationDate, setObservationDateToUrl } =
    useObservationDateQueryParam();

  const [getLineValidityPeriodByIdQuery] =
    useGetLineValidityPeriodByIdLazyQuery();

  const [getHighestPriorityLineDetails] =
    useGetHighestPriorityLineDetailsWithRoutesLazyQuery();

  const [line, setLine] = useState<LineWithRoutesUniqueFieldsFragment>();
  const [lineError, setLineError] = useState<LineFetchError | null>(null);

  const lineDetailsResult = useGetLineDetailsByIdQuery({
    variables: { line_id: id },
  });

  /** Determines and sets date to query parameters if it's not there */
  const initializeObservationDate = useCallback(async () => {
    if (!observationDate) {
      const result = await getLineValidityPeriodByIdQuery({
        variables: { line_id: id },
      });
      const lineDetails = mapLineValidityPeriod(result);
      if (lineDetails) {
        const initialDate = getInitialDate(
          lineDetails?.validity_start,
          lineDetails?.validity_end,
        );

        if (initialDate?.isValid) {
          setObservationDateToUrl(initialDate, true);
        } else {
          setLineError(LineFetchError.LINE_NOT_VALID_FOR_DAY);
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
      const lineDetails = lineDetailsResult.data.route_line_by_pk ?? undefined;

      const lineByDateResult = await getHighestPriorityLineDetails({
        variables: buildLineDetailsGqlFilters(lineDetails, observationDate),
      });

      const lineByDate = lineByDateResult.data?.route_line?.[0] ?? undefined;
      if (lineDetails && !lineByDate) {
        setLineError(LineFetchError.LINE_NOT_VALID_FOR_DAY);
      }
      const filteredLine = lineByDate
        ? filterLineDetailsByDate(lineByDate)
        : undefined;

      setLine(filteredLine);

      return filteredLine;
    }

    return null;
  }, [getHighestPriorityLineDetails, lineDetailsResult, observationDate]);

  useEffect(() => {
    initializeObservationDate();
  }, [initializeObservationDate]);

  useEffect(() => {
    fetchLineDetails().then((filteredLine) => {
      if (filteredLine) {
        setLineError(null);
      }
    });
  }, [fetchLineDetails]);

  return {
    line,
    lineError,
  };
};
