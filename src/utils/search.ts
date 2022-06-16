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

const replaceStarCharacter = (str: string) => {
  return str ? str.replaceAll('*', '%') : '%';
};

const transformToFilterAttribute = (
  key: string,
  values: {
    value: string | number[];
    operator: string;
    replaceStar: boolean;
  },
) => {
  return {
    [key]: {
      [values.operator]: values.replaceStar
        ? replaceStarCharacter(values.value as string)
        : values.value,
    },
  };
};

export const constructGqlFilterObject = (params: SearchConditions) => {
  const configuredParams = setConfigurations(params);

  const result = Object.entries(configuredParams).map((entry) => {
    const [key, value] = entry;
    return transformToFilterAttribute(key, value);
  });

  // Converting array [{key: value}, ...] into a single object {key: value, ...}
  const filter = Object.assign({}, ...result);

  // TODO: This will be changed to dynamic when the sorting feature is implemented
  // but until then, we should have the sorting by label and validity_start hardcoded
  const orderBy = [{ label: 'asc' }, { validity_start: 'asc' }];

  return {
    lineFilter: {
      ...filter,
    },
    routeFilter: {
      ...filter,
    },
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
