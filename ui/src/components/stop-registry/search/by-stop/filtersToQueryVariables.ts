import isEmpty from 'lodash/isEmpty';
import { StopsDatabaseQuayNewestVersionBoolExp } from '../../../../generated/graphql';
import {
  StopRegistryMunicipality,
  knownPriorityValues,
} from '../../../../types/enums';
import {
  AllOptionEnum,
  NullOptionEnum,
  buildOptionalSearchConditionGqlFilter,
  mapToSqlLikeValue,
} from '../../../../utils';
import { buildSearchStopByLabelOrNameFilter } from '../../utils/buildSearchStopByLabelOrNameFilter';
import {
  InfoSpotSize,
  SearchBy,
  StopSearchFilters,
  StringMunicipality,
} from '../types';

function toTiamatDBEnumCase(str: string) {
  return str.toUpperCase();
}

function buildAddressLikeFilter(
  value: string,
): StopsDatabaseQuayNewestVersionBoolExp {
  return { street_address: { _ilike: value } };
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

  return {
    stop_place: {
      topographic_place_id: {
        _in: municipalities.map(
          (name) =>
            (
              StopRegistryMunicipality as unknown as Readonly<
                Record<StringMunicipality, number>
              >
            )[name as StringMunicipality],
        ),
      },
    },
  };
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

function buildTransportationModeFilter({
  transportationMode,
}: StopSearchFilters): StopsDatabaseQuayNewestVersionBoolExp {
  if (transportationMode.includes(AllOptionEnum.All)) {
    return {};
  }

  return {
    stop_place: {
      transport_mode: {
        _in: transportationMode.map(toTiamatDBEnumCase),
      },
    },
  };
}

function buildStopStateFilter({
  stopState,
}: StopSearchFilters): StopsDatabaseQuayNewestVersionBoolExp {
  if (stopState.includes(AllOptionEnum.All)) {
    return {};
  }

  return { stop_state: { _in: stopState } };
}

function buildShelterFilter({
  shelter,
}: StopSearchFilters): StopsDatabaseQuayNewestVersionBoolExp {
  if (shelter.includes(AllOptionEnum.All)) {
    return {};
  }

  if (shelter.includes(NullOptionEnum.Null)) {
    return {
      _not: {
        equipments: { installed: { dtype: { _eq: 'ShelterEquipment' } } },
      },
    };
  }

  return {
    equipments: {
      installed: {
        dtype: { _eq: 'ShelterEquipment' },
        shelter_type: { _in: shelter.map(toTiamatDBEnumCase) },
      },
    },
  };
}

function buildElectricityFilter({
  electricity,
}: StopSearchFilters): StopsDatabaseQuayNewestVersionBoolExp {
  if (electricity.includes(AllOptionEnum.All)) {
    return {};
  }

  if (electricity.includes(NullOptionEnum.Null)) {
    return {
      _or: [
        // Has no shelter at all
        {
          _not: {
            equipments: { installed: { dtype: { _eq: 'ShelterEquipment' } } },
          },
        },
        // Or no shelters with electricity
        {
          _not: {
            equipments: {
              installed: {
                dtype: { _eq: 'ShelterEquipment' },
                shelter_electricity: { _is_null: false },
              },
            },
          },
        },
      ],
    };
  }

  return {
    equipments: {
      installed: {
        dtype: { _eq: 'ShelterEquipment' },
        shelter_electricity: { _in: electricity.map(toTiamatDBEnumCase) },
      },
    },
  };
}

function isSizeObject(
  value: StopSearchFilters['infoSpots'][number],
): value is InfoSpotSize {
  return typeof value === 'object';
}

function buildInfoSpotsFilter({
  infoSpots,
}: StopSearchFilters): StopsDatabaseQuayNewestVersionBoolExp {
  if (infoSpots.includes(AllOptionEnum.All)) {
    return {};
  }

  if (infoSpots.includes(NullOptionEnum.Null)) {
    // Aka, where does not exist
    return { _not: { info_spot_locations: {} } };
  }

  return {
    info_spot_locations: {
      info_spot: {
        _or: infoSpots.filter(isSizeObject).map(({ width, height }) => ({
          width: { _eq: width },
          height: { _eq: height },
        })),
      },
    },
  };
}

export function buildSearchStopsGqlQueryVariables(
  filters: StopSearchFilters,
  extraConditions: StopsDatabaseQuayNewestVersionBoolExp = {},
): StopsDatabaseQuayNewestVersionBoolExp {
  const queryFilter = buildSearchStopsQueryFilter(filters);

  const elyNumberFilter = buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseQuayNewestVersionBoolExp
  >(mapToSqlLikeValue(filters.elyNumber), buildElyNumberFilter);

  const municipalityFilter = buildSearchStopsMunicipalityFilter(filters);
  const observationDateFilter = buildSearchStopsObservationDateFilter(filters);
  const priorityFilter = buildSearchStopsPriorityFilter(filters);
  const transportationModeFilter = buildTransportationModeFilter(filters);
  const stopStateFilter = buildStopStateFilter(filters);
  const shelterFilter = buildShelterFilter(filters);
  const electricityFilter = buildElectricityFilter(filters);
  const infoSpotsFilter = buildInfoSpotsFilter(filters);

  return {
    _and: [
      queryFilter,
      elyNumberFilter,
      municipalityFilter,
      observationDateFilter,
      priorityFilter,
      transportationModeFilter,
      stopStateFilter,
      shelterFilter,
      electricityFilter,
      infoSpotsFilter,
      extraConditions,
    ].filter((filter) => !isEmpty(filter)),
  };
}
