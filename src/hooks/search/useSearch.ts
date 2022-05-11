import { produce } from 'immer';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Priority } from '../../types/Priority';
import { createQueryParamString } from '../../utils';
import {
  DisplayedSearchResultType,
  FilterConditions,
  useSearchQueryParser,
} from './useSearchQueryParser';

export const useSearch = () => {
  const history = useHistory();
  const queryParameters = useSearchQueryParser();

  const [searchConditions, setSearchConditions] = useState(
    queryParameters.search,
  );

  const setSearchCondition = (
    condition: string,
    value: string | Priority[],
  ) => {
    setSearchConditions({
      ...searchConditions,
      [condition]: value,
    });
  };

  /**
   * Filters modify result table instantly by immediately
   * pushing the change to query string
   */
  const setFilter = (
    filterName: keyof FilterConditions,
    value: DisplayedSearchResultType,
  ) => {
    const combinedParameters = produce(queryParameters, (draft) => {
      draft.filter[filterName] = value;
    });

    history.push({
      pathname: '/routes/search',
      search: `${createQueryParamString(combinedParameters)}`,
      state: { update: true },
    });
  };

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
