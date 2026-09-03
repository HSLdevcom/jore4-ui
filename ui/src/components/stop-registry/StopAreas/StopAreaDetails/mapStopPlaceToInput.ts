import pick from 'lodash/pick';
import {
  Maybe,
  StopRegistryQuay,
  StopRegistryQuayInput,
  StopRegistryStopPlaceInput,
  StopRegistryStopPlaceOrganisationRef,
  StopRegistryStopPlaceOrganisationRefInput,
} from '../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../types';
import {
  mapAccessibilityAssessmentToInput,
  mapAlternativeNames,
  mapCompactOrNull,
  mapGeoJsonToInput,
  mapPrivateCodeToInput,
  mapQuayToInput,
} from '../../utils';

function mapQuaysToInput(
  quays:
    | ReadonlyArray<Maybe<Omit<StopRegistryQuay, 'scheduled_stop_point'>>>
    | null
    | undefined,
): Array<StopRegistryQuayInput> | null {
  return mapCompactOrNull(quays, mapQuayToInput);
}

function mapOrganizationsToInput(
  organizations:
    | ReadonlyArray<Maybe<StopRegistryStopPlaceOrganisationRef>>
    | null
    | undefined,
): Array<StopRegistryStopPlaceOrganisationRefInput> | null {
  return mapCompactOrNull(organizations, (org) => ({
    organisationRef: org.organisationRef,
    relationshipType: org.relationshipType,
  }));
}

export function mapStopPlaceToInput(
  stopPlace: EnrichedStopPlace,
): StopRegistryStopPlaceInput {
  return {
    ...pick(stopPlace, [
      'keyValues',
      'parentSiteRef',
      'publicCode',
      'stopPlaceType',
      'submode',
      'transportMode',
      'weighting',
    ]),
    name: {
      lang: 'fin',
      value: stopPlace.name,
    },
    alternativeNames: mapAlternativeNames(stopPlace.alternativeNames),
    accessibilityAssessment: mapAccessibilityAssessmentToInput(
      stopPlace.accessibilityAssessment,
    ),
    geometry: mapGeoJsonToInput(stopPlace.geometry),
    privateCode: mapPrivateCodeToInput(stopPlace.privateCode),
    organisations: mapOrganizationsToInput(stopPlace.organisations),
    quays: mapQuaysToInput(stopPlace.quays),

    // All other properties are not copied and implicitly default to null.
    // Location properties: Tiamat sets topographicPlace and fareZone
    // automatically based on coordinates. They can not be changed manually.
  };
}
