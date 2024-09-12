import {
  StopRegistryGroupOfStopPlacesInput,
  StopRegistryInfoSpotInput,
  StopRegistryStopPlace,
  StopRegistryStopPlaceOrganisationRef,
  StopRegistryStopPlaceOrganisationRelationshipType,
  StopRegistryVersionLessEntityRefInput,
} from '../../generated/graphql';
import { isNotNullish } from '../../utils';
import { InfoSpotInput } from './infoSpots';
import { StopAreaInput } from './stopArea';
import { StopPlaceInput, StopPlaceMaintenance } from './stopPlaces';

export type StopDetails = {
  netexId: string;
  shelters: Array<string>;
};

export type StopAreaIdsByName = Record<string, string>;
export type StopPlaceDetailsByLabel = Record<string, StopDetails>;
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
  stopPlaceDetailsByLabel: StopPlaceDetailsByLabel,
): Partial<StopRegistryGroupOfStopPlacesInput> => {
  const area = {
    ...input.stopArea,
    members: input.memberLabels.map(
      (label) =>
        ({
          ref: stopPlaceDetailsByLabel[label].netexId,
        }) as StopRegistryVersionLessEntityRefInput,
    ),
  };

  return area;
};

export const setInfoSpotRelations = (
  input: InfoSpotInput,
  stopPlaceDetailsByLabel: StopPlaceDetailsByLabel,
): Partial<StopRegistryInfoSpotInput> => {
  const infoSpot: Partial<StopRegistryInfoSpotInput> = {
    ...input.infoSpot,
    infoSpotLocations: [],
  };

  if (input.locatedOnStopLabel) {
    infoSpot.infoSpotLocations?.push(
      stopPlaceDetailsByLabel[input.locatedOnStopLabel].netexId,
    );
    if (
      input.associatedShelter !== null &&
      input.associatedShelter !== undefined
    ) {
      infoSpot.infoSpotLocations?.push(
        stopPlaceDetailsByLabel[input.locatedOnStopLabel].shelters[
          input.associatedShelter
        ],
      );
    }
  }
  if (input.locatedInTerminal) {
    infoSpot.infoSpotLocations?.push(input.locatedInTerminal);
  }
  return infoSpot;
};
