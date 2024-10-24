import { StopsDatabaseStopPlaceNewestVersionBoolExp } from '../../generated/graphql';
import {
  buildTiamatStopQuayPublicCodeLikeGqlFilter,
  buildTiamatStopQuayPublicCodeOrNameLikeGqlFilter,
} from '../gql';
import {
  buildOptionalSearchConditionGqlFilter,
  mapToSqlLikeValue,
} from '../search';

// By design, we only accept search by name when the input is at least 4 characters.
export function buildSearchStopByLabelOrNameFilter(
  query: string,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const labelOrNameFilterToUse =
    query.length >= 4
      ? buildTiamatStopQuayPublicCodeOrNameLikeGqlFilter
      : buildTiamatStopQuayPublicCodeLikeGqlFilter;

  return buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseStopPlaceNewestVersionBoolExp
  >(mapToSqlLikeValue(query), labelOrNameFilterToUse);
}
