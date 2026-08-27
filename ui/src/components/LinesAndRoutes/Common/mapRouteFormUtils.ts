import { RouteAllFieldsFragment } from '../../../generated/graphql';
import { mapToISODate, parseDate } from '../../../time';
import { RouteDirection } from '../../../types/RouteDirection';
import {
  defaultLocalizedString,
  mapDateInputToValidityEnd,
} from '../../../utils';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';

export function mapRouteFormToInput(state: RouteFormState) {
  return {
    name_i18n: { fi_FI: state.finnishName },
    label: state.label,
    on_line_id: state.onLineId,
    variant: Number.isInteger(state.variant) ? state.variant : null,
    direction: state.direction,
    priority: state.priority,
    version_comment: state.versionComment?.trim() ?? null,
    validity_start: parseDate(state.validityStart),
    validity_end: mapDateInputToValidityEnd(
      state.validityEnd,
      state.indefinite,
    ),
    origin_name_i18n: defaultLocalizedString(state.origin?.name),
    origin_short_name_i18n: defaultLocalizedString(state.origin?.shortName),
    destination_name_i18n: defaultLocalizedString(state.destination?.name),
    destination_short_name_i18n: defaultLocalizedString(
      state.destination?.shortName,
    ),
  };
}

export function mapRouteToFormState(
  route: RouteAllFieldsFragment,
): RouteFormState {
  return {
    finnishName: route.name_i18n?.fi_FI ?? '',
    versionComment: '',
    label: route.label,
    onLineId: route.on_line_id,
    variant: route.variant ?? null,
    direction: route.direction as RouteDirection,
    priority: route.priority,
    validityStart: mapToISODate(route.validity_start) ?? '',
    validityEnd: mapToISODate(route.validity_end) ?? '',
    indefinite: !route.validity_end,
    origin: {
      name: defaultLocalizedString(route.origin_name_i18n),
      shortName: defaultLocalizedString(route.origin_short_name_i18n),
    },
    destination: {
      name: defaultLocalizedString(route.destination_name_i18n),
      shortName: defaultLocalizedString(route.destination_short_name_i18n),
    },
  };
}
