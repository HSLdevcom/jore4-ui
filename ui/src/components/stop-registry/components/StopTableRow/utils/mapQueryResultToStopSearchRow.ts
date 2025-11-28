import compact from 'lodash/compact';
import {
  AccessibilityAssessmentDetailsFragment,
  StopRegistryNameType,
  StopRegistryPlaceEquipments,
  StopTableRowQuayDetailsFragment,
  StopTableRowScheduledStopPointDetailsFragment,
  StopTableRowStopAreaDetailsFragment,
  StopTableRowStopAreaQuayDetailsFragment,
} from '../../../../../generated/graphql';
import { parseDate } from '../../../../../time';
import { EnrichedStopPlace, StopPlace } from '../../../../../types';
import { Priority, knownPriorityValues } from '../../../../../types/enums';
import {
  findKeyValue,
  findKeyValueParsed,
  getStopPlacesFromQueryResult,
  isValidGeoJSONPoint,
  log,
  requireValue,
} from '../../../../../utils';
import { StopSearchRow } from '../types';

function parsePriority(value: unknown): Priority {
  const number = Number(value);

  if (knownPriorityValues.includes(number)) {
    return number;
  }

  throw new TypeError(`Value (${value}) is not a priority value!)`);
}

function validateLocation(
  value:
    | StopTableRowQuayDetailsFragment['centroid']
    | StopTableRowStopAreaQuayDetailsFragment['geometry'],
) {
  if (!isValidGeoJSONPoint(value)) {
    throw new TypeError(
      `Value (${JSON.stringify(value, null, 0)}) is not a valid GeoJSON point!`,
    );
  }

  return value;
}

function findSwedishNameFromRawDbResponse(
  quay: StopTableRowQuayDetailsFragment,
): string | null {
  return (
    quay.stop_place?.stop_place_alternative_names.find(
      (alternativeName) =>
        alternativeName.alternative_name.name_lang === 'swe' &&
        alternativeName.alternative_name.name_type === 'TRANSLATION',
    )?.alternative_name.name_value ?? null
  );
}

function findSwedishNameFromTiamatResponse(
  stopArea: StopTableRowStopAreaDetailsFragment,
): string | null {
  return (
    stopArea.alternativeNames?.find(
      (it) =>
        it?.nameType === StopRegistryNameType.Translation &&
        it.name?.lang === 'swe',
    )?.name?.value ?? null
  );
}

function mapStopPointDetails(
  scheduledStopPoint:
    | StopTableRowScheduledStopPointDetailsFragment
    | null
    | undefined,
): Pick<StopSearchRow, 'scheduledStopPointId' | 'timingPlace'> {
  return {
    scheduledStopPointId: scheduledStopPoint?.scheduled_stop_point_id ?? null,
    timingPlace: scheduledStopPoint?.timing_place
      ? {
          id: scheduledStopPoint.timing_place.timing_place_id,
          label: scheduledStopPoint.timing_place.label,
        }
      : null,
  };
}

function mapEquipmentDetailsFromTiamatQuay(
  tiamatQuay:
    | {
        placeEquipments?: StopRegistryPlaceEquipments | null;
        accessibilityAssessment?: AccessibilityAssessmentDetailsFragment | null;
      }
    | null
    | undefined,
): Pick<
  StopSearchRow,
  | 'replacesRailSign'
  | 'platformNumber'
  | 'electricity'
  | 'shelter'
  | 'accessibility'
> {
  const placeEquipments = tiamatQuay?.placeEquipments;

  const replacesRailSign = placeEquipments?.generalSign?.some(
    (sign) => sign?.replacesRailSign === true,
  );

  const platformNumber = placeEquipments?.generalSign?.find(
    (sign) => sign?.content?.value,
  )?.content?.value;

  const firstShelter = placeEquipments?.shelterEquipment?.[0];
  const electricity = firstShelter?.shelterElectricity ?? undefined;
  const shelter = firstShelter?.shelterType ?? undefined;

  const accessibility =
    tiamatQuay?.accessibilityAssessment?.hslAccessibilityProperties
      ?.accessibilityLevel ?? undefined;

  return {
    replacesRailSign,
    platformNumber,
    electricity,
    shelter,
    accessibility,
  };
}

function mapEquipmentDetails(
  quay: StopTableRowQuayDetailsFragment,
): Pick<
  StopSearchRow,
  | 'replacesRailSign'
  | 'platformNumber'
  | 'electricity'
  | 'shelter'
  | 'accessibility'
> {
  const tiamatStopPlaces = quay.stop_place_newest_version?.TiamatStopPlace;

  const [stopPlace] = getStopPlacesFromQueryResult<StopPlace>(tiamatStopPlaces);

  const tiamatQuay = stopPlace?.quays?.find((q) => q?.id === quay.netex_id);

  return mapEquipmentDetailsFromTiamatQuay(tiamatQuay);
}

function mapQueryResultToStopSearchRowImpl(
  quay: StopTableRowQuayDetailsFragment,
  scheduledStopPoint:
    | StopTableRowScheduledStopPointDetailsFragment
    | null
    | undefined,
): StopSearchRow {
  return {
    // Raw DB row id → Bigint -> Parsed as json number → convert to tring
    id: String(requireValue(quay.id)),
    netexId: requireValue(quay.netex_id),

    publicCode: requireValue(quay.public_code),
    nameFin: requireValue(quay.stop_place?.name_value),
    nameSwe: findSwedishNameFromRawDbResponse(quay),
    description: quay.description_value ?? null,

    location: validateLocation(quay.centroid),

    validityStart: parseDate(requireValue(quay.validity_start)),
    validityEnd: parseDate(quay.validity_end) ?? null,
    priority: parsePriority(quay.priority),

    ...mapStopPointDetails(scheduledStopPoint),
    ...mapEquipmentDetails(quay),
  };
}

export function mapQueryResultToStopSearchRow(
  quay: StopTableRowQuayDetailsFragment | null | undefined,
  scheduledStopPoint:
    | StopTableRowScheduledStopPointDetailsFragment
    | null
    | undefined,
): StopSearchRow | null {
  if (!quay) {
    return null;
  }

  try {
    return mapQueryResultToStopSearchRowImpl(quay, scheduledStopPoint);
  } catch (error) {
    log.error('Failed to map query result to StopSearchRow: ', {
      quay,
      scheduledStopPoint,
      error,
    });

    return null;
  }
}

type StopTableRowStopAreaDetailsFragmentWithoutNames = Omit<
  StopTableRowStopAreaDetailsFragment,
  'name' | 'alternativeNames'
>;

type NameResolver<NamedArea> = (
  nameContainer: NamedArea,
) => Pick<StopSearchRow, 'nameFin' | 'nameSwe'>;

function mapSingleTiamatStopAreaQuayToStopSearchRow<
  NamedArea extends StopTableRowStopAreaDetailsFragmentWithoutNames,
>(
  stopArea: NamedArea,
  quay: StopTableRowStopAreaQuayDetailsFragment,
  nameResolver: NameResolver<NamedArea>,
): StopSearchRow {
  // ID field is the NetexID value in Tiamat's response
  const netexId = requireValue(quay.id);

  return {
    // No access to the DB row id, but we need a unique id.
    // And from Tiamat's point of view NetexId  + version is that
    id: `${netexId}/${requireValue(quay.version)}`,
    netexId,

    publicCode: requireValue(quay.publicCode),
    location: validateLocation(quay.geometry),

    validityStart: requireValue(
      findKeyValueParsed(quay, 'validityStart', parseDate),
    ),
    validityEnd: findKeyValueParsed(quay, 'validityEnd', parseDate) ?? null,
    priority: parsePriority(findKeyValue(quay, 'priority')),

    ...nameResolver(stopArea),

    ...mapStopPointDetails(quay.scheduled_stop_point),
    ...mapEquipmentDetailsFromTiamatQuay(quay),
  };
}

function mapRawTiamatStopAreaQuaysToStopSearchRowsImpl<
  NamedArea extends StopTableRowStopAreaDetailsFragmentWithoutNames,
>(
  stopArea: NamedArea,
  nameResolver: NameResolver<NamedArea>,
): Array<StopSearchRow> {
  const mapped = stopArea.quays?.map((quay) => {
    if (!quay) {
      return null;
    }

    try {
      return mapSingleTiamatStopAreaQuayToStopSearchRow(
        stopArea,
        quay,
        nameResolver,
      );
    } catch (error) {
      log.error('Failed to map query result to StopSearchRow: ', {
        quay,
        stopArea,
        error,
      });

      return null;
    }
  });

  return compact(mapped);
}

export function mapRawTiamatStopAreaQuaysToStopSearchRows(
  stopArea: StopTableRowStopAreaDetailsFragment,
): Array<StopSearchRow> {
  return mapRawTiamatStopAreaQuaysToStopSearchRowsImpl(
    stopArea,
    (nameContainer) => ({
      nameFin: requireValue(nameContainer.name?.value),
      nameSwe: findSwedishNameFromTiamatResponse(nameContainer),
    }),
  );
}

export function mapEnrichedStopPlaceStopAreaQuaysToStopSearchRows(
  stopArea: EnrichedStopPlace,
): Array<StopSearchRow> {
  return mapRawTiamatStopAreaQuaysToStopSearchRowsImpl(
    stopArea,
    (nameContainer) => ({
      nameFin: requireValue(nameContainer.name),
      nameSwe: nameContainer.nameSwe ?? null,
    }),
  );
}
