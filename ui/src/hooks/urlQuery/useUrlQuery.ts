import produce from 'immer';
import isArray from 'lodash/isArray';
import isBoolean from 'lodash/isBoolean';
import isNumber from 'lodash/isNumber';
import { DateTime } from 'luxon';
import qs from 'qs';
import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
} from '../../generated/graphql';
import { parseDate } from '../../time';
import { Priority } from '../../types/enums';
import { DisplayedSearchResultType } from '../../utils/enum';

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
}

export type QueryParameter<TType> = { paramName: string; value: TType };
export type QueryParameterTypes =
  | string
  | boolean
  | DateTime
  | number
  | undefined
  | number[]
  | string[];
type ParameterWriteOptions = { replace?: boolean };

export const useUrlQuery = () => {
  const query = useLocation().search;
  const queryParams = useMemo(
    () => qs.parse(query, { ignoreQueryPrefix: true }),
    [query],
  );

  const history = useHistory();

  const setQueryString = useCallback(
    (queryString: string, replace: boolean, pathname?: string) => {
      replace
        ? history.replace({
            search: `?${queryString}`,
            pathname,
          })
        : history.push({
            search: `?${queryString}`,
            pathname,
          });
    },
    [history],
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
      pathname = '',
    }: {
      parameters: QueryParameter<QueryParameterTypes>[];
      replace?: boolean;
      debounced?: boolean;
      pathname?: string;
    }) => {
      const updatedUrlQuery = produce(queryParams, (draft) => {
        parameters.forEach((parameter) => {
          if (parameter.value === undefined) {
            return;
          }

          // Convert based on the type of the value
          if (isBoolean(parameter.value)) {
            draft[parameter.paramName] = parameter.value.toString();
          } else if (DateTime.isDateTime(parameter.value)) {
            draft[parameter.paramName] = parameter.value.toISODate();
          } else if (isNumber(parameter.value)) {
            draft[parameter.paramName] = parameter.value.toString();
          } else if (isArray(parameter.value)) {
            draft[parameter.paramName] = parameter.value.join(',');
          } else {
            draft[parameter.paramName] = parameter.value;
          }
        });
      });
      const queryString = qs.stringify(updatedUrlQuery);

      setQueryString(queryString, replace, pathname);
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
    { paramName, value }: QueryParameter<T[]>,
    { replace }: ParameterWriteOptions = {},
  ) => {
    setToUrlQuery({ paramName, value: value.join(','), replace });
  };

  /** Returns a query parameter in array type */
  const getArrayFromUrlQuery = (paramName: string): string[] | undefined => {
    return (queryParams[paramName] as string)?.split(',');
  };

  /** Returns a query parameter in Priority array type */
  const getPriorityArrayFromUrlQuery = (
    paramName: string,
  ): Priority[] | undefined => {
    return getArrayFromUrlQuery(paramName)
      ?.map((p) => parseInt(p, 10))
      ?.filter((p) => Object.values(Priority).includes(p));
  };

  /** Returns a query parameter in ReusableComponentsVehicleModeEnum if exists,
   * otherwise returns undefined
   */
  const getReusableComponentsVehicleModeEnumFromUrlQuery = (
    paramName: string,
  ): ReusableComponentsVehicleModeEnum | undefined => {
    const vehicleMode = queryParams[paramName];

    return Object.values(ReusableComponentsVehicleModeEnum).includes(
      vehicleMode as ReusableComponentsVehicleModeEnum,
    )
      ? (vehicleMode as ReusableComponentsVehicleModeEnum)
      : undefined;
  };

  /** Returns a query parameter in RouteTypeOfLine if exists,
   * otherwise returns undefined
   */
  const getRouteTypeOfLineEnumFromUrlQuery = (
    paramName: string,
  ): RouteTypeOfLineEnum | undefined => {
    const typeOfLine = queryParams[paramName];

    return Object.values(RouteTypeOfLineEnum).includes(
      typeOfLine as RouteTypeOfLineEnum,
    )
      ? (typeOfLine as RouteTypeOfLineEnum)
      : undefined;
  };

  /** Returns a query parameter in DisplayedSearchResultType if exists,
   * otherwise returns undefined
   */
  const getDisplayedSearchResultTypeFromUrlQuery = (
    paramName: string,
  ): DisplayedSearchResultType | undefined => {
    const searchResultType = queryParams[paramName];

    return Object.values(DisplayedSearchResultType).includes(
      searchResultType as DisplayedSearchResultType,
    )
      ? (searchResultType as DisplayedSearchResultType)
      : undefined;
  };

  /** Returns a query parameter in boolean type */
  const getStringParamFromUrlQuery = (paramName: string) => {
    return (queryParams[paramName] as string) || undefined;
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
    paramNames: string[];
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
    getPriorityArrayFromUrlQuery,
    getReusableComponentsVehicleModeEnumFromUrlQuery,
    getRouteTypeOfLineEnumFromUrlQuery,
    getDisplayedSearchResultTypeFromUrlQuery,
    getStringParamFromUrlQuery,
    getBooleanParamFromUrlQuery,
    getDateTimeFromUrlQuery,
    getFloatParamFromUrlQuery,
    setMultipleParametersToUrlQuery,
    deleteFromUrlQuery,
    deleteMultipleFromUrlQuery,
  };
};
