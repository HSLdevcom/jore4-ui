import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Priority } from '../../types/Priority';
import { createQueryParamString } from '../../utils/search';
import {
  SearchConditions,
  SearchParameters,
  useSearchQueryParser,
} from './useSearchQueryParser';

export const useSearch = (): {
  queryParameters: SearchParameters;
  searchConditions: SearchConditions;
  setSearchCondition: (condition: string, value: string | Priority[]) => void;
  setFilter: (filterName: string, value: boolean) => void;
  handleSearch: () => void;
  handleClose: () => void;
} => {
  const history = useHistory();
  const queryParameters = useSearchQueryParser();

  const [searchConditions, setSearchConditions] = useState(
    queryParameters.search,
  );

  const setSearchCondition = useCallback(
    (condition: string, value: string | Priority[]) => {
      setSearchConditions({
        ...searchConditions,
        [condition]: value,
      });
    },
    [searchConditions],
  );

  /**
   * Filters modify result table instantly by immediately
   * pushing the change to query string
   */
  const setFilter = useCallback(
    (filterName: string, value: boolean) => {
      const combinedParameters = {
        ...queryParameters,
        filter: {
          ...queryParameters.filter,
          [filterName]: value,
        },
      };
      history.push({
        pathname: '/routes/search',
        search: `${createQueryParamString(combinedParameters)}`,
        state: { update: true },
      });
    },
    [history, queryParameters],
  );

  /**
   * Pushes selected search conditions and live filters to query string
   */
  const handleSearch = () => {
    const combinedParameters = {
      search: { ...searchConditions },
      filter: { ...queryParameters.filter },
    };
    history.push({
      pathname: '/routes/search',
      search: `${createQueryParamString(combinedParameters)}`,
      state: { update: true },
    });
  };

  const handleClose = () => {
    history.push({
      pathname: '/routes',
      search: `${createQueryParamString(queryParameters)}`,
      state: { update: true },
    });
  };

  return {
    queryParameters,
    searchConditions,
    setSearchCondition,
    setFilter,
    handleSearch,
    handleClose,
  };
};
