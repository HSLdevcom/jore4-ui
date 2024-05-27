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
const DEFAULT_SEARCH_BY = 'label';

export const useStopSearchQueryParser = () => {
  const { getStringParamFromUrlQuery } = useUrlQuery();
  const searchKey =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.SearchKey) ??
    DEFAULT_SEARCH_KEY;
  const searchBy =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.searchBy) ??
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
