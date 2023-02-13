import {
  getDbConnection,
  truncateDb,
  hasuraApi,
  insertVehicleSubmodeOnInfraLink,
  removeVehicleSubmodeOnInfraLink,
} from '@hsl/jore4-test-db-manager';

const db = getDbConnection();

export const checkDbConnection = () => {
  // Example about direct access to db
  return (
    db
      .raw('SELECT 1')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        // eslint-disable-next-line no-console
        console.log('PostgreSQL connected', res);
        return res;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        // eslint-disable-next-line no-console
        console.log('PostgreSQL not connected');
        // eslint-disable-next-line no-console
        console.error(e);
        // We have to return undefined instead of throwing an error
        // in order to make test fail if we end up to this code block.
        // https://docs.cypress.io/api/commands/task#Usage
        return undefined;
      })
  );
};

export const truncateDatabase = () => {
  return truncateDb(db);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const executeRawDbQuery = ({ query, bindings }: any) => {
  return db.raw(query, bindings);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasuraAPI = (request: any) => {
  return hasuraApi(request);
};

// Note: next 2 functions exists only because name of table
// 'infrastructure_network.vehicle_submode_on_infrastructure_link'
// is too long for hasura to handle. Generally db
// should be accessed through "hasuraApi" function and this kind
// of specific functions should be avoided.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const insertVehicleSubmodOnInfraLinks = (request: any) => {
  return insertVehicleSubmodeOnInfraLink(db, request);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeVehicleSubmodOnInfraLinks = (request: any) => {
  return removeVehicleSubmodeOnInfraLink(db, request);
};
