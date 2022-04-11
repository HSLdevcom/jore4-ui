import produce from 'immer';
import _ from 'lodash';
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
import { mapToVariables } from '../../utils';
import { useUrlQuery } from '../useUrlQuery';

const filterLineDetailsByDate = (line: RouteLine) => {
  const filteredLineRoutes: RouteRoute[] = [];
  const grouped = _.groupBy(line?.line_routes, 'label');

  // Pick only the highest priority line route per label
  Object.keys(grouped).forEach((key) => {
    filteredLineRoutes.push(
      grouped[key].reduce((prev, curr) =>
        prev.priority > curr.priority ? prev : curr,
      ),
    );
  });

  const filteredLine = produce(line, (draft) => {
    if (draft) {
      draft.line_routes = filteredLineRoutes;
    }
  });

  return filteredLine;
};

/** Returns the initial observation date depending on the parameters. */
const getInitialDate = (
  showAll: boolean,
  selectedDate: string,
  validityStart?: DateTime,
  validityEnd?: DateTime,
) => {
  if (showAll) {
    return undefined;
  }

  if (selectedDate) {
    return DateTime.fromISO(selectedDate);
  }

  const isActiveToday =
    validityStart &&
    validityStart <= DateTime.now() &&
    (!validityEnd || validityEnd >= DateTime.now());

  if (!isActiveToday) {
    return validityStart;
  }

  return DateTime.fromISO(DateTime.now().toISODate());
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

  const line = mapLineDetailsWithRoutesResult(lineDetailsResult) as RouteLine;
  const observationDate = getInitialDate(
    showAll,
    selectedDate,
    line?.validity_start as DateTime,
    line?.validity_end as DateTime,
  );

  const lineByDateResult = useGetActiveLineDetailsWithRoutesByDateQuery({
    variables: {
      label: line?.label as string,
      date: observationDate,
      // If observing non-draft line, filter out everything that are linked to drafts
      filterPriority: line?.priority !== 30 ? [30] : [],
    },
  });

  const lineByDate = mapActiveLineDetailsByDateResult(
    lineByDateResult,
  ) as RouteLine[];

  const filteredLine = lineByDate
    ? filterLineDetailsByDate(lineByDate[0])
    : null;

  return {
    line: showAll ? line : filteredLine,
    observationDate,
  };
};
