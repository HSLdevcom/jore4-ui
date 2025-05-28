import qs from 'qs';
import { useNavigate } from 'react-router';

export const useReturnToQueryParam = () => {
  const navigate = useNavigate();

  /**
   *  Attaches the 'returnTo' url to query string. This is used to return to the
   *  same line timetable view from where we opened the versions page. This is
   *  needed because we need to use line label in the versions page rather than
   *  line id.
   */
  const getUrlWithReturnToQueryString = (url: string, returnToId: UUID) => {
    const returnToQueryString = qs.stringify({ returnTo: returnToId });

    return `${url}?${returnToQueryString}`;
  };

  const onClose = (pathname: string) => {
    navigate({
      pathname,
    });
  };

  return { getUrlWithReturnToQueryString, onClose };
};
