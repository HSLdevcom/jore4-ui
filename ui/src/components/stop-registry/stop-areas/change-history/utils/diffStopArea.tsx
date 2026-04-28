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
  getGeometryPoint,
} from '../../../../../utils';
import {
  ChangedValue,
  StopsList,
  diffKeyedValues,
  mapNullable,
  normalizeEmptyValue,
} from '../../../../common/ChangeHistory';

function getNormalizedAlternativeName(
  details: HistoricalStopAreaDetailsFragment,
  lang: string,
  nameType: StopRegistryNameType,
) {
  const name = findAlternativeName(details, lang, nameType);
  return normalizeEmptyValue(name?.value);
}

export function diffStopAreaBasicDetails(
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
      oldValue: getNormalizedAlternativeName(
        previous,
        'swe',
        StopRegistryNameType.Translation,
      ),
      newValue: getNormalizedAlternativeName(
        current,
        'swe',
        StopRegistryNameType.Translation,
      ),
    }),
    diffKeyedValues({
      key: 'NameEng',
      field: t(($) => $.stopAreaDetails.basicDetails.nameEng),
      oldValue: getNormalizedAlternativeName(
        previous,
        'eng',
        StopRegistryNameType.Translation,
      ),
      newValue: getNormalizedAlternativeName(
        current,
        'eng',
        StopRegistryNameType.Translation,
      ),
    }),

    diffKeyedValues({
      key: 'LongNameFin',
      field: t(($) => $.stopAreaDetails.basicDetails.nameLongFin),
      oldValue: getNormalizedAlternativeName(
        previous,
        'fin',
        StopRegistryNameType.Alias,
      ),
      newValue: getNormalizedAlternativeName(
        current,
        'fin',
        StopRegistryNameType.Alias,
      ),
    }),
    diffKeyedValues({
      key: 'LongNameSwe',
      field: t(($) => $.stopAreaDetails.basicDetails.nameLongSwe),
      oldValue: getNormalizedAlternativeName(
        previous,
        'swe',
        StopRegistryNameType.Alias,
      ),
      newValue: getNormalizedAlternativeName(
        current,
        'swe',
        StopRegistryNameType.Alias,
      ),
    }),
    diffKeyedValues({
      key: 'LongNameEng',
      field: t(($) => $.stopAreaDetails.basicDetails.nameLongEng),
      oldValue: getNormalizedAlternativeName(
        previous,
        'eng',
        StopRegistryNameType.Alias,
      ),
      newValue: getNormalizedAlternativeName(
        current,
        'eng',
        StopRegistryNameType.Alias,
      ),
    }),

    diffKeyedValues({
      key: 'AbbreviationFin',
      field: t(($) => $.stopAreaDetails.basicDetails.abbreviationFin),
      oldValue: getNormalizedAlternativeName(
        previous,
        'fin',
        StopRegistryNameType.Other,
      ),
      newValue: getNormalizedAlternativeName(
        current,
        'fin',
        StopRegistryNameType.Other,
      ),
    }),
    diffKeyedValues({
      key: 'AbbreviationSwe',
      field: t(($) => $.stopAreaDetails.basicDetails.abbreviationSwe),
      oldValue: getNormalizedAlternativeName(
        previous,
        'swe',
        StopRegistryNameType.Other,
      ),
      newValue: getNormalizedAlternativeName(
        current,
        'swe',
        StopRegistryNameType.Other,
      ),
    }),
    diffKeyedValues({
      key: 'AbbreviationEng',
      field: t(($) => $.stopAreaDetails.basicDetails.abbreviationEng),
      oldValue: getNormalizedAlternativeName(
        previous,
        'eng',
        StopRegistryNameType.Other,
      ),
      newValue: getNormalizedAlternativeName(
        current,
        'eng',
        StopRegistryNameType.Other,
      ),
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

export function diffStopAreaStops(
  t: TFunction,
  previous: HistoricalStopAreaDetailsFragment,
  current: HistoricalStopAreaDetailsFragment,
): Array<ChangedValue> {
  return compact([
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
  ]);
}

function getTerminal(details: HistoricalStopAreaDetailsFragment) {
  // Badly typed in Tiamat Schema. There can never be more than one ParentStopPlace.
  const terminal = details.parentStopPlace?.at(0);

  // eslint-disable-next-line no-underscore-dangle
  if (terminal?.__typename !== 'stop_registry_ParentStopPlace') {
    return null;
  }

  return terminal;
}

export function diffStopAreaTerminal(
  t: TFunction,
  previous: HistoricalStopAreaDetailsFragment,
  current: HistoricalStopAreaDetailsFragment,
): Array<ChangedValue> {
  return compact([
    diffKeyedValues({
      key: 'ParentTerminal',
      field: t(($) => $.stopAreaDetails.basicDetails.parentTerminal),
      oldValue: getTerminal(previous),
      newValue: getTerminal(current),
      mapper: (terminal) => {
        if (!terminal) {
          return '-';
        }

        return `${terminal.privateCode?.value}: ${terminal.name?.value ?? ''}`;
      },
      compare: (oldTerminal, newTerminal) => {
        if (!oldTerminal && !newTerminal) {
          return true;
        }

        return (
          oldTerminal?.privateCode?.value === newTerminal?.privateCode?.value
        );
      },
    }),
  ]);
}
