import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import {
  mapLineTypeToUiName,
  mapPriorityToUiName,
  mapTransportTargetToUiName,
} from '../../../../i18n/uiNameMappings';
import { mapToShortDate } from '../../../../time';
import { ChangedValue, diffKeyedValues } from '../../../common/ChangeHistory';
import { LineData } from '../types';

export function diffLine(
  t: TFunction,
  previous: LineData,
  current: LineData,
): Array<ChangedValue> {
  return compact([
    diffKeyedValues({
      key: 'NameFi',
      field: t('lines.name.fi_FI'),
      oldValue: previous.name_i18n.fi_FI,
      newValue: current.name_i18n.fi_FI,
    }),
    diffKeyedValues({
      key: 'NameSv',
      field: t('lines.name.sv_FI'),
      oldValue: previous.name_i18n.sv_FI,
      newValue: current.name_i18n.sv_FI,
    }),

    diffKeyedValues({
      key: 'ShortNameFi',
      field: t('lines.shortName.fi_FI'),
      oldValue: previous.short_name_i18n.fi_FI,
      newValue: current.short_name_i18n.fi_FI,
    }),
    diffKeyedValues({
      key: 'ShortNameSv',
      field: t('lines.shortName.fi_FI'),
      oldValue: previous.short_name_i18n.fi_FI,
      newValue: current.short_name_i18n.fi_FI,
    }),

    diffKeyedValues({
      key: 'ValidityStart',
      field: t('changeHistory.tableHeaders.validityStart'),
      oldValue: previous.validity_start,
      newValue: current.validity_start,
      mapper: mapToShortDate,
    }),
    diffKeyedValues({
      key: 'ValidityEnd',
      field: t('changeHistory.tableHeaders.validityEnd'),
      oldValue: previous.validity_end,
      newValue: current.validity_end,
    }),
    diffKeyedValues({
      key: 'Priority',
      field: t('priority.label'),
      oldValue: previous.priority,
      newValue: current.priority,
      mapper: (v) => mapPriorityToUiName(t, v),
    }),

    diffKeyedValues({
      key: 'PrimaryVehicleMode',
      field: t('lines.primaryVehicleMode'),
      oldValue: previous.primary_vehicle_mode,
      newValue: current.primary_vehicle_mode,
    }),
    diffKeyedValues({
      key: 'TypeOfLine',
      field: t('lines.typeOfLine'),
      oldValue: previous.type_of_line,
      newValue: current.type_of_line,
      mapper: (v) => mapLineTypeToUiName(t, v),
    }),
    diffKeyedValues({
      key: 'TransportTarget',
      field: t('lines.transportTarget'),
      oldValue: previous.transport_target,
      newValue: current.transport_target,
      mapper: (v) => mapTransportTargetToUiName(t, v),
    }),
  ]);
}
