import { StopsDatabaseStopPlaceNewestVersionBoolExp } from '../../generated/graphql';
import {
  buildTiamatStopQuayPublicCodeLikeGqlFilter,
  buildTiamatStopQuayPublicCodeOrNameLikeGqlFilter,
} from '../gql';
import {
  buildOptionalSearchConditionGqlFilter,
  mapToSqlLikeValue,
} from '../search';

/** By design, we only accept search by name when the input is at least 4 characters.
 * @deprecated TODO: 2 versions need to exist for now. This old version is still used by by MemberStops functionality of the StopAreas. For witch the refactoring happens on another ticker. New version lives in: ui/src/components/stop-registry/utils/buildSearchStopByLabelOrNameFilter.ts  Remeber to remove unused functions from ui/src/utils/gql.ts
 */
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
