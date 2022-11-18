import { produce } from 'immer';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Priority } from '../../types/Priority';
import { DisplayedSearchResultType } from '../../utils';
import { QueryParameter, QueryParameterTypes, useUrlQuery } from '../urlQuery';
import {
  DeserializedQueryStringParameters,
  FilterConditions,
  useSearchQueryParser,
} from './useSearchQueryParser';

export const useSearch = () => {
  const history = useHistory();
  // basePath is the first part of the URL path (e.g. 'routes' or 'timetables').
  // We need to check this path and use it in the methods to direct the search
  // to the correct path, because we have different search result paths and we
  // have the search component in multiple different pathed urls.
  const basePath = history.location.pathname.split('/')[1];
  const queryParameters = useSearchQueryParser();
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
      pathname: `/${basePath}/search`,
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
      pathname: `/${basePath}/search`,
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
