import { SearchBy } from '../../../components/stop-registry/search/SearchCriteriaRadioButtons';
import { StopRegistryMunicipality } from '../../../types/enums';
import { AllOptionEnum, getEnumValues } from '../../../utils';
import { useUrlQuery } from '../../urlQuery';

export type StopSearchConditions = {
  elyNumber: string;
  municipalities: string;
  address?: string;
  labelOrName?: string;
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
const DEFAULT_SEARCH_BY = SearchBy.LabelOrName;
const DEFAULT_MUNICIPALITIES = [
  ...getEnumValues(StopRegistryMunicipality),
  'all',
];

export const useStopSearchQueryParser = () => {
  const {
    getStringParamFromUrlQuery,
    getEnumFromUrlQuery,
    getEnumArrayFromUrlQuery,
  } = useUrlQuery();

  const getMunicipalitiesFromURLQuery = () => {
    const municipalitiesFromURLQuery = getEnumArrayFromUrlQuery(
      StopSearchQueryParameterNames.Municipalities,
      StopRegistryMunicipality,
    )?.map((m) => m.toString());

    if (
      municipalitiesFromURLQuery?.length ===
      Object.keys(StopRegistryMunicipality).length / 2
    ) {
      municipalitiesFromURLQuery.push(AllOptionEnum.All);
    }
    return municipalitiesFromURLQuery;
  };

  const searchKey =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.SearchKey) ??
    DEFAULT_SEARCH_KEY;
  const searchBy =
    getEnumFromUrlQuery(StopSearchQueryParameterNames.searchBy, SearchBy) ??
    DEFAULT_SEARCH_BY;
  const elyNumber =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.ELYNumber) ??
    DEFAULT_ELY_NUMBER;

  const municipalities = (
    getMunicipalitiesFromURLQuery() ?? DEFAULT_MUNICIPALITIES
  ).join(',');

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
