import gql from 'graphql-tag';
import { getGqlString } from '../builders/mutations/utils';
import {
  StopRegistryGroupOfStopPlacesInput,
  StopRegistryInfoSpotInput,
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

const GQL_INSERT_STOP_AREA = gql`
  mutation InsertStopArea($stopArea: stop_registry_GroupOfStopPlacesInput!) {
    stop_registry {
      mutateGroupOfStopPlaces(GroupOfStopPlaces: $stopArea) {
        id
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

export const mapToInsertStopAreaMutation = (
  input: Partial<StopRegistryGroupOfStopPlacesInput>,
) => {
  return {
    query: getGqlString(GQL_INSERT_STOP_AREA),
    variables: { stopArea: input },
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
