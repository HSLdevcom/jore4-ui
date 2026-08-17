import { DateTime } from 'luxon';
import {
  OrderBy,
  ReusableComponentsVehicleModeEnum,
  RouteLineBoolExp,
  RouteLineOrderBy,
  RouteRouteBoolExp,
  RouteRouteOrderBy,
  RouteTypeOfLineEnum,
  SearchLinesAndRoutesQueryVariables,
} from '../generated/graphql';
import { Priority } from '../types/enums';
import { AllOptionEnum } from './enum';
import { buildActiveDateGqlFilter } from './gql';

export type SearchConditions = {
  readonly priorities: ReadonlyArray<Priority>;
  readonly query: string;
  readonly transportMode?: ReadonlyArray<
    ReusableComponentsVehicleModeEnum | AllOptionEnum
  >;
  readonly typeOfLine?: RouteTypeOfLineEnum | AllOptionEnum;
  readonly observationDate: DateTime;
};

export function mapToSqlLikeValue(str: string) {
  return str.replaceAll('*', '%');
}

/** Build optional search condition filter. Returns
 * empty object if the filter is not set or is set to 'All', otherwise
 * returns the GQL filter built with the given function.
 * If the value is missing or is 'All', we return empty object because
 * we do not want to create the GQL filter at all.
 */
export function buildOptionalSearchConditionGqlFilter<
  TType,
  TBuildType = RouteLineBoolExp | RouteRouteBoolExp,
>(
  value: TType | AllOptionEnum.All | undefined,
  buildFunction: (value: TType) => TBuildType,
) {
  if (value && value !== AllOptionEnum.All) {
    return buildFunction(value);
  }
  return {};
}

/** Builds an object for gql to filter by label using the '_like' operator.
 * This will means that all the '%' in the label are considered as 'any'
 */
function buildLabelLikeGqlFilter(
  label?: string,
): RouteRouteBoolExp | RouteLineBoolExp {
  return { label: { _like: label } };
}

/** Wraps all the properties in route_line if 'buildRouteFilter' flag is true
 * and if there is any properties to wrap (they are optional and if none of them
 * are chosen, the properties object might be empty).
 */
function handleLinePropertyGqlFilters({
  properties,
  buildRouteFilter,
}: {
  properties: RouteLineBoolExp;
  buildRouteFilter: boolean;
}) {
  return {
    // Wrap with route_line if building route filter and there are properties to wrap
    ...(buildRouteFilter && Object.keys(properties).length
      ? {
          route_line: properties,
        }
      : properties),
  };
}

/** Builds an object for gql to filter by primary_vehicle_mode */
function buildPrimaryVehicleModeGqlFilter(
  primaryVehicleMode: ReadonlyArray<
    ReusableComponentsVehicleModeEnum | AllOptionEnum
  >,
): RouteLineBoolExp {
  if (primaryVehicleMode.includes(AllOptionEnum.All)) {
    return {};
  }

  // Filter out any AllOptionEnum values, just in case to satisfy TS
  const filtered = primaryVehicleMode.filter(
    (mode): mode is ReusableComponentsVehicleModeEnum =>
      mode !== AllOptionEnum.All,
  );

  return { primary_vehicle_mode: { _in: filtered } };
}

/** Builds an object for gql to filter by typeOfLine */
function buildTypeOfLineGqlFilter(
  typeOfLine: RouteTypeOfLineEnum,
): RouteLineBoolExp {
  return { type_of_line: { _eq: typeOfLine } };
}

/** Builds the search condition GQL filters for either route or line and
 * buildRouteFilter parameter is used to determine which one.
 */
function buildSearchConditionGqlFilters({
  searchConditions,
  buildRouteFilter,
}: {
  searchConditions: SearchConditions;
  buildRouteFilter: boolean;
}): RouteRouteBoolExp | RouteLineBoolExp {
  return {
    // Build all the generic filters.
    ...buildOptionalSearchConditionGqlFilter<string>(
      mapToSqlLikeValue(searchConditions.query),
      buildLabelLikeGqlFilter,
    ),
    priority: { _in: searchConditions.priorities },
    ...buildActiveDateGqlFilter(searchConditions.observationDate),

    // Build all the filters that are line's properties.
    ...handleLinePropertyGqlFilters({
      properties: {
        ...buildOptionalSearchConditionGqlFilter<
          ReadonlyArray<ReusableComponentsVehicleModeEnum | AllOptionEnum>
        >(searchConditions.transportMode, buildPrimaryVehicleModeGqlFilter),
        ...buildOptionalSearchConditionGqlFilter<RouteTypeOfLineEnum>(
          searchConditions.typeOfLine,
          buildTypeOfLineGqlFilter,
        ),
      },
      buildRouteFilter,
    }),
  };
}

export function buildSearchLinesAndRoutesGqlQueryVariables(
  searchConditions: SearchConditions,
): SearchLinesAndRoutesQueryVariables {
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
}
