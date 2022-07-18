import produce from 'immer';
import { DateTime } from 'luxon';
import qs from 'qs';
import { useHistory, useLocation } from 'react-router-dom';

export const useUrlQuery = () => {
  const query = useLocation().search;
  const queryParams = qs.parse(query, { ignoreQueryPrefix: true });

  const history = useHistory();

  const setObservationDate = (date: DateTime) => {
    const updatedUrlQuery = produce(queryParams, (draft) => {
      if (date.isValid) {
        draft.observationDate = date.toISODate();
      }
    });

    const queryString = qs.stringify(updatedUrlQuery);
    history.push({
      search: `?${queryString}`,
    });
  };

  return { queryParams, setObservationDate };
};
