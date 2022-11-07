import { DisplayedSearchResultType } from '../../utils/enum';
import { useUrlQuery } from '../urlQuery/useUrlQuery';

export type TimetablesSearchConditions = {
  label: string;
};

export type TimetablesFilterConditions = {
  displayedData: DisplayedSearchResultType;
};

/**
 * Search parameter object with search conditions and filter
 * conditions separately
 */
export type TimetablesSearchParameters = {
  search: TimetablesSearchConditions;
  filter: TimetablesFilterConditions;
};

/**
 * Query string object where parameters are in string format
 */
export type TimetablesQueryStringParameters = {
  label: string;
  displayedData: string;
};

/**
 * Query string object where parameters are deserialized and validated
 * in their correct format
 */
export type TimetablesDeserializedQueryStringParameters = {
  label: string;
  displayedData: DisplayedSearchResultType;
};

export enum SearchQueryParameterNames {
  Label = 'label',
  DisplayedData = 'displayedData',
}

const DEFAULT_DISPLAYED_DATA = DisplayedSearchResultType.Lines;
const DEFAULT_LABEL = '';

export const useTimetablesSearchQueryParser =
  (): TimetablesSearchParameters => {
    const {
      getStringParamFromUrlQuery,
      getDisplayedSearchResultTypeFromUrlQuery,
    } = useUrlQuery();
    const label =
      getStringParamFromUrlQuery(SearchQueryParameterNames.Label) ??
      DEFAULT_LABEL;

    const displayedData =
      getDisplayedSearchResultTypeFromUrlQuery(
        SearchQueryParameterNames.DisplayedData,
      ) ?? DEFAULT_DISPLAYED_DATA;

    return {
      search: {
        label,
      },
      filter: {
        displayedData,
      },
    };
  };
