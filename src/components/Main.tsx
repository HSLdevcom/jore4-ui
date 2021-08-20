import { gql } from '@apollo/client';
import { useUserContext } from '../context/UserContext';
import { useQueryWithRole } from '../graphql';

const GET_STATE_LOOKUP = gql`
  {
    test_data {
      message
    }
  }
`;

function GraphQlContent() {
  const { loading, error, data } = useQueryWithRole<{
    // eslint-disable-next-line camelcase
    test_data: { message: string }[];
  }>(GET_STATE_LOOKUP, 'jore4-network-infra-write');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! ${error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      {data.test_data.map((testData) => (
        <div key={testData.message}>{testData.message}</div>
      ))}
    </div>
  );
}

export function Main() {
  const userContext = useUserContext();
  const permissions = userContext.userInfo?.permissions;

  return (
    <div>
      <h1>Welcome!</h1>
      {!userContext.loggedIn && <p>Please log in.</p>}
      {permissions && (
        <div>
          <p>You have the following permissions:</p>
          <ul>
            {permissions.map((permission) => (
              <li key={permission}>{permission}</li>
            ))}
          </ul>
        </div>
      )}
      <GraphQlContent />
    </div>
  );
}
