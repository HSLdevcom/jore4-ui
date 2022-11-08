import {
  OrderBy,
  ReusableComponentsVehicleModeEnum,
  RouteLineBoolExp,
  RouteLineOrderBy,
  RouteRouteBoolExp,
  RouteRouteOrderBy,
  RouteTypeOfLineEnum,
  SearchJourneyPatternIdsQueryVariables,
  SearchLinesAndRoutesQueryVariables,
} from '../generated/graphql';
import { SearchConditions } from '../hooks/search/useSearchQueryParser';
import { TimetablesSearchConditions } from '../hooks/search/useTimetablesSearchQueryParser';
import { AllOptionEnum } from './enum';
import {
  buildActiveDateGqlFilter,
  buildLabelLikeGqlFilter,
  buildPrimaryVehicleModeGqlFilter,
  buildPriorityInGqlFilter,
  buildTypeOfLineGqlFilter,
} from './gql';

export const mapToSqlLikeValue = (str: string) => {
  return str.replaceAll('*', '%');
};

/** Build optional search condition filter. Returns
 * empty object if the filter is not set or is set to 'All', otherwise
 * returns the GQL filter built with the given function.
 * If the value is missing or is 'All', we return empty object because
 * we do not want to create the GQL filter at all.
 */
const buildOptionalSearchConditionGqlFilter = <TType>(
  value: TType | AllOptionEnum.All | undefined,
  buildFunction: (value: TType) => RouteLineBoolExp | RouteRouteBoolExp,
) => {
  if (value && value !== AllOptionEnum.All) {
    return buildFunction(value);
  }
  return {};
};

/** Wraps all the properties in route_line if 'buildRouteFilter' flag is true
 * and if there is any properties to wrap (they are optional and if none of them
 * are chosen, the properties object might be empty).
 */
const handleLinePropertyGqlFilters = ({
  properties,
  buildRouteFilter,
}: {
  properties: RouteLineBoolExp;
  buildRouteFilter: boolean;
}) => {
  return {
    // Wrap with route_line if building route filter and there are properties to wrap
    ...(buildRouteFilter && Object.keys(properties).length
      ? {
          route_line: properties,
        }
      : properties),
  };
};

/** Builds the search condition GQL filters for either route or line and
 * buildRouteFilter parameter is used to determine which one.
 */
const buildSearchConditionGqlFilters = ({
  searchConditions,
  buildRouteFilter,
}: {
  searchConditions: SearchConditions;
  buildRouteFilter: boolean;
}): RouteRouteBoolExp | RouteLineBoolExp => {
  return {
    // Build all the generic filters.
    ...buildOptionalSearchConditionGqlFilter<string>(
      mapToSqlLikeValue(searchConditions.label),
      buildLabelLikeGqlFilter,
    ),
    ...buildPriorityInGqlFilter(searchConditions.priorities),
    ...buildActiveDateGqlFilter(searchConditions.observationDate),

    // Build all the filters that are line's properties.
    ...handleLinePropertyGqlFilters({
      properties: {
        ...buildOptionalSearchConditionGqlFilter<ReusableComponentsVehicleModeEnum>(
          searchConditions.primaryVehicleMode,
          buildPrimaryVehicleModeGqlFilter,
        ),
        ...buildOptionalSearchConditionGqlFilter<RouteTypeOfLineEnum>(
          searchConditions.typeOfLine,
          buildTypeOfLineGqlFilter,
        ),
      },
      buildRouteFilter,
    }),
  };
};

export const buildSearchLinesAndRoutesGqlQueryVariables = (
  searchConditions: SearchConditions,
): SearchLinesAndRoutesQueryVariables => {
  const lineFilter = buildSearchConditionGqlFilters({
    searchConditions,
    buildRouteFilter: false,
  });

  const routeFilter = buildSearchConditionGqlFilters({
    searchConditions,
    buildRouteFilter: true,
  });

  // TODO: These will be changed to dynamic when the sorting feature is implemented
  // but until then, we should have the sorting by label and validity_start hardcoded
  const lineOrderBy: Array<RouteLineOrderBy> = [
    { label: OrderBy.Asc },
    { validity_start: OrderBy.Asc },
  ];
  const routeOrderBy: Array<RouteRouteOrderBy> = [
    { label: OrderBy.Asc },
    { validity_start: OrderBy.Asc },
  ];

  return {
    lineFilter,
    routeFilter,
    lineOrderBy,
    routeOrderBy,
  };
};

export const buildTimetablesSearchCondtionGqlFilters = (
  searchConditions: TimetablesSearchConditions,
  buildRouteFilter: boolean,
) => {
  return {
    journey_pattern_route: {
      ...(buildRouteFilter
        ? buildOptionalSearchConditionGqlFilter<string>(
            mapToSqlLikeValue(searchConditions.label),
            buildLabelLikeGqlFilter,
          )
        : {
            route_line: {
              ...buildOptionalSearchConditionGqlFilter<string>(
                mapToSqlLikeValue(searchConditions.label),
                buildLabelLikeGqlFilter,
              ),
            },
          }),
    },
  };
};

export const buildSearchTimetablesByJourneyPatternIdsQueryVariables = (
  searchConditions: TimetablesSearchConditions,
  buildRouteVariables: boolean,
): SearchJourneyPatternIdsQueryVariables => {
  const filter = buildTimetablesSearchCondtionGqlFilters(
    searchConditions,
    buildRouteVariables,
  );

  return {
    filter,
  };
};
