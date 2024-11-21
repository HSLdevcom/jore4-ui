import isEmpty from 'lodash/isEmpty';
import { StopsDatabaseStopPlaceNewestVersionBoolExp } from '../../../../generated/graphql';
import {
  StopRegistryMunicipality,
  knownPriorityValues,
} from '../../../../types/enums';
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
    validity_start: { _lte: dateString },
    _or: [
      { validity_end: { _gte: dateString } },
      { validity_end: { _is_null: true } },
    ],
  };
}

function buildSearchStopsPriorityFilter({
  priorities,
}: StopSearchFilters): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const allSelected =
    knownPriorityValues.length === priorities.length &&
    knownPriorityValues.every((prio) => priorities.includes(prio));
  if (allSelected) {
    return {};
  }

  return {
    priority: { _in: priorities.map(String) },
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

  const priorityFilter = buildSearchStopsPriorityFilter(filters);

  return {
    _and: [
      queryFilter,
      elyNumberFilter,
      municipalityFilter,
      observationDateFilter,
      priorityFilter,
    ].filter((filter) => !isEmpty(filter)),
  };
}
