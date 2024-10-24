import { StopsDatabaseStopPlaceNewestVersionBoolExp } from '../../../../generated/graphql';
import { StopRegistryMunicipality } from '../../../../types/enums';
import {
  AllOptionEnum,
  buildOptionalSearchConditionGqlFilter,
  buildSearchStopByLabelOrNameFilter,
  buildTiamatAddressLikeGqlFilter,
  buildTiamatMunicipalityGqlFilter,
  buildTiamatPrivateCodeLikeGqlFilter,
  mapToSqlLikeValue,
} from '../../../../utils';
import { SearchBy, StopSearchFilters } from '../types';

function buildSearchStopsQueryFilter(
  filters: StopSearchFilters,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  if (filters.searchBy === SearchBy.LabelOrName) {
    return buildSearchStopByLabelOrNameFilter(filters.query);
  }

  if (filters.searchBy === SearchBy.Address) {
    return buildOptionalSearchConditionGqlFilter<
      string,
      StopsDatabaseStopPlaceNewestVersionBoolExp
    >(mapToSqlLikeValue(filters.query), buildTiamatAddressLikeGqlFilter);
  }

  return {};
}

function buildSearchStopsMunicipalityFilter({
  municipalities,
}: StopSearchFilters): StopsDatabaseStopPlaceNewestVersionBoolExp {
  if (municipalities.includes(AllOptionEnum.All)) {
    return {};
  }

  return buildTiamatMunicipalityGqlFilter(
    municipalities as Array<StopRegistryMunicipality>,
  );
}

export function buildSearchStopsGqlQueryVariables(
  filters: StopSearchFilters,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const queryFilter = buildSearchStopsQueryFilter(filters);

  const elyNumberFilter = buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseStopPlaceNewestVersionBoolExp
  >(mapToSqlLikeValue(filters.elyNumber), buildTiamatPrivateCodeLikeGqlFilter);

  const municipalityFilter = buildSearchStopsMunicipalityFilter(filters);

  return {
    ...queryFilter,
    ...elyNumberFilter,
    ...municipalityFilter,
  };
}
