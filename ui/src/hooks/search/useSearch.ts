import { produce } from 'immer';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Priority } from '../../types/enums';
import { DisplayedSearchResultType } from '../../utils';
import { mapObjectToQueryParameterObjects, useUrlQuery } from '../urlQuery';
import { useBasePath } from '../useBasePath';
import { FilterConditions, useSearchQueryParser } from './useSearchQueryParser';

export const useSearch = () => {
  const { basePath } = useBasePath();
  const queryParameters = useSearchQueryParser();
  const { setMultipleParametersToUrlQuery } = useUrlQuery();

  const [searchConditions, setSearchConditions] = useState(
    queryParameters.search,
  );

  const setSearchCondition = (
    condition: string,
    value: string | ReadonlyArray<Priority> | DateTime,
  ) => {
    setSearchConditions({
      ...searchConditions,
      [condition]: value,
    });
  };

  /**
   * Filters modify result table instantly by immediately pushing the
   * change to query string. This will not trigger a GraphQL request because
   * filtering is done only in front end.
   */
  const setFilter = (
    filterName: keyof FilterConditions,
    value: DisplayedSearchResultType,
  ) => {
    const newParameters = produce(queryParameters, (draft) => {
      draft.filter[filterName] = value;
    });

    const combinedParameters = {
      ...newParameters.filter,
      ...queryParameters.search,
    };

    setMultipleParametersToUrlQuery({
      parameters: mapObjectToQueryParameterObjects(combinedParameters),
      pathname: `${basePath}/search`,
    });
  };

  /**
   * Pushes selected search conditions and live filters to query string.
   * This will trigger GraphQL request, if the searchConditions have changed.
   */
  const handleSearch = () => {
    const combinedParameters = {
      ...searchConditions,
      ...queryParameters.filter,
    };

    setMultipleParametersToUrlQuery({
      parameters: mapObjectToQueryParameterObjects(combinedParameters),
      pathname: `${basePath}/search`,
    });
  };

  /**
   * Navigates back to '/routes' but retains the query parameters.
   */
  const handleClose = () => {
    const combinedParameters = {
      ...queryParameters.filter,
      ...queryParameters.search,
    };

    setMultipleParametersToUrlQuery({
      parameters: mapObjectToQueryParameterObjects(combinedParameters),
      pathname: `${basePath}`,
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
