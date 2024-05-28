import { SearchBy } from '../../../components/stop-registry/search/SearchCriteriaRadioButtons';
import { useUrlQuery } from '../../urlQuery';

export type StopSearchConditions = {
  elyNumber: string;
  address?: string;
  label?: string;
};

export enum StopSearchQueryParameterNames {
  ELYNumber = 'elyNumber',
  SearchKey = 'searchKey',
  searchBy = 'searchBy',
}

const DEFAULT_ELY_NUMBER = '';
const DEFAULT_SEARCH_KEY = '';
const DEFAULT_SEARCH_BY = SearchBy.Label;

export const useStopSearchQueryParser = () => {
  const { getStringParamFromUrlQuery, getEnumFromUrlQuery } = useUrlQuery();
  const searchKey =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.SearchKey) ??
    DEFAULT_SEARCH_KEY;
  const searchBy =
    getEnumFromUrlQuery(StopSearchQueryParameterNames.searchBy, SearchBy) ??
    DEFAULT_SEARCH_BY;
  const elyNumber =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.ELYNumber) ??
    DEFAULT_ELY_NUMBER;

  return {
    search: {
      searchKey,
      searchBy,
      elyNumber,
    },
    filter: {
      // TODO
    },
  };
};
