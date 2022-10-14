import {
  OrderBy,
  ReusableComponentsVehicleModeEnum,
  RouteLineBoolExp,
  RouteLineOrderBy,
  RouteRouteBoolExp,
  RouteRouteOrderBy,
  SearchLinesAndRoutesQueryVariables,
} from '../generated/graphql';
import { SearchConditions } from '../hooks/search/useSearchQueryParser';
import { AllOptionEnum } from './enum';
import {
  constructLabelLikeGqlFilter,
  constructPrimaryVehicleModeGqlFilter,
  constructPriorityInGqlFilter,
} from './gql';

export const mapToSqlLikeValue = (str: string) => {
  return str.replaceAll('*', '%');
};

/** Construct optional search condition filter. Returns
 * empty object if the filter is not set or is set to 'All', otherwise
 * returns the GQL filter constructed with the given function.
 * If the value is missing or is 'All', we return empty object because
 * we do not want to create the GQL filter at all.
 */
const constructOptionalSearchConditionGqlFilter = <TType>(
  value: TType | AllOptionEnum.All | undefined,
  constructFunction: (value: TType) => RouteLineBoolExp | RouteRouteBoolExp,
) => {
  if (value && value !== AllOptionEnum.All) {
    return constructFunction(value);
  }
  return {};
};

/** Wraps all the properties in route_line if 'constructRouteFilter' flag is true
 * and if there is any properties to wrap (they are optional and if none of them
 * are chosen, the properties object might be empty).
 */
const handleLinePropertyGqlFilters = ({
  properties,
  constructRouteFilter,
}: {
  properties: RouteLineBoolExp;
  constructRouteFilter: boolean;
}) => {
  return {
    // Wrap with route_line if constructing route filter and there are properties to wrap
    ...(constructRouteFilter && Object.keys(properties).length
      ? {
          route_line: properties,
        }
      : properties),
  };
};

/** Constructs the search condition GQL filters for either route or line and
 * constructRouteFilter parameter is used to determine which one.
 */
const constructSearchConditionGqlFilters = ({
  searchConditions,
  constructRouteFilter,
}: {
  searchConditions: SearchConditions;
  constructRouteFilter: boolean;
}): RouteRouteBoolExp | RouteLineBoolExp => {
  return {
    // Construct all the generic filters.
    ...constructOptionalSearchConditionGqlFilter<string>(
      mapToSqlLikeValue(searchConditions.label),
      constructLabelLikeGqlFilter,
    ),
    ...constructPriorityInGqlFilter(searchConditions.priorities),

    // Construct all the filters that are line's properties.
    ...handleLinePropertyGqlFilters({
      properties: {
        ...constructOptionalSearchConditionGqlFilter<ReusableComponentsVehicleModeEnum>(
          searchConditions.primaryVehicleMode,
          constructPrimaryVehicleModeGqlFilter,
        ),
      },
      constructRouteFilter,
    }),
  };
};

export const constructSearchLinesAndRoutesGqlQueryVariables = (
  searchConditions: SearchConditions,
): SearchLinesAndRoutesQueryVariables => {
  const lineFilter = constructSearchConditionGqlFilters({
    searchConditions,
    constructRouteFilter: false,
  });

  const routeFilter = constructSearchConditionGqlFilters({
    searchConditions,
    constructRouteFilter: true,
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
