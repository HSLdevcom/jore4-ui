import { gql } from '@apollo/client';
import { uniqBy } from 'lodash';
import {
  TimetablesLineListInformationFragment,
  TimetablesRouteListInformationFragment,
  useSearchJourneyPatternIdsQuery,
  useSearchTimetablesByJourneyPatternIdsQuery,
} from '../../generated/graphql';
import {
  buildSearchTimetablesByJourneyPatternIdsQueryVariables,
  DisplayedSearchResultType,
  mapToVariables,
} from '../../utils';
import { useTimetablesSearchQueryParser } from './useTimetablesSearchQueryParser';

const GQL_TIMETABLES_LINE_LIST_INFORMATION_FRAGMENT = gql`
  fragment timetables_line_list_information on route_line {
    line_id
    label
    name_i18n
    priority
    short_name_i18n
    line_routes {
      route_id
      label
      route_shape
    }
  }
`;

const GQL_TIMETABLES_ROUTE_LIST_INFORMATION_FRAGMENT = gql`
  fragment timetables_route_list_information on route_route {
    route_id
    name_i18n
    label
    direction
    validity_start
    validity_end
    on_line_id
    priority
    route_shape
    route_line {
      ...timetables_line_list_information
    }
  }
`;

const GQL_SEARCH_JOURNEY_PATTERN_IDS = gql`
  query SearchJourneyPatternIds(
    $filter: journey_pattern_journey_pattern_bool_exp
  ) {
    journey_pattern_journey_pattern(where: $filter) {
      journey_pattern_id
    }
  }
`;

const GQL_SEARCH_TIMETABLES_BY_JOURNEY_PATTERN_IDS = gql`
  query SearchTimetablesByJourneyPatternIds($journeyPatternIds: [uuid!]) {
    timetables {
      timetables_vehicle_journey_vehicle_journey(
        where: {
          journey_pattern_ref: {
            journey_pattern_id: { _in: $journeyPatternIds }
          }
        }
      ) {
        vehicle_journey_id
        journey_pattern_ref {
          journey_pattern_ref_id
          journey_pattern_instance {
            journey_pattern_id
            journey_pattern_route {
              ...timetables_route_list_information
            }
          }
        }
      }
    }
  }
`;

export const useTimetablesSearchResults = (): {
  lines: TimetablesLineListInformationFragment[];
  routes: TimetablesRouteListInformationFragment[];
  resultCount: number;
  // resultType: DisplayedSearchResultType;
} => {
  const parsedSearchQueryParameters = useTimetablesSearchQueryParser();

  // We need to keep the queries and their results separate, so that
  // the routes and lines result sets corresponds to search criteria
  // NOTE: When implementing search criteria that are related to attributes in
  // routes-and-lines database, apply those filters in this query
  const routesSearchQueryVariables =
    buildSearchTimetablesByJourneyPatternIdsQueryVariables(
      parsedSearchQueryParameters.search,
      true,
    );
  const linesSearchQueryVariables =
    buildSearchTimetablesByJourneyPatternIdsQueryVariables(
      parsedSearchQueryParameters.search,
      false,
    );

  // Fetch all journey pattern ids that corresponds to search criteria
  const routesJourneyPatternIdsResult = useSearchJourneyPatternIdsQuery(
    mapToVariables(routesSearchQueryVariables),
  );
  const linesJourneyPatternIdsResult = useSearchJourneyPatternIdsQuery(
    mapToVariables(linesSearchQueryVariables),
  );

  const routesJourneyPatternIds =
    routesJourneyPatternIdsResult.data?.journey_pattern_journey_pattern.map(
      (jp) => jp.journey_pattern_id,
    ) || [];
  const linesJourneyPatternIds =
    linesJourneyPatternIdsResult.data?.journey_pattern_journey_pattern.map(
      (jp) => jp.journey_pattern_id,
    ) || [];

  // Fetch timetables that exists for the given journeyPatternIs
  // NOTE: When implementing search criteria that are related to attributes in
  // timetables database, apply those filters in this query
  const routesResult = useSearchTimetablesByJourneyPatternIdsQuery(
    mapToVariables({ journeyPatternIds: routesJourneyPatternIds }),
  );
  const linesResult = useSearchTimetablesByJourneyPatternIdsQuery(
    mapToVariables({ journeyPatternIds: linesJourneyPatternIds }),
  );

  // Map the route information from the result set
  const routesByVehicleJourneys =
    routesResult.data?.timetables?.timetables_vehicle_journey_vehicle_journey.map(
      (journey) =>
        journey.journey_pattern_ref.journey_pattern_instance
          ?.journey_pattern_route as TimetablesRouteListInformationFragment,
    );

  // Map line information from the result set
  const linesByVehicleJourneys =
    linesResult.data?.timetables?.timetables_vehicle_journey_vehicle_journey.map(
      (journey) =>
        journey.journey_pattern_ref.journey_pattern_instance
          ?.journey_pattern_route
          ?.route_line as TimetablesLineListInformationFragment,
    );

  // Remove duplicate entries, because we only need one entry per route / line.
  const distinctRoutes = uniqBy(
    routesByVehicleJourneys,
    (route) => route.route_id,
  );
  const distinctLines = uniqBy(linesByVehicleJourneys, (line) => line.line_id);

  const getResultCount = () => {
    switch (parsedSearchQueryParameters.filter.displayedData) {
      case DisplayedSearchResultType.Lines:
        return distinctLines.length;
      case DisplayedSearchResultType.Routes:
        return distinctRoutes?.length;
      default:
        // eslint-disable-next-line no-console
        console.error(
          `Error: ${parsedSearchQueryParameters.filter.displayedData} does not exist.`,
        );
        return 0;
    }
  };

  return {
    routes: distinctRoutes,
    lines: distinctLines,
    resultCount: getResultCount(),
  };
};
