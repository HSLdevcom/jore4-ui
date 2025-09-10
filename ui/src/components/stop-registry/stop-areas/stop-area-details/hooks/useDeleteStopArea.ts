import { gql } from '@apollo/client';
import { useDeleteStopAreaMutation } from '../../../../../generated/graphql';

const GQL_DELETE_STOP_AREA = gql`
  mutation DeleteStopArea($stopPlaceId: String!) {
    stop_registry {
      deleteStopPlace(stopPlaceId: $stopPlaceId)
    }
  }
`;

export const useDeleteStopArea = () => {
  const [deleteStopAreaFunction] = useDeleteStopAreaMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['GetStopAreasByLocation'],
  });

  const deleteStopArea = async (stopPlaceId: string) => {
    return deleteStopAreaFunction({ variables: { stopPlaceId } });
  };

  return {
    deleteStopArea,
  };
};
