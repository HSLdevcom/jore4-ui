import { gql } from '@apollo/client';
import { useGetUserNamesQuery } from '../generated/graphql';

const GQL_GET_USER_NAMES = gql`
  query GetUserNames {
    login_audit {
      user_id
      user_name
    }
  }
`;

export const useGetUserNames = () => {
  const { data, ...rest } = useGetUserNamesQuery();

  const getUserNameById = (userId?: string | null) =>
    data?.login_audit?.find((u) => u?.user_id === userId)?.user_name ?? null;

  return { ...rest, getUserNameById, users: data?.login_audit ?? [] };
};
