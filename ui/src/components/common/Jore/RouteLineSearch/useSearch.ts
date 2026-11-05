import { produce } from 'immer';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { ReusableComponentsVehicleModeEnum } from '../../../../generated/graphql';
import {
  mapObjectToQueryParameterObjects,
  useUrlQuery,
} from '../../../../hooks';
import { Priority } from '../../../../types/enums';
import { AllOptionEnum } from '../../../../utils';
import {
  DisplayedSearchResultType,
  SearchConditions,
  SearchNavigationState,
} from './Types';
import { FilterConditions, useSearchQueryParser } from './useSearchQueryParser';

export function useSearch() {
  const { pathname } = useLocation();
  const queryParameters = useSearchQueryParser();
  const { setMultipleParametersToUrlQuery } = useUrlQuery();

  const [searchConditions, setSearchConditions] = useState(
    queryParameters.search,
  );

  const setSearchCondition = (
    condition: string,
    value:
      | string
      | ReadonlyArray<Priority>
      | Temporal.PlainDate
      | ReadonlyArray<ReusableComponentsVehicleModeEnum>
      | AllOptionEnum,
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
      pathname,
    });
  };

  /**
   * Pushes selected search conditions and live filters to query string.
   * This will trigger GraphQL request, if the searchConditions have changed.
   */
  const handleSearch = (
    combinedFilters: Readonly<SearchConditions>,
    state?: SearchNavigationState,
  ) => {
    setMultipleParametersToUrlQuery({
      parameters: mapObjectToQueryParameterObjects(combinedFilters),
      pathname,
      state,
    });
  };

  /**
   * Basically resets the search, better implementation will follow
   */
  const handleClose = (state?: SearchNavigationState) => {
    setMultipleParametersToUrlQuery({
      parameters: mapObjectToQueryParameterObjects({
        observationDate: queryParameters.search.observationDate,
      }),
      pathname,
      state,
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
}
