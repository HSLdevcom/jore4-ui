import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import {
  HistoricalTerminalDetailsFragment,
  StopRegistryNameType,
} from '../../../../../generated/graphql';
import { mapTerminalTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { mapToShortDate } from '../../../../../time';
import {
  KnownValueKey,
  findAlternativeName,
  findKeyValue,
  getGeometryPoint,
} from '../../../../../utils';
import {
  ChangedValue,
  diffKeyedValues,
  mapNullable,
  normalizeEmptyValue,
} from '../../../../common/ChangeHistory';
import { TerminalType } from '../../../types/TerminalType';

function getNormalizedAlternativeName(
  details: HistoricalTerminalDetailsFragment,
  lang: string,
  nameType: StopRegistryNameType,
) {
  const name = findAlternativeName(details, lang, nameType);
  return normalizeEmptyValue(name?.value);
}

export function diffTerminalBasicDetails(
  t: TFunction,
  previous: HistoricalTerminalDetailsFragment,
  current: HistoricalTerminalDetailsFragment,
): Array<ChangedValue> {
  const previousPoint = getGeometryPoint(previous.geometry);
  const currentPoint = getGeometryPoint(current.geometry);

  const result = compact([
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
      field: t(($) => $.terminalDetails.basicDetails.name),
      oldValue: previous.name?.value,
      newValue: current.name?.value,
    }),
    diffKeyedValues({
      key: 'NameSwe',
      field: t(($) => $.terminalDetails.basicDetails.nameSwe),
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
      field: t(($) => $.terminalDetails.basicDetails.nameEng),
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
      field: t(($) => $.terminalDetails.basicDetails.nameLongFin),
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
      field: t(($) => $.terminalDetails.basicDetails.nameLongSwe),
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
      field: t(($) => $.terminalDetails.basicDetails.nameLongEng),
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
      field: t(($) => $.terminalDetails.basicDetails.abbreviationFin),
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
      field: t(($) => $.terminalDetails.basicDetails.abbreviationSwe),
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
      field: t(($) => $.terminalDetails.basicDetails.abbreviationEng),
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
      key: 'Description',
      field: t(($) => $.terminalDetails.basicDetails.description),
      oldValue: previous.description?.value,
      newValue: current.description?.value,
    }),

    diffKeyedValues({
      key: 'Latitude',
      field: t(($) => $.terminalDetails.location.latitude),
      oldValue: previousPoint?.latitude,
      newValue: currentPoint?.latitude,
    }),
    diffKeyedValues({
      key: 'Longitude',
      field: t(($) => $.terminalDetails.location.longitude),
      oldValue: previousPoint?.longitude,
      newValue: currentPoint?.longitude,
    }),

    diffKeyedValues({
      key: 'Municipality',
      field: t(($) => $.terminalDetails.location.municipality),
      oldValue: previous.topographicPlace?.name?.value,
      newValue: current.topographicPlace?.name?.value,
    }),

    diffKeyedValues({
      key: 'StreetAddress',
      field: t(($) => $.terminalDetails.location.streetAddress),
      oldValue: findKeyValue(previous, KnownValueKey.StreetAddress),
      newValue: findKeyValue(current, KnownValueKey.StreetAddress),
    }),

    diffKeyedValues({
      key: 'PostalCode',
      field: t(($) => $.terminalDetails.location.postalCode),
      oldValue: findKeyValue(previous, KnownValueKey.PostalCode),
      newValue: findKeyValue(current, KnownValueKey.PostalCode),
    }),

    diffKeyedValues({
      key: 'TerminalType',
      field: t(($) => $.terminalDetails.basicDetails.terminalType),
      oldValue: findKeyValue(previous, KnownValueKey.TerminalType),
      newValue: findKeyValue(current, KnownValueKey.TerminalType),
      mapper: mapNullable((v) => mapTerminalTypeToUiName(t, v as TerminalType)),
    }),

    diffKeyedValues({
      key: 'ArrivalPlatforms',
      field: t(($) => $.terminalDetails.basicDetails.arrivalPlatforms),
      oldValue: findKeyValue(previous, KnownValueKey.ArrivalPlatforms),
      newValue: findKeyValue(current, KnownValueKey.ArrivalPlatforms),
    }),

    diffKeyedValues({
      key: 'DeparturePlatforms',
      field: t(($) => $.terminalDetails.basicDetails.departurePlatforms),
      oldValue: findKeyValue(previous, KnownValueKey.DeparturePlatforms),
      newValue: findKeyValue(current, KnownValueKey.DeparturePlatforms),
    }),

    diffKeyedValues({
      key: 'LoadingPlatforms',
      field: t(($) => $.terminalDetails.basicDetails.loadingPlatforms),
      oldValue: findKeyValue(previous, KnownValueKey.LoadingPlatforms),
      newValue: findKeyValue(current, KnownValueKey.LoadingPlatforms),
    }),

    diffKeyedValues({
      key: 'ElectricCharging',
      field: t(($) => $.terminalDetails.basicDetails.electricCharging),
      oldValue: findKeyValue(previous, KnownValueKey.ElectricCharging),
      newValue: findKeyValue(current, KnownValueKey.ElectricCharging),
    }),
  ]);

  return result;
}

type MemberStop = NonNullable<
  HistoricalTerminalDetailsFragment['children']
>[number];

function formatStopAreaLabels(stops: readonly MemberStop[]): string {
  return compact(stops)
    .flatMap((stop) =>
      compact(stop.quays?.map((q) => q?.publicCode)).filter(Boolean),
    )
    .sort()
    .join(', ');
}

export function diffTerminalStops(
  t: TFunction,
  previous: HistoricalTerminalDetailsFragment,
  current: HistoricalTerminalDetailsFragment,
): Array<ChangedValue> {
  const previousStops = compact(previous.children ?? []);
  const currentStops = compact(current.children ?? []);

  const result = compact([
    diffKeyedValues({
      key: 'Stops',
      field: t(($) => $.terminalChangeHistory.memberStops),
      oldValue: formatStopAreaLabels(previousStops),
      newValue: formatStopAreaLabels(currentStops),
    }),
  ]);

  return result;
}

type ExternalLink = NonNullable<
  HistoricalTerminalDetailsFragment['externalLinks']
>[number];

function formatExternalLinks(links: readonly ExternalLink[]): string {
  return compact(links)
    .map((link) => {
      const name = link?.name ?? '';
      const location = link?.location ?? '';
      return name && location ? `${name} (${location})` : name || location;
    })
    .join(', ');
}

export function diffTerminalExternalLinks(
  t: TFunction,
  previous: HistoricalTerminalDetailsFragment,
  current: HistoricalTerminalDetailsFragment,
): Array<ChangedValue> {
  const previousLinks = compact(previous.externalLinks ?? []);
  const currentLinks = compact(current.externalLinks ?? []);

  const result = compact([
    diffKeyedValues({
      key: 'Links',
      field: t(($) => $.stopDetails.externalLinks.externalLinks),
      oldValue: formatExternalLinks(previousLinks),
      newValue: formatExternalLinks(currentLinks),
    }),
  ]);

  return result;
}
