import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback, useMemo } from 'react';
import { useGetUserNamesQuery } from '../generated/graphql';

const GQL_GET_USER_NAMES = gql`
  query GetUserNames {
    login_audit(
      distinct_on: [user_id]
      order_by: [{ user_id: desc }, { login_timestamp: desc }]
    ) {
      user_id
      user_name
    }
  }
`;

export type GetUserNameById = (
  userId: string | null | undefined,
) => string | null;

export const useGetUserNames = () => {
  const { data, ...rest } = useGetUserNamesQuery();

  const users = useMemo(() => compact(data?.login_audit), [data]);
  const getUserNameById = useCallback<GetUserNameById>(
    (userId) => users.find((u) => u?.user_id === userId)?.user_name ?? null,
    [users],
  );

  return { ...rest, getUserNameById, users };
};
