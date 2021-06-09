import { useUserContext } from '../context/UserContext';

export function Main() {
  const userContext = useUserContext();
  const permissionIds: string[] | undefined =
    userContext.userInfo &&
    userContext.userInfo[
      'https://oneportal.trivore.com/claims/active_external_permissions'
    ]?.active?.flatMap((permission: { permissionExternalId?: string }) =>
      permission.permissionExternalId ? [permission.permissionExternalId] : [],
    );

  return (
    <div>
      <h1>Welcome!</h1>
      {!userContext.loggedIn && <p>Please log in.</p>}
      {permissionIds && (
        <div>
          <p>You have the following permissions:</p>
          <ul>
            {permissionIds.map((permissionId) => (
              <li key={permissionId}>{permissionId}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
