import { useAppSelector } from '../hooks';
import { selectUser } from '../redux';

export function Main() {
  const { userInfo } = useAppSelector(selectUser);
  const permissions = userInfo?.permissions;

  return (
    <div>
      <h1>Welcome!</h1>
      {!userInfo && <p>Please log in.</p>}
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
