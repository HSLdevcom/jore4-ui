import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { makeBackNavigationIsSafeState } from '../../../utils';
import { OpenMapUrlState } from '../../Map/Types';
import { mapUrlStateToSearch } from '../../Map/Utils/mapUrlState';

export function useNavigateToMap() {
  const navigate = useNavigate();

  return useCallback(
    (mapUrlState: OpenMapUrlState = {}) => {
      navigate(
        {
          pathname: '/map',
          search: `?${mapUrlStateToSearch(mapUrlState)}`,
        },
        { state: makeBackNavigationIsSafeState() },
      );
    },
    [navigate],
  );
}
