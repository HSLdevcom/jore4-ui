import { StopsDatabaseQuayNewestVersionBoolExp } from '../../../generated/graphql';
import {
  buildOptionalSearchConditionGqlFilter,
  mapToSqlLikeValue,
} from '../../../utils';

enum LANG {
  SWE = 'swe',
  FIN = 'fin',
}

enum NAME_TYPE {
  TRANSLATION = 'TRANSLATION',
  ALIAS = 'ALIAS',
  LABEL = 'LABEL',
  OTHER = 'OTHER',
}

function buildPublicCodeFilter(
  label: string,
): StopsDatabaseQuayNewestVersionBoolExp {
  return { public_code: { _ilike: label } };
}

function buildNameFilter(
  label: string,
  lang: LANG,
): StopsDatabaseQuayNewestVersionBoolExp {
  return {
    stop_place: {
      name_value: { _ilike: label },
      name_lang: { _eq: lang },
    },
  };
}

function buildAlternativeNameFilter(
  label: string,
  nameType: NAME_TYPE,
  lang: LANG,
): StopsDatabaseQuayNewestVersionBoolExp {
  return {
    stop_place: {
      stop_place_alternative_names: {
        alternative_name: {
          name_value: { _ilike: label },
          name_type: { _eq: nameType },
          name_lang: { _eq: lang },
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
      buildNameFilter(label, LANG.FIN),
      buildAlternativeNameFilter(label, NAME_TYPE.TRANSLATION, LANG.SWE),
      buildAlternativeNameFilter(label, NAME_TYPE.ALIAS, LANG.FIN),
      buildAlternativeNameFilter(label, NAME_TYPE.ALIAS, LANG.SWE),
      buildAlternativeNameFilter(label, NAME_TYPE.LABEL, LANG.FIN),
      buildAlternativeNameFilter(label, NAME_TYPE.LABEL, LANG.SWE),
      buildAlternativeNameFilter(label, NAME_TYPE.OTHER, LANG.FIN),
      buildAlternativeNameFilter(label, NAME_TYPE.OTHER, LANG.SWE),
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
