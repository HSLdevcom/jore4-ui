import { StopsDatabaseStopPlaceNewestVersionBoolExp } from '../../generated/graphql';
import { StopSearchConditions } from '../../types';
import { StopRegistryMunicipality } from '../../types/enums';
import { AllOptionEnum } from '../enum';
import {
  buildTiamatAddressLikeGqlFilter,
  buildTiamatMunicipalityGqlFilter,
  buildTiamatPrivateCodeLikeGqlFilter,
  buildTiamatStopQuayPublicCodeLikeGqlFilter,
  buildTiamatStopQuayPublicCodeOrNameLikeGqlFilter,
} from '../gql';
import {
  buildOptionalSearchConditionGqlFilter,
  mapToSqlLikeValue,
} from '../search';

export function buildSearchStopsGqlQueryVariables(
  searchConditions: StopSearchConditions,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const labelOrName = searchConditions.labelOrName ?? '';

  // By design, we only accept search by name when the input is at least 4 characters.
  const labelOrNameFilterToUse =
    labelOrName.length >= 4
      ? buildTiamatStopQuayPublicCodeOrNameLikeGqlFilter
      : buildTiamatStopQuayPublicCodeLikeGqlFilter;

  const labelOrNameFilter = buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseStopPlaceNewestVersionBoolExp
  >(mapToSqlLikeValue(labelOrName), labelOrNameFilterToUse);

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
