import isEmpty from 'lodash/isEmpty';
import { StopsDatabaseQuayNewestVersionBoolExp } from '../../../../generated/graphql';
import { knownPriorityValues } from '../../../../types/enums';
import {
  AllOptionEnum,
  buildOptionalSearchConditionGqlFilter,
  mapToSqlLikeValue,
} from '../../../../utils';
import { buildSearchStopByLabelOrNameFilter } from '../../utils/buildSearchStopByLabelOrNameFilter';
import { SearchBy, StopSearchFilters } from '../types';

enum TiamatKeyValueKeys {
  Address = 'streetAddress',
}

function buildKeyValueLikeFilter(
  key: TiamatKeyValueKeys,
  value: string,
): StopsDatabaseQuayNewestVersionBoolExp {
  return {
    quay_key_values: {
      key_values_key: { _eq: key },
      value: { value_items: { items: { _ilike: value } } },
    },
  };
}

function buildAddressLikeFilter(value: string) {
  return buildKeyValueLikeFilter(TiamatKeyValueKeys.Address, value);
}

function buildSearchStopsQueryFilter(
  filters: StopSearchFilters,
): StopsDatabaseQuayNewestVersionBoolExp {
  if (filters.searchBy === SearchBy.LabelOrName) {
    return buildSearchStopByLabelOrNameFilter(filters.query);
  }

  if (filters.searchBy === SearchBy.Address) {
    return buildOptionalSearchConditionGqlFilter<
      string,
      StopsDatabaseQuayNewestVersionBoolExp
    >(mapToSqlLikeValue(filters.query), buildAddressLikeFilter);
  }

  return {};
}

function buildElyNumberFilter(
  value: string,
): StopsDatabaseQuayNewestVersionBoolExp {
  return {
    ely_code: { _ilike: value },
  };
}

function buildSearchStopsMunicipalityFilter({
  municipalities,
}: StopSearchFilters): StopsDatabaseQuayNewestVersionBoolExp {
  if (municipalities.includes(AllOptionEnum.All)) {
    return {};
  }

  return { stop_place: { topographic_place_id: { _in: municipalities } } };
}

function buildSearchStopsObservationDateFilter({
  observationDate,
}: StopSearchFilters): StopsDatabaseQuayNewestVersionBoolExp {
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
}: StopSearchFilters): StopsDatabaseQuayNewestVersionBoolExp {
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
): StopsDatabaseQuayNewestVersionBoolExp {
  const queryFilter = buildSearchStopsQueryFilter(filters);

  const elyNumberFilter = buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseQuayNewestVersionBoolExp
  >(mapToSqlLikeValue(filters.elyNumber), buildElyNumberFilter);

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
