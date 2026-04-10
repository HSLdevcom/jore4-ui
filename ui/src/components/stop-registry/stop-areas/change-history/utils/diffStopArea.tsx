import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import {
  HistoricalStopAreaDetailsFragment,
  StopRegistryNameType,
} from '../../../../../generated/graphql';
import { mapStopRegistryTransportModeTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { mapToShortDate } from '../../../../../time';
import {
  KnownValueKey,
  findAlternativeName,
  findKeyValue,
  getEmbeddedName,
  getGeometryPoint,
} from '../../../../../utils';
import {
  ChangedValue,
  StopsList,
  diffKeyedValues,
  mapNullable,
} from '../../../../common/ChangeHistory';

export function diffStopArea(
  t: TFunction,
  previous: HistoricalStopAreaDetailsFragment,
  current: HistoricalStopAreaDetailsFragment,
): Array<ChangedValue> {
  const previousPoint = getGeometryPoint(previous.geometry);
  const currentPoint = getGeometryPoint(current.geometry);

  return compact([
    diffKeyedValues({
      key: 'ValidityStart',
      field: t(($) => $.changeHistory.tableHeaders.validityStart),
      oldValue: findKeyValue(previous, KnownValueKey.ValidityStart),
      newValue: findKeyValue(current, KnownValueKey.ValidityStart),
      mapper: mapToShortDate,
    }),
    diffKeyedValues({
      key: 'ValidityEnd',
      field: t(($) => $.changeHistory.tableHeaders.validityEnd),
      oldValue: findKeyValue(previous, KnownValueKey.ValidityEnd),
      newValue: findKeyValue(current, KnownValueKey.ValidityEnd),
      mapper: mapToShortDate,
    }),

    diffKeyedValues({
      key: 'NameFin',
      field: t(($) => $.stopAreaDetails.basicDetails.name),
      oldValue: previous.name?.value,
      newValue: current.name?.value,
    }),
    diffKeyedValues({
      key: 'NameSwe',
      field: t(($) => $.stopAreaDetails.basicDetails.nameSwe),
      oldValue: findAlternativeName(
        previous,
        'swe',
        StopRegistryNameType.Translation,
      ),
      newValue: findAlternativeName(
        current,
        'swe',
        StopRegistryNameType.Translation,
      ),
      mapper: getEmbeddedName,
    }),
    diffKeyedValues({
      key: 'NameEng',
      field: t(($) => $.stopAreaDetails.basicDetails.nameEng),
      oldValue: findAlternativeName(
        previous,
        'eng',
        StopRegistryNameType.Translation,
      ),
      newValue: findAlternativeName(
        current,
        'eng',
        StopRegistryNameType.Translation,
      ),
      mapper: getEmbeddedName,
    }),

    diffKeyedValues({
      key: 'LongNameFin',
      field: t(($) => $.stopAreaDetails.basicDetails.nameLongFin),
      oldValue: findAlternativeName(
        previous,
        'fin',
        StopRegistryNameType.Alias,
      ),
      newValue: findAlternativeName(current, 'fin', StopRegistryNameType.Alias),
      mapper: getEmbeddedName,
    }),
    diffKeyedValues({
      key: 'LongNameSwe',
      field: t(($) => $.stopAreaDetails.basicDetails.nameLongSwe),
      oldValue: findAlternativeName(
        previous,
        'swe',
        StopRegistryNameType.Alias,
      ),
      newValue: findAlternativeName(current, 'swe', StopRegistryNameType.Alias),
      mapper: getEmbeddedName,
    }),
    diffKeyedValues({
      key: 'LongNameEng',
      field: t(($) => $.stopAreaDetails.basicDetails.nameLongEng),
      oldValue: findAlternativeName(
        previous,
        'eng',
        StopRegistryNameType.Alias,
      ),
      newValue: findAlternativeName(current, 'eng', StopRegistryNameType.Alias),
      mapper: getEmbeddedName,
    }),

    diffKeyedValues({
      key: 'AbbreviationFin',
      field: t(($) => $.stopAreaDetails.basicDetails.abbreviationFin),
      oldValue: findAlternativeName(
        previous,
        'fin',
        StopRegistryNameType.Other,
      ),
      newValue: findAlternativeName(current, 'fin', StopRegistryNameType.Other),
      mapper: getEmbeddedName,
    }),
    diffKeyedValues({
      key: 'AbbreviationSwe',
      field: t(($) => $.stopAreaDetails.basicDetails.abbreviationSwe),
      oldValue: findAlternativeName(
        previous,
        'swe',
        StopRegistryNameType.Other,
      ),
      newValue: findAlternativeName(current, 'swe', StopRegistryNameType.Other),
      mapper: getEmbeddedName,
    }),
    diffKeyedValues({
      key: 'AbbreviationEng',
      field: t(($) => $.stopAreaDetails.basicDetails.abbreviationEng),
      oldValue: findAlternativeName(
        previous,
        'eng',
        StopRegistryNameType.Other,
      ),
      newValue: findAlternativeName(current, 'eng', StopRegistryNameType.Other),
      mapper: getEmbeddedName,
    }),

    diffKeyedValues({
      key: 'TransportMode',
      field: t(($) => $.stopDetails.basicDetails.transportMode),
      oldValue: previous.transportMode,
      newValue: current.transportMode,
      mapper: mapNullable((v) =>
        mapStopRegistryTransportModeTypeToUiName(t, v),
      ),
    }),

    diffKeyedValues({
      key: 'Stops',
      field: t(($) => $.stopArea.quays),
      oldValue: compact(previous.quays?.map((it) => it?.publicCode)).sort(),
      newValue: compact(current.quays?.map((it) => it?.publicCode)).sort(),
      mapper: (stopLabels) => (
        <StopsList
          t={t}
          stopLabels={stopLabels}
          getLinkTestId={(l) => `ChangeHistory::ChangedValues::StopLink::${l}`}
        />
      ),
    }),

    diffKeyedValues({
      key: 'Latitude',
      field: t(($) => $.stopDetails.location.latitude),
      oldValue: previousPoint?.latitude,
      newValue: currentPoint?.latitude,
    }),
    diffKeyedValues({
      key: 'Longitude',
      field: t(($) => $.stopDetails.location.longitude),
      oldValue: previousPoint?.longitude,
      newValue: currentPoint?.longitude,
    }),
  ]);
}
