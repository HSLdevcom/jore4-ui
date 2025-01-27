import {
  StopRegistryCreateMultiModalStopPlaceInput,
  StopRegistryInfoSpotInput,
  StopRegistryParentStopPlaceInput,
  StopRegistryStopPlaceInput,
  StopRegistryStopPlaceOrganisationRef,
  StopRegistryStopPlaceOrganisationRelationshipType,
} from '../../generated/graphql';
import { isNotNullish } from '../../utils';
import { InfoSpotInput } from './infoSpots';
import { StopAreaInput } from './stopArea';
import { QuayInput, StopPlaceMaintenance } from './stopPlaces';
import { TerminalInput } from './terminals';

export type StopDetails = {
  netexId: string;
  shelters: Array<string>;
};

export type StopAreaIdsByName = Record<string, string>;
export type StopPlaceDetailsByLabel = Record<string, StopDetails>;
export type TerminalIdsByName = Record<string, string>;
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

export const setStopPlaceQuays = (
  input: StopAreaInput,
  quays: Array<QuayInput>,
): StopAreaInput => {
  return input;
};

export const setStopPlaceOrganisations = (
  input: StopAreaInput,
  organisationIdsByName: OrganisationIdsByName,
): Partial<StopRegistryStopPlaceInput> => {
  const stopPlaceOrganisations = mapStopPlaceMaintenanceToInput(
    input.organisations,
    organisationIdsByName,
  );

  const stopArea = {
    ...input.StopArea,
    organisations: stopPlaceOrganisations,
  };

  return stopArea;
};

export const buildTerminalCreateInput = (
  input: TerminalInput,
  stopPlaceDetailsByLabel: StopPlaceDetailsByLabel,
): Partial<StopRegistryCreateMultiModalStopPlaceInput> => {
  const terminal = {
    name: input.terminal.name,
    description: input.terminal.description,
    validBetween: input.terminal.validBetween,
    geometry: input.terminal.geometry,
    stopPlaceIds: input.memberLabels.map(
      (label) => stopPlaceDetailsByLabel[label].netexId,
    ),
  };

  return terminal;
};

export const buildTerminalUpdateInput = (
  id: string,
  input: TerminalInput,
): Partial<StopRegistryParentStopPlaceInput> => {
  return {
    id,
    ...input,
  };
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
