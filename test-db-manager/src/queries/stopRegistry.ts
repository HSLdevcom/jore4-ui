import gql from 'graphql-tag';
import { getGqlString } from '../builders/mutations/utils';
import { StopRegistryStopPlace } from '../generated/graphql';
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