import { DateTime } from 'luxon';
import {
  GeometryComparisonExp,
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
  StopsDatabaseStopPlaceNewestVersionBoolExp,
} from '../generated/graphql';
import { Viewport } from '../redux/types/mapModal';
import { Priority, TimetablePriority } from '../types/enums';
import { AllOptionEnum } from './enum';

/** Builds an object for gql to filter out all
 * results which are not active on the given date
 */
export const buildActiveDateGqlFilter = (date?: DateTime | null) => ({
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
});

/**
 * Builds an object for gql to filter out all
 * results which are not active on the given date range
 */
export const buildActiveDateRangeGqlFilter = (
  startDate: DateTime,
  endDate: DateTime,
) => ({
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
});

/** Builds an object for gql to filter out all drafts if
 * the given priority is not draft itself
 */
export const buildDraftPriorityGqlFilter = (priority?: Priority) => ({
  priority: {
    _nin: priority !== Priority.Draft ? [Priority.Draft] : [],
  },
});

/** Builds an object for gql to filter out all but the given priority */
export const buildPriorityEqualGqlFilter = (priority: Priority) => ({
  priority: {
    _eq: priority,
  },
});

/** Builds an object for gql to filter out all but the given Priority */
export const buildPriorityInGqlFilter = (
  priorities: ReadonlyArray<Priority>,
) => ({
  priority: {
    _in: priorities as Priority[],
  },
});

/**
 * Builds an object for gql to filter out all but the given TimetablePriority
 */
export const buildTimetablePriorityInGqlFilter = (
  priorities: ReadonlyArray<TimetablePriority>,
) => ({
  priority: {
    _in: priorities,
  },
});

/** Builds an object for gql to filter by label */
export const buildLabelGqlFilter = (label?: string | null) => ({
  label: { _eq: label },
});

/** Builds an object for gql to filter by labels */
export const buildLabelInGqlFilter = (labels?: ReadonlyArray<string>) => ({
  label: { _in: labels },
});

/** Builds an object for gql to filter by variant */
export const buildVariantGqlFilter = (variant?: number | null) => ({
  variant: variant === null ? { _is_null: true } : { _eq: variant },
});

/** Builds an object for gql to filter by label using the '_like' operator.
 * This will means that all the '%' in the label are considered as 'any'
 */
export const buildLabelLikeGqlFilter = (label?: string) => ({
  label: { _like: label },
});

/** Builds an object for gql to filter route by line label */
export const buildRouteLineLabelGqlFilter = (label: string) => ({
  route_line: buildLabelGqlFilter(label),
});

export const buildWithinViewportGqlGeometryFilter = (
  viewport: Viewport,
): GeometryComparisonExp => {
  const [[west, south], [east, north]] = viewport.bounds;

  return {
    _st_within: {
      type: 'Polygon',
      coordinates: [
        [
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south],
        ],
      ],
    },
  };
};

/** Builds an object for gql to filter by primary_vehicle_mode */
export const buildPrimaryVehicleModeGqlFilter = (
  primaryVehicleMode:
    | ReadonlyArray<ReusableComponentsVehicleModeEnum>
    | AllOptionEnum,
) => {
  if (primaryVehicleMode === AllOptionEnum.All) {
    return {};
  }

  return {
    primary_vehicle_mode: {
      _in: primaryVehicleMode,
    },
  };
};

/** Builds an object for gql to filter by typeOfLine */
export const buildTypeOfLineGqlFilter = (typeOfLine: RouteTypeOfLineEnum) => ({
  type_of_line: {
    _eq: typeOfLine,
  },
});

export const buildTiamatStopQuayPublicCodeLikeGqlFilter = (
  label: string,
): StopsDatabaseStopPlaceNewestVersionBoolExp => ({
  stop_place_quays: {
    quay: {
      public_code: { _ilike: label },
    },
  },
});

enum LANG {
  SWE = 'swe',
  FIN = 'fin',
}

enum NAME_TYPE {
  TRANSLATION = 'TRANSLATION',
  ALIAS = 'ALIAS',
  LABEL = 'LABEL',
}

const buildLanguageFilter = (
  label: string,
  lang: LANG,
): StopsDatabaseStopPlaceNewestVersionBoolExp => {
  return {
    name_value: { _ilike: label },
    name_lang: { _eq: lang },
  };
};

const buildAlternativeNameFilter = (
  label: string,
  nameType: NAME_TYPE,
  lang: LANG,
): StopsDatabaseStopPlaceNewestVersionBoolExp => ({
  stop_place_alternative_names: {
    alternative_name: {
      name_value: { _ilike: label },
      name_type: { _eq: nameType },
      name_lang: { _eq: lang },
    },
  },
});

export const buildShortNameFilter = (
  label: string,
  nameType: NAME_TYPE,
  lang: LANG,
): StopsDatabaseStopPlaceNewestVersionBoolExp => ({
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
});

export const buildTiamatStopQuayPublicCodeOrNameLikeGqlFilter = (
  label: string,
) => ({
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
});
