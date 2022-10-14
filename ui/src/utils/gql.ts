import { DateTime } from 'luxon';
import {
  GeographyComparisonExp,
  ReusableComponentsVehicleModeEnum,
} from '../generated/graphql';
import { Viewport } from '../redux/types/modalMap';
import { Priority } from '../types/Priority';

/** Constructs an object for gql to filter out all
 * results which are not active on the given date
 */
export const constructActiveDateGqlFilter = (date?: DateTime | null) => ({
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

/** Constructs an object for gql to filter out all drafts if
 * the given priority is not draft itself
 */
export const constructDraftPriorityGqlFilter = (priority?: Priority) => ({
  priority: {
    _nin: priority !== Priority.Draft ? [Priority.Draft] : [],
  },
});

/** Constructs an object for gql to filter out all but the given priority */
export const constructPriorityEqualGqlFilter = (priority: Priority) => ({
  priority: {
    _eq: priority,
  },
});

/** Constructs an object for gql to filter out all but the given priority */
export const constructPriorityInGqlFilter = (priorities: Priority[]) => ({
  priority: {
    _in: priorities,
  },
});

/** Constructs an object for gql to filter by label */
export const constructLabelGqlFilter = (label?: string) => ({
  label: { _eq: label },
});

/** Constructs an object for gql to filter by label using the '_like' operator.
 * This will means that all the '%' in the label are considered as 'any'
 */
export const constructLabelLikeGqlFilter = (label?: string) => ({
  label: { _like: label },
});

/** Constructs an object for gql to filter route by line label */
export const constructRouteLineLabelGqlFilter = (label: string) => ({
  route_line: constructLabelGqlFilter(label),
});

export const constructWithinViewportGqlFilter = (
  viewport: Viewport,
): GeographyComparisonExp => ({
  _st_d_within: {
    from: {
      type: 'Point',
      coordinates: [viewport.longitude, viewport.latitude],
    },
    distance: viewport.radius,
  },
});

/** Constructs an object for gql to filter by primary_vehicle_mode */
export const constructPrimaryVehicleModeGqlFilter = (
  primaryVehicleMode: ReusableComponentsVehicleModeEnum,
) => ({
  primary_vehicle_mode: {
    _eq: primaryVehicleMode,
  },
});
