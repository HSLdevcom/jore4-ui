import { Priority } from '../../types/Priority';
import { useUrlQuery } from '../urlQuery/useUrlQuery';

export type SearchConditions = {
  priorities: Priority[];
  label: string;
};

/** Enum for different search result options */
export enum DisplayedSearchResultType {
  Routes = 'routes',
  Lines = 'lines',
}

export type FilterConditions = {
  displayedData: DisplayedSearchResultType;
};

/**
 * Search parameter object with search conditions and filter
 * conditions separately
 */
export type SearchParameters = {
  search: SearchConditions;
  filter: FilterConditions;
};

/**
 * Query string object where parameters are in string format
 */
export type QueryStringParameters = {
  priorities: string;
  label: string;
  displayedData: string;
};

/**
 * Query string object where parameters are deserialized and validated
 * in their correct format
 */
export type DeserializedQueryStringParameters = {
  priorities: Priority[];
  label: string;
  displayedData: DisplayedSearchResultType;
};

/**
 * Parses the values in to integer and only accept values that are
 * exsiting type of {Priority}
 * @param priorities Priorities array in string format (csv).
 */
export const parseAndValidatePriorities = (priorities: string) =>
  priorities
    .split(',')
    .map((p) => parseInt(p, 10))
    .filter((p) => Object.values(Priority).includes(p));

/**
 * If displayedData query string is not given or is invalid,
 * default to Lines
 */
const mapDisplayedData = (displayedData: string) => {
  if (
    Object.values(DisplayedSearchResultType).includes(
      displayedData as DisplayedSearchResultType,
    )
  ) {
    return displayedData as DisplayedSearchResultType;
  }

  return DisplayedSearchResultType.Lines;
};

/**
 * Returns parsed and validated priorities if priority query string
 * is existing. If the query string is not given, return default
 * priorities
 * @param priorities Priorities array in string format (csv).
 */
const getPriorities = (priorities: string) => {
  const defaultPriorities = [Priority.Standard, Priority.Temporary];

  return priorities === undefined
    ? defaultPriorities
    : parseAndValidatePriorities(priorities);
};

/**
 * Deserializes and validates the query parameters in to correct types
 * @param queryParams Object with parameters in string format
 */
const deserializeParameters = (
  queryParams: QueryStringParameters,
): SearchParameters => {
  return {
    search: {
      label: queryParams.label || '',
      priorities: getPriorities(queryParams.priorities),
    },
    filter: {
      displayedData: mapDisplayedData(queryParams.displayedData),
    },
  };
};

export const useSearchQueryParser = () => {
  const { queryParams } = useUrlQuery();

  return deserializeParameters(queryParams as QueryStringParameters);
};
