import { produce } from 'immer';
import {
  DeserializedQueryStringParameters,
  SearchConditions,
  SearchParameters,
} from '../hooks/search/useSearchQueryParser';
import { Priority } from '../types/Priority';

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
};

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

const setConfigurations = (queryParams: SearchConditions) => {
  const params: SearchParametersGqlConfigurations = produce(
    defaultSearchParametersGqlConfig,
    (draft) => {
      draft.priority.value = queryParams.priorities;
      draft.label.value = queryParams.label;
    },
  );

  return params;
};

export const mapToSqlLikeValue = (str: string) => {
  return str.replaceAll('*', '%');
};

const transformToFilterAttribute = (
  key: string,
  values: {
    value: string | number[];
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

/** Transforms the given parameters to GQL filter attributes. Also takes in to
 * consideration if we are generating route filter. In that case we wrap all
 * line property filters in to route_lin wrapper.
 */
const transformConfiguredParamsToFilterAttributes = (
  configuredParams: SearchParametersGqlConfigurations,
  isRouteFilter: boolean,
) => {
  const filterAttributes = Object.entries(configuredParams).map((entry) => {
    const [key, value] = entry;
    return transformToFilterAttribute(key, value, isRouteFilter);
  });

  // Converting array [{key: value}, ...] into a single object {key: value, ...}
  return Object.assign({}, ...filterAttributes);
};

export const constructGqlFilterObject = (params: SearchConditions) => {
  const configuredParams = setConfigurations(params);

  const lineFilter = transformConfiguredParamsToFilterAttributes(
    configuredParams,
    false,
  );

  const routeFilter = transformConfiguredParamsToFilterAttributes(
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
