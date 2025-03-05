import pick from 'lodash/pick';
import {
  Maybe,
  StopRegistryBoardingPosition,
  StopRegistryBoardingPositionInput,
  StopRegistryQuayInput,
} from '../../../generated/graphql';
import { EnrichedQuay } from '../../../types';
import {
  mapAccessibilityAssessmentToInput,
  mapAlternativeNames,
  mapCompactOrNull,
  mapGeoJsonToInput,
  mapPlaceEquipmentsToInput,
  omitTypeName,
} from './copyEntityUtilities';

// Boarding positions are not currently used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  quay: Omit<EnrichedQuay, 'scheduled_stop_point'>,
): StopRegistryQuayInput {
  return {
    ...pick(quay, ['compassBearing', 'keyValues', 'publicCode']),
    description: omitTypeName(quay.description),
    alternativeNames: mapAlternativeNames(quay.alternativeNames),
    accessibilityAssessment: mapAccessibilityAssessmentToInput(
      quay.accessibilityAssessment,
    ),
    geometry: mapGeoJsonToInput(quay.geometry),
    placeEquipments: mapPlaceEquipmentsToInput(quay.placeEquipments),
    privateCode: { value: quay.privateCode ?? '', type: 'HSL' },
  };
}
