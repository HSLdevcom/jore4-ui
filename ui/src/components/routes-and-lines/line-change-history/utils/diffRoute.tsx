import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import {
  mapDirectionToUiName,
  mapPriorityToUiName,
} from '../../../../i18n/uiNameMappings';
import { mapToShortDate } from '../../../../time';
import {
  ChangedValue,
  diffKeyedValues,
  optionalFmt,
} from '../../../common/ChangeHistory';
import { RouteData } from '../types';
import { diffStopDrivingOrder } from './diffStopDrivingOrder';
import { diffTimingPoints } from './diffTimingPoints';
import { diffViaPoints } from './diffViaPoints';

export function diffRouteDetails(
  t: TFunction,
  previous: RouteData,
  current: RouteData,
): Array<ChangedValue> {
  const langCode = t(($) => $.languages.intlLangCode);

  const mapMeters = optionalFmt(
    new Intl.NumberFormat(langCode, {
      style: 'unit',
      unit: 'meter',
      maximumFractionDigits: 0,
    }),
  );

  return compact([
    diffKeyedValues({
      key: 'Label',
      field: t(($) => $.routes.label),
      oldValue: previous.label,
      newValue: current.label,
    }),
    diffKeyedValues({
      key: 'Variant',
      field: t(($) => $.routes.variant),
      oldValue: previous.variant,
      newValue: current.variant,
    }),
    diffKeyedValues({
      key: 'Direction',
      field: t(($) => $.routes.direction),
      oldValue: previous.direction,
      newValue: current.direction,
      mapper: (v) => mapDirectionToUiName(t, v),
    }),

    diffKeyedValues({
      key: 'NameFi',
      field: t(($) => $.routes.finnishName),
      oldValue: previous.name_i18n.fi_FI,
      newValue: current.name_i18n.fi_FI,
    }),
    diffKeyedValues({
      key: 'NameSv',
      field: t(($) => $.lineChangeHistory.extraFields.routeNameSwe),
      oldValue: previous.name_i18n.sv_FI,
      newValue: current.name_i18n.sv_FI,
    }),

    diffKeyedValues({
      key: 'DescriptionFi',
      field: t(($) => $.lineChangeHistory.extraFields.routeDescription),
      oldValue: previous.description_i18n?.fi_FI,
      newValue: current.description_i18n?.fi_FI,
    }),
    diffKeyedValues({
      key: 'DescriptionSv',
      field: t(($) => $.lineChangeHistory.extraFields.routeDescriptionSwe),
      oldValue: previous.description_i18n?.sv_FI,
      newValue: current.description_i18n?.sv_FI,
    }),

    diffKeyedValues({
      key: 'OriginNameFi',
      field: t(($) => $.routes.origin.name.fi_FI),
      oldValue: previous.origin_name_i18n?.fi_FI,
      newValue: current.origin_name_i18n?.fi_FI,
    }),
    diffKeyedValues({
      key: 'OriginNameSv',
      field: t(($) => $.routes.origin.name.sv_FI),
      oldValue: previous.origin_name_i18n?.sv_FI,
      newValue: current.origin_name_i18n?.sv_FI,
    }),

    diffKeyedValues({
      key: 'OriginNameShortFi',
      field: t(($) => $.routes.origin.shortName.fi_FI),
      oldValue: previous.origin_short_name_i18n?.fi_FI,
      newValue: current.origin_short_name_i18n?.fi_FI,
    }),
    diffKeyedValues({
      key: 'OriginNameShortSv',
      field: t(($) => $.routes.origin.shortName.sv_FI),
      oldValue: previous.origin_short_name_i18n?.sv_FI,
      newValue: current.origin_short_name_i18n?.sv_FI,
    }),

    diffKeyedValues({
      key: 'DestinationNameFi',
      field: t(($) => $.routes.destination.name.fi_FI),
      oldValue: previous.destination_name_i18n?.fi_FI,
      newValue: current.destination_name_i18n?.fi_FI,
    }),
    diffKeyedValues({
      key: 'DestinationNameSv',
      field: t(($) => $.routes.destination.name.sv_FI),
      oldValue: previous.destination_name_i18n?.sv_FI,
      newValue: current.destination_name_i18n?.sv_FI,
    }),

    diffKeyedValues({
      key: 'DestinationNameShortFi',
      field: t(($) => $.routes.destination.shortName.fi_FI),
      oldValue: previous.destination_short_name_i18n?.fi_FI,
      newValue: current.destination_short_name_i18n?.fi_FI,
    }),
    diffKeyedValues({
      key: 'DestinationNameShortSv',
      field: t(($) => $.routes.destination.shortName.sv_FI),
      oldValue: previous.destination_short_name_i18n?.sv_FI,
      newValue: current.destination_short_name_i18n?.sv_FI,
    }),

    diffKeyedValues({
      key: 'ValidityStart',
      field: t(($) => $.changeHistory.tableHeaders.validityStart),
      oldValue: previous.validity_start,
      newValue: current.validity_start,
      mapper: mapToShortDate,
    }),
    diffKeyedValues({
      key: 'ValidityEnd',
      field: t(($) => $.changeHistory.tableHeaders.validityEnd),
      oldValue: previous.validity_end,
      newValue: current.validity_end,
      mapper: mapToShortDate,
    }),
    diffKeyedValues({
      key: 'Priority',
      field: t(($) => $.priority.label),
      oldValue: previous.priority,
      newValue: current.priority,
      mapper: (v) => mapPriorityToUiName(t, v),
    }),

    diffKeyedValues({
      key: 'EstimatedLengthInMeters',
      field: t(($) => $.lineChangeHistory.extraFields.routeEstimatedLength),
      oldValue: previous.estimated_length_in_metres,
      newValue: current.estimated_length_in_metres,
      mapper: mapMeters,
    }),

    ...diffStopDrivingOrder(t, previous, current),
    ...diffViaPoints(t, previous, current),
    ...diffTimingPoints(t, previous, current),
  ]);
}
