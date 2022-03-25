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
    operator: '_like',
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

  return {
    filter: {
      ...result.reduce((next, curr) => ({ ...curr, ...next })),
    },
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
