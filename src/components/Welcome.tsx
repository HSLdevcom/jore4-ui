import { useTypedSelector } from '../redux/store';

export function Welcome() {
  const userInfo = useTypedSelector(state => state.user.userInfo);
  const loggedIn = !!userInfo;
  const permissionIds: string[] | undefined =
    userInfo && userInfo['https://oneportal.trivore.com/claims/active_external_permissions']
      ?.active
      ?.flatMap((permission: { permissionExternalId?: string; }) =>
        permission.permissionExternalId ? [ permission.permissionExternalId ] : [])

  return (
    <div>
      <h1>Welcome!</h1>
      {!loggedIn && <p>Please log in.</p>}
      {permissionIds && <div>
        <p>You have the following permissions:</p>
        <ul>
          {permissionIds.map(permissionId =>
            <li key={permissionId}>{permissionId}</li>
          )}
        </ul>
      </div>}
    </div>
  );
}
