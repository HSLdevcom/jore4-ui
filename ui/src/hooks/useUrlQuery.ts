import produce from 'immer';
import qs from 'qs';
import { useHistory, useLocation } from 'react-router-dom';

type QueryParameter<TType> = { paramName: string; value: TType };
type ParameterWriteOptions = { replace?: boolean };

export const useUrlQuery = () => {
  const query = useLocation().search;
  const queryParams = qs.parse(query, { ignoreQueryPrefix: true });

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
    getBooleanParamFromUrlQuery,
    deleteFromUrlQuery,
  };
};
