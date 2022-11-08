import { produce } from 'immer';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Priority } from '../../types/Priority';
import { DisplayedSearchResultType } from '../../utils';
import { QueryParameter, QueryParameterTypes, useUrlQuery } from '../urlQuery';
import {
  DeserializedQueryStringParameters,
  FilterConditions,
  useRoutesAndLinesSearchQueryParser,
} from './useRoutesAndLinesSearchQueryParser';

/**
 * Common search hook. Takes basePath as parameter, which will be used when
 * handling filter setting, searching and closing.
 * For example using 'routes-and-lines' as basePath will direct searches to
 * '/routes-and-lines/search' and closing the search will direct to
 * '/routes-and-lines'
 */
export const useSearch = ({ basePath }: { basePath: string }) => {
  const queryParameters = useRoutesAndLinesSearchQueryParser();
  const { setMultipleParametersToUrlQuery } = useUrlQuery();

  const [searchConditions, setSearchConditions] = useState(
    queryParameters.search,
  );

  const setSearchCondition = (
    condition: string,
    value: string | Priority[] | DateTime,
  ) => {
    setSearchConditions({
      ...searchConditions,
      [condition]: value,
    });
  };

  /**
   * Maps the search parameters in to QueryParameter<QueryParameterTypes> for
   * setMultipleParametersToUrlQuery function.
   */
  const mapSearchParametersToQueryParameterObjects = (
    searchParameters: DeserializedQueryStringParameters,
  ): QueryParameter<QueryParameterTypes>[] => {
    return Object.entries(searchParameters).map(([key, value]) => {
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
      parameters:
        mapSearchParametersToQueryParameterObjects(combinedParameters),
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
      parameters:
        mapSearchParametersToQueryParameterObjects(combinedParameters),
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
      parameters:
        mapSearchParametersToQueryParameterObjects(combinedParameters),
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
