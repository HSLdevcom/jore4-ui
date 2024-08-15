import { gql } from '@apollo/client';
import { useDeleteStopAreaMutation } from '../../../generated/graphql';

const GQL_DELETE_STOP_AREA = gql`
  mutation DeleteStopArea($stop_area_id: String!) {
    stop_registry {
      deleteGroupOfStopPlaces(id: $stop_area_id)
    }
  }
`;

export const useDeleteStopArea = () => {
  const [deleteStopAreaFunction] = useDeleteStopAreaMutation();

  const deleteStopArea = async (stopAreaId: string) => {
    const variables = { stop_area_id: stopAreaId };
    return deleteStopAreaFunction({ variables });
  };

  return {
    deleteStopArea,
  };
};
