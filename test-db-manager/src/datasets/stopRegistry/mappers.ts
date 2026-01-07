import compact from 'lodash/compact';
import {
  StopRegistryCreateMultiModalStopPlaceInput,
  StopRegistryInfoSpotInput,
  StopRegistryOrganisationInput,
  StopRegistryParentStopPlaceInput,
  StopRegistryQuayInput,
  StopRegistryStopPlaceInput,
  StopRegistryStopPlaceOrganisationRef,
  StopRegistryStopPlaceOrganisationRelationshipType,
} from '../../generated/graphql';
import { KnownValueKey } from '../../types';
import { isNotNullish } from '../../utils';
import { InfoSpotInput } from './infoSpots';
import { StopAreaInput } from './stopArea';
import { QuayInput, StopPlaceMaintenance } from './stopPlaces';
import { TerminalInput } from './terminals';

export type QuayDetails = {
  netexId: string;
  shelters: Array<string>;
};

export type StopPlaceIdsByName = Record<string, string>;
export type QuayDetailsByLabel = Record<string, QuayDetails>;
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

export const setStopPlaceOrganisations = (
  input: StopAreaInput,
  organisationIdsByName: OrganisationIdsByName,
): Partial<StopRegistryStopPlaceInput> => {
  const stopPlaceOrganisations = mapStopPlaceMaintenanceToInput(
    input.organisations,
    organisationIdsByName,
  );

  return {
    ...input.StopArea,
    organisations: stopPlaceOrganisations,
  };
};

export const setQuayOrganisations = (
  input: QuayInput,
  organisationIdsByName: OrganisationIdsByName,
): Partial<StopRegistryQuayInput> => {
  const quayOrganisations = mapStopPlaceMaintenanceToInput(
    input.organisations,
    organisationIdsByName,
  );

  return {
    ...input.quay,
    organisations: quayOrganisations,
  };
};

export const buildTerminalCreateInput = (
  input: TerminalInput,
  stopPlaceIdsByName: StopPlaceIdsByName,
): Partial<StopRegistryCreateMultiModalStopPlaceInput> => {
  const terminal = {
    name: input.terminal.name,
    description: input.terminal.description,
    validBetween: input.terminal.validBetween,
    geometry: input.terminal.geometry,
    stopPlaceIds: input.memberLabels.map((label) => stopPlaceIdsByName[label]),
  };

  return terminal;
};

export const buildTerminalUpdateInput = (
  input: TerminalInput,
  organisationIdsByName: OrganisationIdsByName,
): Partial<StopRegistryParentStopPlaceInput> => {
  if (!input.owner) {
    return input.terminal;
  }

  const ownerRef =
    'organisationRef' in input.owner
      ? input.owner.organisationRef
      : organisationIdsByName[input.owner.name];

  return {
    ...input.terminal,
    keyValues: compact(input.terminal.keyValues).concat(
      {
        key: KnownValueKey.OwnerContractId,
        values: [input.owner.contractId],
      },
      { key: KnownValueKey.OwnerNote, values: [input.owner.note] },
    ),
    organisations: compact(input.terminal.organisations).concat({
      organisationRef: ownerRef,
      relationshipType: StopRegistryStopPlaceOrganisationRelationshipType.Owner,
    }),
  };
};

export const setInfoSpotRelations = (
  input: InfoSpotInput,
  quayDetailsByLabel: QuayDetailsByLabel,
): Partial<StopRegistryInfoSpotInput> => {
  const infoSpot: Partial<StopRegistryInfoSpotInput> = {
    ...input.infoSpot,
    infoSpotLocations: [],
  };

  if (input.locatedOnStopLabel) {
    infoSpot.infoSpotLocations?.push(
      quayDetailsByLabel[input.locatedOnStopLabel].netexId,
    );
    if (
      input.associatedShelter !== null &&
      input.associatedShelter !== undefined
    ) {
      infoSpot.infoSpotLocations?.push(
        quayDetailsByLabel[input.locatedOnStopLabel].shelters[
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

export function mapTerminalOwnersToOrganisations(
  terminals?: ReadonlyArray<TerminalInput>,
): Array<StopRegistryOrganisationInput> {
  const newTerminalOwnerOrgs = terminals
    ?.map((terminal) => terminal.owner)
    .map<StopRegistryOrganisationInput | null>((owner) => {
      if (owner && 'name' in owner) {
        return {
          name: owner.name,
          privateContactDetails: {
            phone: owner.phone,
            email: owner.email,
          },
        };
      }

      return null;
    });

  return compact(newTerminalOwnerOrgs);
}
