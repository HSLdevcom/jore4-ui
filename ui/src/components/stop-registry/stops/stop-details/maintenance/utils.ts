import {
  StopRegistryStopPlaceOrganisationRelationshipType as StopOrganisationType,
  StopPlaceOrganisationFieldsFragment,
} from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../types';

export type StopOrganisations = NonNullable<
  StopWithDetails['stop_place']
>['organisations'];

const findOrganisationForRelationshipType = (
  organisations: StopOrganisations,
  type: StopOrganisationType,
): StopPlaceOrganisationFieldsFragment | null => {
  const match = organisations?.find((o) => o?.relationshipType === type);
  return match?.organisation ?? null;
};

export const getMaintainers = (
  stop: StopWithDetails,
): Record<StopOrganisationType, StopPlaceOrganisationFieldsFragment | null> => {
  const selectedQuay = stop.stop_place?.quays?.find(
    (quay) => quay?.id === stop.stop_place_ref,
  );

  const organisations: StopOrganisations = selectedQuay?.organisations;

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

  return {
    cleaning,
    infoUpkeep,
    maintenance,
    owner,
    winterMaintenance,
  };
};
