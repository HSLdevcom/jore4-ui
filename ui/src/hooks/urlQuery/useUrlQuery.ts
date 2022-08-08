import produce from 'immer';
import { DateTime } from 'luxon';
import qs from 'qs';
import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { parseDate } from '../../time';

type QueryParameter<TType> = { paramName: string; value: TType };
type ParameterWriteOptions = { replace?: boolean };

export const useUrlQuery = () => {
  const query = useLocation().search;
  const queryParams = useMemo(
    () => qs.parse(query, { ignoreQueryPrefix: true }),
    [query],
  );

  const history = useHistory();

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

    replace
      ? history.replace({
          search: `?${queryString}`,
        })
      : history.push({
          search: `?${queryString}`,
        });
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

    replace
      ? history.replace({
          search: `?${queryString}`,
        })
      : history.push({
          search: `?${queryString}`,
        });
  };

  return {
    queryParams,
    setToUrlQuery,
    setBooleanToUrlQuery,
    setDateTimeToUrlQuery,
    getBooleanParamFromUrlQuery,
    getDateTimeFromUrlQuery,
    deleteFromUrlQuery,
  };
};
