import { useUserContext } from '../context/UserContext';

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
    </div>
  );
}
