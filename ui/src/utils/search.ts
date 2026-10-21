import { RouteLineBoolExp, RouteRouteBoolExp } from '../generated/graphql';
import { AllOptionEnum } from './enum';

export function mapToSqlLikeValue(str: string) {
  return str.replaceAll('*', '%');
}

/**
 * Replaces UI wildcards (*) with SQL (%) wildcards.
 * Replaces consecutive runs of wildcards with singles.
 * Normalizes whitespace (only singular spaces expected).
 * Trims whitespace.
 * Assumes an empty or wildcard only query both refer
 * to "match all" case.
 *
 * Returns `null` on "match all" cases, so the where
 * condition can be completely dropped from the query.
 *
 * @param query
 */
export function queryToLike(query: string): string | null {
  const trimmed = query.trim();
  const sqlLike = trimmed.replaceAll('*', '%');
  const normalized = sqlLike.replaceAll(/\s+/g, ' ');

  if (normalized === '' || normalized === '%') {
    return null;
  }

  return normalized;
}

/** Build optional search condition filter. Returns
 * empty object if the filter is not set or is set to 'All', otherwise
 * returns the GQL filter built with the given function.
 * If the value is missing or is 'All', we return empty object because
 * we do not want to create the GQL filter at all.
 */
export function buildOptionalSearchConditionGqlFilter<
  TType,
  TBuildType = RouteLineBoolExp | RouteRouteBoolExp,
>(
  value: TType | AllOptionEnum.All | undefined | null,
  buildFunction: (value: TType) => TBuildType,
) {
  if (value && value !== AllOptionEnum.All) {
    return buildFunction(value);
  }
  return {};
}
