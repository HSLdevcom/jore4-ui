import gql from 'graphql-tag';
import { getGqlString } from '../builders/mutations/utils';
import {
  StopRegistryCreateMultiModalStopPlaceInput,
  StopRegistryGroupOfStopPlacesInput,
  StopRegistryInfoSpotInput,
  StopRegistryOrganisationInput,
  StopRegistryParentStopPlaceInput,
  StopRegistryStopPlaceInput,
} from '../generated/graphql';
import { InsertStopPlaceResult } from '../types';

const GQL_INSERT_STOP_PLACE = gql`
  mutation InsertStopPlace($stopPlace: stop_registry_StopPlaceInput!) {
    stop_registry {
      mutateStopPlace(StopPlace: $stopPlace) {
        id
        quays {
          id
          publicCode
          placeEquipments {
            shelterEquipment {
              id
            }
          }
        }
      }
    }
  }
`;

const GQL_DELETE_STOP_PLACE = gql`
  mutation DeleteStopPlace($stopPlaceId: String!) {
    stop_registry {
      deleteStopPlace(stopPlaceId: $stopPlaceId)
    }
  }
`;

const GQL_GET_ALL_STOP_PLACE_IDS = gql`
  query GetAllStopPlaceIds {
    stops_database {
      stops_database_stop_place {
        netex_id
      }
    }
  }
`;

const GQL_INSERT_STOP_AREA = gql`
  mutation InsertStopArea($stopArea: stop_registry_GroupOfStopPlacesInput!) {
    stop_registry {
      mutateGroupOfStopPlaces(GroupOfStopPlaces: $stopArea) {
        id
      }
    }
  }
`;

const GQL_DELETE_STOP_AREA = gql`
  mutation DeleteStopArea($stopAreaId: String!) {
    stop_registry {
      deleteGroupOfStopPlaces(id: $stopAreaId)
    }
  }
`;

const GQL_INSERT_TERMINAL = gql`
  mutation InsertTerminal(
    $terminal: stop_registry_createMultiModalStopPlaceInput
  ) {
    stop_registry {
      createMultiModalStopPlace(input: $terminal) {
        id
      }
    }
  }
`;

const GQL_UPDATE_TERMINAL = gql`
  mutation UpdateTerminal($terminal: stop_registry_ParentStopPlaceInput) {
    stop_registry {
      mutateParentStopPlace(ParentStopPlace: $terminal) {
        id
      }
    }
  }
`;

const GQL_GET_ALL_STOP_AREA_IDS = gql`
  query GetAllStopAreaIds {
    stops_database {
      stops_database_group_of_stop_places {
        netex_id
      }
    }
  }
`;

const GQL_INSERT_ORGANISATION = gql`
  mutation InsertOrganisation(
    $organisation: [stop_registry_OrganisationInput!]
  ) {
    stop_registry {
      mutateOrganisation(Organisation: $organisation) {
        id
        name
      }
    }
  }
`;

const GQL_DELETE_ORGANISATION = gql`
  mutation DeleteOrganisation($organisationId: String!) {
    stop_registry {
      deleteOrganisation(organisationId: $organisationId)
    }
  }
`;

const GQL_GET_ALL_ORGANISATION_IDS = gql`
  query GetAllOrganisationIds {
    stops_database {
      stops_database_organisation {
        netex_id
      }
    }
  }
`;

const GQL_INSERT_INFO_SPOT = gql`
  mutation InsertInfoSpot($infoSpot: [stop_registry_infoSpotInput!]) {
    stop_registry {
      mutateInfoSpots(infoSpot: $infoSpot) {
        id
      }
    }
  }
`;

export const mapToInsertStopPlaceMutation = (
  input: Partial<StopRegistryStopPlaceInput>,
) => {
  return {
    query: getGqlString(GQL_INSERT_STOP_PLACE),
    variables: { stopPlace: input },
  };
};

export const extractQuayIdsFromResponse = (
  res: InsertStopPlaceResult,
): Array<{ label: string; netexId: string }> =>
  res.data.stop_registry.mutateStopPlace[0].quays.map((quay) => {
    return { label: quay.publicCode, netexId: quay.id };
  });

export const mapToDeleteStopPlaceMutation = (stopPlaceId: string) => {
  return {
    query: getGqlString(GQL_DELETE_STOP_PLACE),
    variables: { stopPlaceId },
  };
};

export const mapToGetAllStopPlaceIds = () => {
  return {
    query: getGqlString(GQL_GET_ALL_STOP_PLACE_IDS),
  };
};

export const mapToInsertStopAreaMutation = (
  input: Partial<StopRegistryGroupOfStopPlacesInput>,
) => {
  return {
    query: getGqlString(GQL_INSERT_STOP_AREA),
    variables: { stopArea: input },
  };
};

export const mapToDeleteStopAreaMutation = (stopAreaId: string) => {
  return {
    query: getGqlString(GQL_DELETE_STOP_AREA),
    variables: { stopAreaId },
  };
};

export const mapToInsertTerminalMutation = (
  input: Partial<StopRegistryCreateMultiModalStopPlaceInput>,
) => {
  return {
    query: getGqlString(GQL_INSERT_TERMINAL),
    variables: { terminal: input },
  };
};

export const mapToUpdateTerminalMutation = (
  input: Partial<StopRegistryParentStopPlaceInput>,
) => {
  return {
    query: getGqlString(GQL_UPDATE_TERMINAL),
    variables: { terminal: input },
  };
};

export const mapToGetAllStopAreaIds = () => {
  return {
    query: getGqlString(GQL_GET_ALL_STOP_AREA_IDS),
  };
};

export const mapToInsertOrganisationMutation = (
  input: Partial<StopRegistryOrganisationInput>,
) => {
  return {
    query: getGqlString(GQL_INSERT_ORGANISATION),
    variables: { organisation: input },
  };
};

export const mapToDeleteOrganisationMutation = (organisationId: string) => {
  return {
    query: getGqlString(GQL_DELETE_ORGANISATION),
    variables: { organisationId },
  };
};

export const mapToGetAllOrganisationIds = () => {
  return {
    query: getGqlString(GQL_GET_ALL_ORGANISATION_IDS),
  };
};

export const mapToInsertInfoSpotMutation = (
  input: StopRegistryInfoSpotInput,
) => {
  return {
    query: getGqlString(GQL_INSERT_INFO_SPOT),
    variables: { infoSpot: input },
  };
};
