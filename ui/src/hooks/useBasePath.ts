import { useLocation } from 'react-router';
import { Path } from '../router/routeDetails';

/**
 * Hook for getting the basePath from URL.
 * Base path is the first part of the URL path.
 * E.g. in '/routes/search?observationDate=2022-12-07' the basePath is '/routes'
 */
export const useBasePath = (): { basePath: Path } => {
  const location = useLocation();
  const basePath = `/${location.pathname.split('/')[1]}` as Path;

  return { basePath };
};
