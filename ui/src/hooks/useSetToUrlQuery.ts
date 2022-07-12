import produce from 'immer';
import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { useUrlQuery } from './useUrlQuery';

export const useSetToUrlQuery = () => {
  const queryParams = useUrlQuery();
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

  return setToUrlQuery;
};
