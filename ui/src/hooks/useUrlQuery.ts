import qs from 'qs';
import { useLocation } from 'react-router-dom';

export const useUrlQuery = () => {
  const query = useLocation().search;
  const queryParams = qs.parse(query, { ignoreQueryPrefix: true });

  return queryParams;
};
