import gql from 'graphql-tag';
import { getGqlString } from '../builders/mutations/utils';
import {
  StopRegistryGroupOfStopPlacesInput,
  StopRegistryInfoSpotInput,
  StopRegistryOrganisationInput,
  StopRegistryStopPlace,
} from '../generated/graphql';
import { InsertStopPlaceResult } from '../types';

const GQL_INSERT_STOP_PLACE = gql`
  mutation InsertStopPlace($stopPlace: stop_registry_StopPlaceInput!) {
    stop_registry {
      mutateStopPlace(StopPlace: $stopPlace) {
        id
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
  mutation InsertInfoSpot($infoSpot: stop_registry_InfoSpotInput!) {
    stop_registry {
      mutateInfoSpot(InfoSpot: $infoSpot) {
        id
      }
    }
  }
`;

export const mapToInsertStopPlaceMutation = (
  input: Partial<StopRegistryStopPlace>,
) => {
  return {
    query: getGqlString(GQL_INSERT_STOP_PLACE),
    variables: { stopPlace: input },
  };
};

export const extractStopPlaceIdFromResponse = (
  res: InsertStopPlaceResult,
): string => res.data.stop_registry.mutateStopPlace[0].id;

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
