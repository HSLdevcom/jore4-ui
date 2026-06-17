import { DateTime } from 'luxon';
import {
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
  StopsDatabaseStopPlaceNewestVersionBoolExp,
} from '../generated/graphql';
import { Priority } from '../types/enums';
import { AllOptionEnum } from './enum';

/** Builds an object for gql to filter out all
 * results which are not active on the given date
 */
export function buildActiveDateGqlFilter(date?: DateTime | null) {
  return {
    _and: [
      {
        _or: [
          { validity_start: { _lte: date } },
          { validity_start: { _is_null: true } },
        ],
      },
      {
        _or: [
          { validity_end: { _gte: date } },
          { validity_end: { _is_null: true } },
        ],
      },
    ],
  };
}

/**
 * Builds an object for gql to filter out all
 * results which are not active on the given date range
 */
export function buildActiveDateRangeGqlFilter(
  startDate: DateTime,
  endDate: DateTime,
) {
  return {
    _or: [
      {
        _and: [
          {
            _or: [
              { validity_start: { _lte: startDate } },
              { validity_start: { _is_null: true } },
            ],
          },
          {
            _or: [
              { validity_end: { _gte: startDate } },
              { validity_end: { _is_null: true } },
            ],
          },
        ],
      },
      {
        _and: [
          {
            _or: [
              { validity_start: { _lte: endDate } },
              { validity_start: { _is_null: true } },
            ],
          },
          {
            _or: [
              { validity_end: { _gte: startDate } },
              { validity_end: { _is_null: true } },
            ],
          },
        ],
      },
    ],
  };
}

/** Builds an object for gql to filter out all drafts if
 * the given priority is not draft itself
 */
export function buildDraftPriorityGqlFilter(priority?: Priority) {
  return {
    priority: { _nin: priority !== Priority.Draft ? [Priority.Draft] : [] },
  };
}

/** Builds an object for gql to filter out all but the given priority */
export function buildPriorityEqualGqlFilter(priority: Priority) {
  return { priority: { _eq: priority } };
}

/** Builds an object for gql to filter out all but the given Priority */
export function buildPriorityInGqlFilter(priorities: ReadonlyArray<Priority>) {
  return { priority: { _in: priorities } };
}

/** Builds an object for gql to filter by label */
export function buildLabelGqlFilter(label?: string | null) {
  return { label: { _eq: label } };
}

/** Builds an object for gql to filter by labels */
export function buildLabelInGqlFilter(labels?: ReadonlyArray<string>) {
  return { label: { _in: labels } };
}

/** Builds an object for gql to filter by label using the '_like' operator.
 * This will means that all the '%' in the label are considered as 'any'
 */
export function buildLabelLikeGqlFilter(label?: string) {
  return { label: { _like: label } };
}

/** Builds an object for gql to filter route by line label */
export function buildRouteLineLabelGqlFilter(label: string) {
  return { route_line: buildLabelGqlFilter(label) };
}

/** Builds an object for gql to filter by primary_vehicle_mode */
export function buildPrimaryVehicleModeGqlFilter(
  primaryVehicleMode: ReadonlyArray<
    ReusableComponentsVehicleModeEnum | AllOptionEnum
  >,
) {
  if (primaryVehicleMode.includes(AllOptionEnum.All)) {
    return {};
  }

  // Filter out any AllOptionEnum values, just in case to satisfy TS
  const filtered = primaryVehicleMode.filter(
    (mode): mode is ReusableComponentsVehicleModeEnum =>
      mode !== AllOptionEnum.All,
  );

  return { primary_vehicle_mode: { _in: filtered } };
}

/** Builds an object for gql to filter by typeOfLine */
export function buildTypeOfLineGqlFilter(typeOfLine: RouteTypeOfLineEnum) {
  return { type_of_line: { _eq: typeOfLine } };
}

export function buildTiamatStopQuayPublicCodeLikeGqlFilter(
  label: string,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  return { stop_place_quays: { quay: { public_code: { _ilike: label } } } };
}

enum LANG {
  SWE = 'swe',
  FIN = 'fin',
}

enum NAME_TYPE {
  TRANSLATION = 'TRANSLATION',
  ALIAS = 'ALIAS',
  LABEL = 'LABEL',
}

function buildLanguageFilter(
  label: string,
  lang: LANG,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  return {
    name_value: { _ilike: label },
    name_lang: { _eq: lang },
  };
}

function buildAlternativeNameFilter(
  label: string,
  nameType: NAME_TYPE,
  lang: LANG,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  return {
    stop_place_alternative_names: {
      alternative_name: {
        name_value: { _ilike: label },
        name_type: { _eq: nameType },
        name_lang: { _eq: lang },
      },
    },
  };
}

export function buildShortNameFilter(
  label: string,
  nameType: NAME_TYPE,
  lang: LANG,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  return {
    stop_place_quays: {
      quay: {
        quay_alternative_names: {
          alternative_name: {
            name_value: { _ilike: label },
            name_type: { _eq: nameType },
            name_lang: { _eq: lang },
          },
        },
      },
    },
  };
}

export function buildTiamatStopQuayPublicCodeOrNameLikeGqlFilter(
  label: string,
) {
  return {
    _or: [
      buildTiamatStopQuayPublicCodeLikeGqlFilter(label),
      buildLanguageFilter(label, LANG.FIN),
      buildAlternativeNameFilter(label, NAME_TYPE.TRANSLATION, LANG.SWE),
      buildAlternativeNameFilter(label, NAME_TYPE.ALIAS, LANG.FIN),
      buildAlternativeNameFilter(label, NAME_TYPE.ALIAS, LANG.SWE),
      buildAlternativeNameFilter(label, NAME_TYPE.LABEL, LANG.FIN),
      buildAlternativeNameFilter(label, NAME_TYPE.LABEL, LANG.SWE),
      buildShortNameFilter(label, NAME_TYPE.ALIAS, LANG.FIN),
      buildShortNameFilter(label, NAME_TYPE.ALIAS, LANG.SWE),
    ],
  };
}
