import { produce } from 'immer';
import { ReusableComponentsVehicleModeEnum } from '../generated/graphql';
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

type SearchParametersGqlConfigurations = {
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
 * GQL filter configuration for label and priority, which are mandatory criteria
 * to be given for the search.
 */
const defaultSearchParametersGqlConfig: SearchParametersGqlConfigurations = {
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
const primaryVehicleModeGqlConfig = {
  replaceStar: false,
  operator: '_eq',
  isLineProperty: true,
};

const setConfigurations = (queryParams: SearchConditions) => {
  const params: SearchParametersGqlConfigurations = produce(
    defaultSearchParametersGqlConfig,
    (draft) => {
      draft.priority.value = queryParams.priorities;
      draft.label.value = queryParams.label;

      // Only set primaryVehicleMode gql filter if it is set to something else than All
      if (
        queryParams.primaryVehicleMode &&
        queryParams.primaryVehicleMode !== AllOptionEnum.All
      ) {
        draft.primary_vehicle_mode = {
          ...primaryVehicleModeGqlConfig,
          value: queryParams.primaryVehicleMode,
        };
      }
    },
  );

  return params;
};

export const mapToSqlLikeValue = (str: string) => {
  return str.replaceAll('*', '%');
};

const mapToFilterAttribute = (
  key: string,
  values: {
    value: SearchParameterValueTypes;
    operator: string;
    replaceStar: boolean;
    isLineProperty?: boolean;
  },
  isRouteFilter: boolean,
) => {
  const filter = {
    [key]: {
      [values.operator]: values.replaceStar
        ? mapToSqlLikeValue(values.value as string) || '%'
        : values.value,
    },
  };

  // If creating route filter but the property is for line, we then
  // wrap the filter in route_line to get the filter from the route's line
  return isRouteFilter && values.isLineProperty
    ? { route_line: filter }
    : filter;
};

/** Maps the given parameters to GQL filter attributes. Also takes in to
 * consideration if we are generating route filter. In that case we wrap all
 * line property filters in to route_line wrapper.
 */
const mapConfiguredParamsToFilterAttributes = (
  configuredParams: SearchParametersGqlConfigurations,
  isRouteFilter: boolean,
) => {
  const filterAttributes = Object.entries(configuredParams).map((entry) => {
    const [key, value] = entry;
    return mapToFilterAttribute(key, value, isRouteFilter);
  });

  // TODO: This Object.assign is fine for now, but this should be changed to
  // reduce + merge combination when adding the next 'isLineProperty' filter,
  // because it will result in duplicatekey's and Object.assign will overwrite
  // duplicate keys instead of merging them.
  // Converting array [{key: value}, ...] into a single object {key: value, ...}
  return Object.assign({}, ...filterAttributes);
};

export const constructGqlFilterObject = (params: SearchConditions) => {
  const configuredParams = setConfigurations(params);

  const lineFilter = mapConfiguredParamsToFilterAttributes(
    configuredParams,
    false,
  );

  const routeFilter = mapConfiguredParamsToFilterAttributes(
    configuredParams,
    true,
  );

  // TODO: This will be changed to dynamic when the sorting feature is implemented
  // but until then, we should have the sorting by label and validity_start hardcoded
  const orderBy = [{ label: 'asc' }, { validity_start: 'asc' }];

  return {
    lineFilter,
    routeFilter,
    lineOrderBy: orderBy,
    routeOrderBy: orderBy,
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
