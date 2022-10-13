import { produce } from 'immer';
import { useState } from 'react';
import { Priority } from '../../types/Priority';
import { DisplayedSearchResultType } from '../../utils';
import { useUrlQuery } from '../urlQuery';
import {
  DeserializedQueryStringParameters,
  FilterConditions,
  useSearchQueryParser,
} from './useSearchQueryParser';

export const useSearch = () => {
  const queryParameters = useSearchQueryParser();
  const { setMultipleParametersToUrlQuery } = useUrlQuery();

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
   * Maps the deserialized search query parameters in to key, value pairs for
   * setMultipleParametersToUrlQuery function.
   */
  const mapObjectToQueryParameterObjects = (
    object: DeserializedQueryStringParameters,
  ) => {
    return Object.entries(object).map(([key, value]) => {
      return { paramName: key, value };
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
      parameters: [...mapObjectToQueryParameterObjects(combinedParameters)],
      pathname: '/routes/search',
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
      parameters: [...mapObjectToQueryParameterObjects(combinedParameters)],
      pathname: '/routes/search',
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
      parameters: [...mapObjectToQueryParameterObjects(combinedParameters)],
      pathname: '/routes',
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
