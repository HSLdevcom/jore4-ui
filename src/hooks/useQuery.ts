import qs from 'qs';
import { useLocation } from 'react-router-dom';

export const useQuery = () => {
  const query = useLocation().search;
  return qs.parse(query, { ignoreQueryPrefix: true });
};
