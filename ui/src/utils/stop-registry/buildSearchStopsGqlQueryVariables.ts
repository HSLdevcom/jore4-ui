import { StopsDatabaseStopPlaceNewestVersionBoolExp } from '../../generated/graphql';
import { StopSearchConditions } from '../../types';
import { StopRegistryMunicipality } from '../../types/enums';
import { AllOptionEnum } from '../enum';
import {
  buildTiamatAddressLikeGqlFilter,
  buildTiamatMunicipalityGqlFilter,
  buildTiamatPrivateCodeLikeGqlFilter,
} from '../gql';
import {
  buildOptionalSearchConditionGqlFilter,
  mapToSqlLikeValue,
} from '../search';
import { buildSearchStopByLabelOrNameFilter } from './buildSearchStopByLabelOrNameFilter';

export function buildSearchStopsGqlQueryVariables(
  searchConditions: StopSearchConditions,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const labelOrNameFilter = buildSearchStopByLabelOrNameFilter(
    searchConditions.labelOrName ?? '',
  );

  const elyNumberFilter = buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseStopPlaceNewestVersionBoolExp
  >(
    mapToSqlLikeValue(searchConditions.elyNumber),
    buildTiamatPrivateCodeLikeGqlFilter,
  );

  const addressFilter = buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseStopPlaceNewestVersionBoolExp
  >(
    mapToSqlLikeValue(searchConditions.address ?? ''),
    buildTiamatAddressLikeGqlFilter,
  );

  const mapStringToMunicipalityEnums = (value: string) => {
    return value
      .split(',')
      .filter((s) => s !== AllOptionEnum.All)
      .map(
        (v) =>
          StopRegistryMunicipality[v as keyof typeof StopRegistryMunicipality],
      );
  };

  const municipalityFilter = buildOptionalSearchConditionGqlFilter<
    StopRegistryMunicipality[],
    StopsDatabaseStopPlaceNewestVersionBoolExp
  >(
    mapStringToMunicipalityEnums(searchConditions.municipalities),
    buildTiamatMunicipalityGqlFilter,
  );

  return {
    ...labelOrNameFilter,
    ...elyNumberFilter,
    ...addressFilter,
    ...municipalityFilter,
  };
}
