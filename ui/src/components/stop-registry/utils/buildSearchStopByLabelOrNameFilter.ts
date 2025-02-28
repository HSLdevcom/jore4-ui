import { StopsDatabaseQuayNewestVersionBoolExp } from '../../../generated/graphql';
import {
  buildOptionalSearchConditionGqlFilter,
  mapToSqlLikeValue,
} from '../../../utils';

function buildPublicCodeFilter(
  label: string,
): StopsDatabaseQuayNewestVersionBoolExp {
  return { public_code: { _ilike: label } };
}

function buildNameFilter(label: string): StopsDatabaseQuayNewestVersionBoolExp {
  return {
    stop_place: {
      name_value: { _ilike: label },
    },
  };
}

function buildAlternativeNameFilter(
  label: string,
): StopsDatabaseQuayNewestVersionBoolExp {
  return {
    stop_place: {
      stop_place_alternative_names: {
        alternative_name: {
          name_value: { _ilike: label },
        },
      },
    },
  };
}

function buildQuayPublicCodeOrNameFilter(
  label: string,
): StopsDatabaseQuayNewestVersionBoolExp {
  return {
    _or: [
      buildPublicCodeFilter(label),
      buildNameFilter(label),
      buildAlternativeNameFilter(label),
    ],
  };
}

export function buildSearchStopByLabelOrNameFilter(
  query: string,
): StopsDatabaseQuayNewestVersionBoolExp {
  const labelOrNameFilterToUse =
    query.length >= 4 ? buildQuayPublicCodeOrNameFilter : buildPublicCodeFilter;

  return buildOptionalSearchConditionGqlFilter<
    string,
    StopsDatabaseQuayNewestVersionBoolExp
  >(mapToSqlLikeValue(query), labelOrNameFilterToUse);
}
