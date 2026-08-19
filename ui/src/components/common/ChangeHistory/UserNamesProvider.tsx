import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  UserNameDetailsFragment,
  useGetUserNamesSubscription,
} from '../../../generated/graphql';

const GQL_GET_USER_NAMES = gql`
  subscription GetUserNames {
    login_audit(
      distinct_on: [user_id]
      order_by: [{ user_id: desc }, { login_timestamp: desc }]
    ) {
      ...UserNameDetails
    }
  }

  fragment UserNameDetails on login_audit {
    user_id
    user_name
  }
`;

type UserNamesContext = {
  readonly users: ReadonlyArray<UserNameDetailsFragment>;
};

const UserNamesContextImpl = createContext<UserNamesContext>({ users: [] });

export const UserNamesProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data } = useGetUserNamesSubscription();

  const value: UserNamesContext = useMemo(
    () => ({
      users: compact(data?.login_audit),
    }),
    [data],
  );

  return (
    <UserNamesContextImpl.Provider value={value}>
      {children}
    </UserNamesContextImpl.Provider>
  );
};

export type GetUserNameById = (
  userId: string | null | undefined,
) => string | null;

export function useGetUserNames(): GetUserNameById {
  const { users } = useContext(UserNamesContextImpl);

  return useCallback(
    (userId) => users.find((u) => u.user_id === userId)?.user_name ?? null,
    [users],
  );
}
