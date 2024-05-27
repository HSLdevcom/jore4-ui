import { useCallback, useState } from 'react';
import { Path } from '../../../router/routeDetails';
import { mapObjectToQueryParameterObjects, useUrlQuery } from '../../urlQuery';
import { useStopSearchQueryParser } from './useStopSearchQueryParser';

export const useStopSearch = () => {
  const { setMultipleParametersToUrlQuery } = useUrlQuery();
  const queryParameters = useStopSearchQueryParser();

  const [searchConditions, setSearchConditions] = useState(
    queryParameters.search,
  );

  const setSearchCondition = (condition: string, value: string) => {
    setSearchConditions({
      ...searchConditions,
      [condition]: value,
    });
  };

  const setSearchInputValue = (searchBy: string, value: string) => {
    setSearchCondition(searchBy, value);
  };

  /**
   * Pushes selected search conditions and live filters to query string.
   * This will trigger GraphQL request, if the searchConditions have changed.
   */
  const handleSearch = useCallback(() => {
    const combinedParameters = {
      ...searchConditions,
      ...queryParameters.filter,
    };

    setMultipleParametersToUrlQuery({
      parameters: mapObjectToQueryParameterObjects(combinedParameters),
      pathname: Path.stopSearch,
    });
  }, [
    queryParameters.filter,
    searchConditions,
    setMultipleParametersToUrlQuery,
  ]);

  /**
   * Navigates back to stop registry main view but retains the query parameters.
   */
  const handleClose = () => {
    const combinedParameters = {
      ...queryParameters.filter,
      ...queryParameters.search,
    };

    setMultipleParametersToUrlQuery({
      parameters: mapObjectToQueryParameterObjects(combinedParameters),
      pathname: Path.stopRegistry,
    });
  };

  return {
    setSearchCondition,
    setSearchInputValue,
    searchConditions,
    handleSearch,
    handleClose,
  };
};
