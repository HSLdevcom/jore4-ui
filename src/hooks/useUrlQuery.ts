import qs from 'qs';
import { useLocation } from 'react-router-dom';

export const useUrlQuery = () => {
  const query = useLocation().search;
  return qs.parse(query, { ignoreQueryPrefix: true });
};
