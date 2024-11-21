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

function buildSearchStopsObservationDateFilter({
  observationDate,
}: StopSearchFilters): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const dateString = observationDate.toISODate();
  return {
    validity_start: { _gte: dateString },
    _or: [
      { validity_end: { _lte: dateString } },
      { validity_end: { _is_null: true } },
    ],
  };
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

  const observationDateFilter = buildSearchStopsObservationDateFilter(filters);

  return {
    _and: [
      queryFilter,
      elyNumberFilter,
      municipalityFilter,
      observationDateFilter,
    ],
  };
}
