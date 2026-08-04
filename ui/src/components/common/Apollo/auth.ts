const REQUESTED_HASURA_ROLE_HEADER = 'x-hasura-role';

export function roleHeaderMap(hasuraRole: string) {
  return { [REQUESTED_HASURA_ROLE_HEADER]: hasuraRole };
}

// TODO: avoid hardcoding role value. Use 'admin' for now
// to be able to continue development until things get sorted out
// regarding access control in hasura side
export const userHasuraRole = 'admin';
