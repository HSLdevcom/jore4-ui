import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { makeBackNavigationIsSafeState } from '../../../hooks';
import { OpenMapUrlState } from '../types';
import { mapUrlStateToSearch } from './mapUrlState';

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
