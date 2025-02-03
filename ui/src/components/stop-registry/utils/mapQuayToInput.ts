import pick from 'lodash/pick';
import {
  Maybe,
  StopRegistryBoardingPosition,
  StopRegistryBoardingPositionInput,
  StopRegistryQuay,
  StopRegistryQuayInput,
} from '../../../generated/graphql';
import {
  mapAccessibilityAssessmentToInput,
  mapAlternativeNames,
  mapCompactOrNull,
  mapGeoJsonToInput,
  mapPlaceEquipmentsToInput,
  mapPrivateCodeToInput,
  omitTypeName,
} from './copyEntityUtilities';

function mapBoardingPositionsToInput(
  positions:
    | ReadonlyArray<Maybe<StopRegistryBoardingPosition>>
    | null
    | undefined,
): Array<StopRegistryBoardingPositionInput> | null {
  return mapCompactOrNull(positions, (position) => ({
    geometry: mapGeoJsonToInput(position.geometry),
    publicCode: position.publicCode,
  }));
}

export function mapQuayToInput(
  quay: Omit<StopRegistryQuay, 'scheduled_stop_point'>,
): StopRegistryQuayInput {
  return {
    ...pick(quay, ['compassBearing', 'keyValues', 'publicCode']),
    name: omitTypeName(quay.name),
    description: omitTypeName(quay.description),
    shortName: omitTypeName(quay.shortName),
    alternativeNames: mapAlternativeNames(quay.alternativeNames),
    accessibilityAssessment: mapAccessibilityAssessmentToInput(
      quay.accessibilityAssessment,
    ),
    boardingPositions: mapBoardingPositionsToInput(quay.boardingPositions),
    geometry: mapGeoJsonToInput(quay.geometry),
    placeEquipments: mapPlaceEquipmentsToInput(quay.placeEquipments),
    privateCode: mapPrivateCodeToInput(quay.privateCode),
  };
}
