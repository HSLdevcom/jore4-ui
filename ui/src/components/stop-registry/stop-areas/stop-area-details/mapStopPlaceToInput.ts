/* eslint-disable @typescript-eslint/no-unused-vars */

import pick from 'lodash/pick';
import {
  Maybe,
  StopRegistryQuay,
  StopRegistryQuayInput,
  StopRegistryStopPlaceInput,
  StopRegistryStopPlaceOrganisationRef,
  StopRegistryStopPlaceOrganisationRefInput,
  StopRegistryTariffZone,
  StopRegistryVersionLessEntityRef,
  StopRegistryVersionLessEntityRefInput,
} from '../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../types';
import {
  mapAccessibilityAssessmentToInput,
  mapAlternativeNames,
  mapCompactOrNull,
  mapGeoJsonToInput,
  // mapPlaceEquipmentsToInput,
  mapPrivateCodeToInput,
  mapQuayToInput,
} from '../../utils';

function mapAdjacentSitesToInput(
  adjacentSites:
    | ReadonlyArray<Maybe<StopRegistryVersionLessEntityRef>>
    | null
    | undefined,
): Array<StopRegistryVersionLessEntityRefInput> | null {
  return mapCompactOrNull(adjacentSites, (site) =>
    site?.ref ? { ref: site.ref } : null,
  );
}

function mapTariffZonesToInput(
  refs: ReadonlyArray<Maybe<StopRegistryTariffZone>> | null | undefined,
): Array<StopRegistryVersionLessEntityRefInput> | null {
  return mapCompactOrNull(refs, (ref) => (ref?.id ? { ref: ref.id } : null));
}

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

// Kept in case we ever want to also make copies of StopAreas
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
    description: null, // omitTypeName(stopPlace.description),
    shortName: null, // omitTypeName(stopPlace.shortName),
    alternativeNames: mapAlternativeNames(stopPlace.alternativeNames),
    accessibilityAssessment: mapAccessibilityAssessmentToInput(
      stopPlace.accessibilityAssessment,
    ),
    geometry: mapGeoJsonToInput(stopPlace.geometry),
    placeEquipments: null, // mapPlaceEquipmentsToInput(stopPlace.placeEquipments),
    privateCode: mapPrivateCodeToInput(stopPlace.privateCode),
    organisations: mapOrganizationsToInput(stopPlace.organisations),
    quays: mapQuaysToInput(stopPlace.quays),
    adjacentSites: null, // mapAdjacentSitesToInput(stopPlace.adjacentSites),
    tariffZones: null, // mapTariffZonesToInput(stopPlace.tariffZones),
    validBetween: null,
    // Location properties:
    // Note: Tiamat sets topographicPlace and fareZone automatically based on coordinates. They can not be changed otherwise.
  };
}
