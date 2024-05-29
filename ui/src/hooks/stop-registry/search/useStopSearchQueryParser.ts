import { SearchBy } from '../../../components/stop-registry/search/SearchCriteriaRadioButtons';
import { Municipality } from '../../../types/enums';
import { AllOptionEnum, getEnumValues } from '../../../utils';
import { useUrlQuery } from '../../urlQuery';

export type StopSearchConditions = {
  elyNumber: string;
  municipalities: string;
  address?: string;
  label?: string;
};

export enum StopSearchQueryParameterNames {
  ELYNumber = 'elyNumber',
  Address = 'address',
  Municipalities = 'municipalities',
  SearchKey = 'searchKey',
  searchBy = 'searchBy',
}

const DEFAULT_ELY_NUMBER = '';
const DEFAULT_SEARCH_KEY = '';
const DEFAULT_SEARCH_BY = SearchBy.Label;
const DEFAULT_MUNICIPALITIES = [
  ...getEnumValues(Municipality),
  AllOptionEnum.All,
].join(',');

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
  const municipalities =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.Municipalities) ??
    DEFAULT_MUNICIPALITIES;

  return {
    search: {
      searchKey,
      searchBy,
      elyNumber,
      municipalities,
    },
    filter: {
      // TODO
    },
  };
};
