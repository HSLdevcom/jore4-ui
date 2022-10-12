import { produce } from 'immer';
import {
  OrderBy,
  ReusableComponentsVehicleModeEnum,
  RouteLineBoolExp,
  RouteLineOrderBy,
  RouteRouteBoolExp,
  RouteRouteOrderBy,
  SearchLinesAndRoutesQueryVariables,
} from '../generated/graphql';
import {
  DeserializedQueryStringParameters,
  SearchConditions,
  SearchParameters,
} from '../hooks/search/useSearchQueryParser';
import { Priority } from '../types/Priority';
import { AllOptionEnum } from './enum';

type SearchParameterValueTypes =
  | string
  | number[]
  | ReusableComponentsVehicleModeEnum;

type SearchParametersGqlOptions = {
  priority: {
    value: Priority[];
    replaceStar: boolean;
    operator: string;
  };
  label: {
    value: string;
    replaceStar: boolean;
    operator: string;
  };
  // eslint-disable-next-line camelcase
  primary_vehicle_mode?: {
    value: ReusableComponentsVehicleModeEnum;
    replaceStar: boolean;
    operator: string;
    isLineProperty: boolean;
  };
};

/**
 * GQL filter options for label and priority, which are mandatory criteria
 * to be given for the search.
 */
const defaultSearchParametersGqlOptions: SearchParametersGqlOptions = {
  priority: {
    value: [Priority.Standard, Priority.Temporary],
    replaceStar: false,
    operator: '_in',
  },
  label: {
    value: '',
    replaceStar: true,
    operator: '_ilike',
  },
};

/**
 * GQL filter configuration for primaryVehicleMode. This is used and placed
 * only if a precise primaryVehicleMode is set as search filter.
 */
const primaryVehicleModeGqlOptions = {
  replaceStar: false,
  operator: '_eq',
  isLineProperty: true,
};

/**
 * Constructs the search conditions GQL options from configurations defined in this
 * file and also the value which comes from the SearchConditions query parameters.
 * The resulting options are used to map the final GQL filter.
 */
const constructSearchConditionsGqlOptions = (queryParams: SearchConditions) => {
  const gqlOptions: SearchParametersGqlOptions = produce(
    defaultSearchParametersGqlOptions,
    (draft) => {
      draft.priority.value = queryParams.priorities;
      draft.label.value = queryParams.label;

      // Only set primaryVehicleMode gql filter if it is set to something else than All
      if (
        queryParams.primaryVehicleMode &&
        queryParams.primaryVehicleMode !== AllOptionEnum.All
      ) {
        draft.primary_vehicle_mode = {
          ...primaryVehicleModeGqlOptions,
          value: queryParams.primaryVehicleMode,
        };
      }
    },
  );

  return gqlOptions;
};

export const mapToSqlLikeValue = (str: string) => {
  return str.replaceAll('*', '%');
};

/**
 * Maps search condition options in to final single GQL filter object.
 * Required parameters for this is
 * * key (property name e.g. 'label')
 * * value (within options)
 * * operator (which filtering operator to use in GQL, e.g. '_eq' for equal)
 * * replaceStar (when the operator is i.e. '_like' we can use this flag to
 *   replace all '*' to '%' which will mean 'any' in GQL filtering)
 * There is also a optional parameter 'isLineProperty' which is used to
 * define if the property should be filtered through 'route_line' property when
 * mapping route filter (isRouteFilter = true).
 */
const mapSearchConditionOptionsToGqlFilter = (
  key: string,
  options: {
    value: SearchParameterValueTypes;
    operator: string;
    replaceStar: boolean;
    isLineProperty?: boolean;
  },
  isRouteFilter: boolean,
) => {
  const filter = {
    [key]: {
      [options.operator]: options.replaceStar
        ? mapToSqlLikeValue(String(options.value)) || '%'
        : options.value,
    },
  };

  // If creating route filter but the property is for line, we then
  // wrap the filter in route_line to get the filtering from the route_line property
  return isRouteFilter && options.isLineProperty
    ? { route_line: filter }
    : filter;
};

/**
 * Constructs GQL filters for given search conditions. Also takes in to
 * consideration if we are constructing route filter. In that case we wrap all
 * line property filters in to route_line wrapper.
 */
const constructSearchConditionGqlFilters = ({
  searchConditions,
  constructRouteFilter,
}: {
  searchConditions: SearchConditions;
  constructRouteFilter: boolean;
}): RouteLineBoolExp | RouteRouteBoolExp => {
  const searchConditionOptions =
    constructSearchConditionsGqlOptions(searchConditions);

  const gqlFilters = Object.entries(searchConditionOptions).map((entry) => {
    const [key, value] = entry;
    return mapSearchConditionOptionsToGqlFilter(
      key,
      value,
      constructRouteFilter,
    );
  });

  // TODO: This Object.assign is fine for now, but this should be changed to
  // reduce + merge combination when adding the next 'isLineProperty' filter,
  // because it will result in duplicate keys and Object.assign will overwrite
  // instead of merging them.
  // Converting array [{key: value}, ...] into a single object {key: value, ...}
  return Object.assign({}, ...gqlFilters);
};

/**
 * Constructs the search lines and routes GQL query variables from configurations
 * defined in this file and the given search conditions.
 */
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

export const createQueryParamString = (paramObject: SearchParameters) => {
  const combinedObject: DeserializedQueryStringParameters = {
    ...paramObject.filter,
    ...paramObject.search,
  };

  let paramString = '?';
  Object.keys(combinedObject).forEach((key) => {
    if (paramString.length > 1) {
      paramString += '&';
    }
    paramString += `${key}=${
      combinedObject[key as keyof DeserializedQueryStringParameters]
    }`;
  });
  return paramString;
};
