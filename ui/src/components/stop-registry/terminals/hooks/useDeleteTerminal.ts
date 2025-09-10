import { gql } from '@apollo/client';
import { useDeleteTerminalMutation } from '../../../../generated/graphql';

const GQL_DELETE_TERMINAL = gql`
  mutation DeleteTerminal($terminalId: String!) {
    stop_registry {
      deleteStopPlace(stopPlaceId: $terminalId)
    }
  }
`;

export const useDeleteTerminal = () => {
  const [deleteTerminalFunction] = useDeleteTerminalMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['GetStopTerminalsByLocation'],
  });

  const deleteTerminal = async (terminalId: string) => {
    return deleteTerminalFunction({ variables: { terminalId } });
  };

  return {
    deleteTerminal,
  };
};
