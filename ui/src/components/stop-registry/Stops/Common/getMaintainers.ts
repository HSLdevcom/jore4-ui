import {
  StopRegistryStopPlaceOrganisationRelationshipType as StopOrganisationType,
  StopPlaceOrganisationFieldsFragment,
  StopRegistryQuay,
} from '../../../../generated/graphql';

type QuayOrganisations = StopRegistryQuay['organisations'];

function findOrganisationForRelationshipType(
  organisations: QuayOrganisations,
  type: StopOrganisationType,
): StopPlaceOrganisationFieldsFragment | null {
  return (
    organisations?.find((o) => o?.relationshipType === type)?.organisation ??
    null
  );
}

export function getMaintainers(
  quay: Pick<StopRegistryQuay, 'organisations'> | null,
): Record<StopOrganisationType, StopPlaceOrganisationFieldsFragment | null> {
  const organisations: QuayOrganisations = quay?.organisations ?? [];

  const cleaning = findOrganisationForRelationshipType(
    organisations,
    StopOrganisationType.Cleaning,
  );
  const infoUpkeep = findOrganisationForRelationshipType(
    organisations,
    StopOrganisationType.InfoUpkeep,
  );
  const maintenance = findOrganisationForRelationshipType(
    organisations,
    StopOrganisationType.Maintenance,
  );
  const owner = findOrganisationForRelationshipType(
    organisations,
    StopOrganisationType.Owner,
  );
  const winterMaintenance = findOrganisationForRelationshipType(
    organisations,
    StopOrganisationType.WinterMaintenance,
  );
  const shelterMaintenance = findOrganisationForRelationshipType(
    organisations,
    StopOrganisationType.ShelterMaintenance,
  );

  return {
    cleaning,
    infoUpkeep,
    maintenance,
    owner,
    winterMaintenance,
    shelterMaintenance,
  };
}
