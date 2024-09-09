import {
  StopRegistryGroupOfStopPlacesInput,
  StopRegistryStopPlace,
  StopRegistryStopPlaceOrganisationRef,
  StopRegistryStopPlaceOrganisationRelationshipType,
  StopRegistryVersionLessEntityRefInput,
} from '../../generated/graphql';
import { isNotNullish } from '../../utils';
import { StopAreaInput } from './stopArea';
import { StopPlaceInput, StopPlaceMaintenance } from './stopPlaces';

export type StopAreaIdsByName = Record<string, string>;
export type StopPlaceIdsByLabel = Record<string, string>;
export type OrganisationIdsByName = Record<string, string>;

const mapStopPlaceMaintenanceToInput = (
  maintenance: StopPlaceMaintenance | undefined | null,
  organisationIdsByName: OrganisationIdsByName,
): Array<StopRegistryStopPlaceOrganisationRef> | undefined => {
  if (!maintenance) {
    return undefined;
  }

  const organisationRefs: Array<StopRegistryStopPlaceOrganisationRef> =
    Object.entries(maintenance)
      .map(([key, organisationName]) => {
        if (!organisationName) {
          return null;
        }

        const maintenanceOrganisationId =
          organisationIdsByName[organisationName];
        if (!maintenanceOrganisationId) {
          throw new Error(
            `Could not find organisation with name ${organisationName}`,
          );
        }

        return {
          organisationRef: maintenanceOrganisationId,
          relationshipType:
            key as StopRegistryStopPlaceOrganisationRelationshipType,
        };
      })
      .filter(isNotNullish);

  return organisationRefs;
};

export const setStopPlaceRelations = (
  input: StopPlaceInput,
  organisationIdsByName: OrganisationIdsByName,
): Partial<StopRegistryStopPlace> => {
  const stopPlaceOrganisations = mapStopPlaceMaintenanceToInput(
    input.maintenance,
    organisationIdsByName,
  );

  const stopPlace = {
    ...input.stopPlace,
    organisations: stopPlaceOrganisations,
  };

  return stopPlace;
};

export const setStopAreaRelations = (
  input: StopAreaInput,
  stopPlaceIdsByLabel: StopPlaceIdsByLabel,
): Partial<StopRegistryGroupOfStopPlacesInput> => {
  const area = {
    ...input.stopArea,
    members: input.memberLabels.map(
      (label) =>
        ({
          ref: stopPlaceIdsByLabel[label],
        }) as StopRegistryVersionLessEntityRefInput,
    ),
  };

  return area;
};
