import { produce } from 'immer';
import { DateTime } from 'luxon';
import qs from 'qs';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { parseDate } from '../../time';
import { Priority } from '../../types/enums';

export enum QueryParameterName {
  MapOpen = 'mapOpen',
  Longitude = 'lng',
  Latitude = 'lat',
  Zoom = 'z',
  ObservationDate = 'observationDate',
  RouteLabels = 'routeLabels',
  LineLabel = 'lineLabel',
  RouteId = 'routeId',
  ShowSelectedDaySituation = 'showSelectedDaySituation',
  RoutePriorities = 'routePriorities',
  TimetablesViewName = 'timetablesView',
  DayType = 'dayType',
  StartDate = 'startDate',
  EndDate = 'endDate',
}

export type QueryParameter<TType> = { paramName: string; value: TType };
export type QueryParameterTypes =
  | string
  | boolean
  | DateTime
  | number
  | undefined
  | ReadonlyArray<number>
  | ReadonlyArray<string>;
type ParameterWriteOptions = { replace?: boolean };

/**
 * Maps the query parameters into QueryParameter<QueryParameterTypes> for
 * setMultipleParametersToUrlQuery function.
 */
export const mapObjectToQueryParameterObjects = <
  T extends Record<string, QueryParameterTypes>,
>(
  queryStringParameters: T,
): QueryParameter<QueryParameterTypes>[] => {
  return Object.entries(queryStringParameters).map(([key, value]) => {
    return { paramName: key, value };
  });
};

export const useUrlQuery = () => {
  const query = useLocation().search;
  const queryParams = useMemo(
    () => qs.parse(query, { ignoreQueryPrefix: true }),
    [query],
  );

  const navigate = useNavigate();

  const setQueryString = useCallback(
    (
      queryString: string,
      replace: boolean,
      pathname?: string,
      state?: unknown,
    ) => {
      navigate({ search: `?${queryString}`, pathname }, { replace, state });
    },
    [navigate],
  );

  /** Sets parameter to URL query
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setToUrlQuery = ({
    paramName,
    value,
    replace = false,
  }: {
    paramName: string;
    value: string;
    replace?: boolean;
  }) => {
    const updatedUrlQuery = produce(queryParams, (draft) => {
      draft[paramName] = value;
    });

    const queryString = qs.stringify(updatedUrlQuery);

    setQueryString(queryString, replace);
  };

  /** Sets boolean parameter to URL query
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setBooleanToUrlQuery = (
    { paramName, value }: QueryParameter<boolean>,
    { replace }: ParameterWriteOptions = {},
  ) => {
    setToUrlQuery({ paramName, value: value.toString(), replace });
  };

  /** Sets DateTime parameter to URL query as ISO Date
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setDateTimeToUrlQuery = (
    { paramName, value }: QueryParameter<DateTime>,
    { replace }: ParameterWriteOptions = {},
  ) => {
    setToUrlQuery({ paramName, value: value.toISODate(), replace });
  };

  /** Sets multiple parameters to URL query
   * Converts booleans, DateTimes and numbers in to string format
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setMultipleParametersToUrlQuery = useCallback(
    ({
      parameters,
      replace = false,
      pathname = undefined,
      state = undefined,
    }: {
      parameters: ReadonlyArray<QueryParameter<QueryParameterTypes>>;
      replace?: boolean;
      debounced?: boolean;
      pathname?: string;
      state?: unknown;
    }) => {
      const updatedUrlQuery = produce(queryParams, (draft) => {
        parameters.forEach((parameter) => {
          if (parameter.value === undefined) {
            return;
          }

          // Convert based on the type of the value
          if (DateTime.isDateTime(parameter.value)) {
            draft[parameter.paramName] = parameter.value.toISODate();
          } else if (Array.isArray(parameter.value)) {
            draft[parameter.paramName] = parameter.value.join(',');
          } else {
            draft[parameter.paramName] = parameter.value.toString();
          }
        });
      });
      const queryString = qs.stringify(updatedUrlQuery);

      setQueryString(queryString, replace, pathname, state);
    },
    [queryParams, setQueryString],
  );

  /** Sets array parameter to URL query
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setArrayToUrlQuery = <T>(
    { paramName, value }: QueryParameter<ReadonlyArray<T>>,
    { replace }: ParameterWriteOptions = {},
  ) => {
    setToUrlQuery({ paramName, value: value.join(','), replace });
  };

  /** Returns a query parameter in array type */
  const getArrayFromUrlQuery = (paramName: string): string[] => {
    return (queryParams[paramName] as string)
      ?.split(',')
      ?.filter((item) => item !== '');
  };

  /** Returns a query parameter in Priority array type */
  const getPriorityArrayFromUrlQuery = (
    paramName: string,
  ): Priority[] | undefined => {
    return getArrayFromUrlQuery(paramName)
      ?.map((p) => parseInt(p, 10))
      ?.filter((p) => Object.values(Priority).includes(p));
  };

  /** Returns a query parameter as given enum if exists,
   * otherwise returns undefined
   */
  const getEnumFromUrlQuery = <T extends object>(
    paramName: string,
    enumType: T,
  ): T[keyof T] | undefined => {
    const paramValue = queryParams[paramName] as T[keyof T];

    return Object.values(enumType).includes(paramValue)
      ? paramValue
      : undefined;
  };

  /** Returns a query parameter in string type */
  const getStringParamFromUrlQuery = (paramName: string) => {
    return queryParams[paramName] as string | undefined;
  };

  /** Returns a query parameter in boolean type */
  const getBooleanParamFromUrlQuery = (paramName: string) => {
    return queryParams[paramName] === 'true';
  };

  /** Returns DateTime query parameter if exists, otherwise returns undefined */
  const getDateTimeFromUrlQuery = useCallback(
    (paramName: string) => {
      return queryParams[paramName]
        ? parseDate(queryParams[paramName] as string)
        : undefined;
    },
    [queryParams],
  );

  /** Returns float query parameter if exists, otherwise returns null */
  const getFloatParamFromUrlQuery = (paramName: string) => {
    return queryParams[paramName]
      ? parseFloat(queryParams[paramName] as string)
      : null;
  };

  const getEnumArrayFromUrlQuery = <T extends object>(
    paramName: string,
    enumType: T,
  ): T[keyof T][] | undefined => {
    return getArrayFromUrlQuery(paramName)
      ?.filter((s) => s && Object.values(enumType).includes(s))
      .map((s) => s as T[keyof T]);
  };

  /** Deletes parameter from URL query
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const deleteFromUrlQuery = ({
    paramName,
    replace = false,
  }: {
    paramName: string;
    replace?: boolean;
  }) => {
    const updatedUrlQuery = produce(queryParams, (draft) => {
      delete draft[paramName];
    });

    const queryString = qs.stringify(updatedUrlQuery);

    setQueryString(queryString, replace);
  };

  /** Deletes multiple parameters from URL query
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const deleteMultipleFromUrlQuery = ({
    paramNames,
    replace = false,
  }: {
    paramNames: ReadonlyArray<string>;
    replace?: boolean;
  }) => {
    const updatedUrlQuery = produce(queryParams, (draft) => {
      paramNames.forEach((paramName) => {
        delete draft[paramName];
      });
    });

    const queryString = qs.stringify(updatedUrlQuery);

    setQueryString(queryString, replace);
  };

  return {
    queryParams,
    setToUrlQuery,
    setBooleanToUrlQuery,
    setDateTimeToUrlQuery,
    setArrayToUrlQuery,
    getArrayFromUrlQuery,
    getEnumArrayFromUrlQuery,
    getPriorityArrayFromUrlQuery,
    getEnumFromUrlQuery,
    getStringParamFromUrlQuery,
    getBooleanParamFromUrlQuery,
    getDateTimeFromUrlQuery,
    getFloatParamFromUrlQuery,
    setMultipleParametersToUrlQuery,
    deleteFromUrlQuery,
    deleteMultipleFromUrlQuery,
  };
};
