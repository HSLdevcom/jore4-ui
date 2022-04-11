import produce from 'immer';
import { groupBy } from 'lodash';
import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';
import {
  RouteLine,
  RouteRoute,
  useGetActiveLineDetailsWithRoutesByDateQuery,
  useGetLineDetailsWithRoutesByIdQuery,
} from '../../generated/graphql';
import {
  mapActiveLineDetailsByDateResult,
  mapLineDetailsWithRoutesResult,
} from '../../graphql';
import { parseDate } from '../../time';
import {
  constructActiveDateFilterGql,
  constructDraftPriorityFilterGql,
  constructLabelFilterGql,
  mapToVariables,
} from '../../utils';
import { useUrlQuery } from '../useUrlQuery';

const filterLineDetailsByDate = (line: RouteLine) => {
  const filteredLineRoutes: RouteRoute[] = [];
  const grouped = groupBy(line?.line_routes, 'label');

  // Pick only the highest priority line route per label
  Object.keys(grouped).forEach((key) => {
    filteredLineRoutes.push(
      grouped[key].reduce((prev, curr) =>
        prev.priority > curr.priority ? prev : curr,
      ),
    );
  });

  const filteredLine = produce(line, (draft) => {
    draft.line_routes = filteredLineRoutes;
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
    ...constructLabelFilterGql(line?.label),
    ...constructActiveDateFilterGql(observationDate),
    ...constructDraftPriorityFilterGql(line?.priority),
  };

  const lineRouteFilters = {
    ...constructActiveDateFilterGql(observationDate),
    ...constructDraftPriorityFilterGql(line?.priority),
  };

  const routeStopFilters = constructActiveDateFilterGql(observationDate);

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

  const lineByDateResult = useGetActiveLineDetailsWithRoutesByDateQuery(
    constructLineDetailsGqlFilters(line, observationDate),
  );

  const lineByDate = mapActiveLineDetailsByDateResult(lineByDateResult);

  const filteredLine =
    !showAll && lineByDate ? filterLineDetailsByDate(lineByDate) : undefined;

  return {
    line: showAll ? line : filteredLine,
    observationDate,
  };
};
