import pick from 'lodash/pick';
import {
  Maybe,
  StopRegistryBoardingPosition,
  StopRegistryBoardingPositionInput,
  StopRegistryPrivateCodeInput,
  StopRegistryQuay,
  StopRegistryQuayInput,
} from '../../../generated/graphql';
import { EnrichedQuay } from '../../../types';
import {
  mapAccessibilityAssessmentToInput,
  mapAlternativeNames,
  mapCompactOrNull,
  mapExternalLinks,
  mapGeoJsonToInput,
  mapPlaceEquipmentsToInput,
  omitTypeName,
} from './copyEntityUtilities';
import { decodeQuayPrivateCodeType } from './decodeQuayPrivateCodeType';

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

function isEnrichedQuay(
  quay: StopRegistryQuay | EnrichedQuay,
): quay is EnrichedQuay {
  return (quay as StopRegistryQuay).privateCode?.value === undefined;
}

function getQuayPrivateCode(
  quay: StopRegistryQuay | EnrichedQuay | null | undefined,
): StopRegistryPrivateCodeInput | null {
  if (!quay?.privateCode) {
    return null;
  }

  if (isEnrichedQuay(quay)) {
    return {
      value: quay.privateCode ?? '',
      type: decodeQuayPrivateCodeType(quay.privateCode),
    };
  }

  if (!quay.privateCode?.value) {
    return null;
  }

  return quay.privateCode as StopRegistryPrivateCodeInput;
}

export function mapQuayToInput(
  quay: Omit<EnrichedQuay | StopRegistryQuay, 'scheduled_stop_point'>,
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
    externalLinks: mapExternalLinks(quay.externalLinks),
    privateCode: getQuayPrivateCode(quay),
  };
}
