export interface DatabaseConnectionInfo {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const testDbPort = {
  local_e2e: 6532,
  local_dev: 6432,
  ci: 5432,
};

const testDbHost = {
  local: '127.0.0.1',
  ci: 'jore4-testdb',
};

function getTestDbPort() {
  if (process.env.CI === '1') {
    return testDbPort.ci;
  }
  if (process.env.CI === undefined && process.env.CYPRESS === 'true') {
    return testDbPort.local_e2e;
  }
  return testDbPort.local_dev;
}

function getTestDbHost() {
  if (process.env.CI === '1') {
    return testDbHost.ci;
  }
  return testDbHost.local;
}

// Hasura and Tiamat use the jore4main database for the network, timetables
// and stop registry data (schemas network, timetables and stopregistry).
// POSTGRES_DB is ignored, because the docker compose bundle's Cypress service
// still sets it to the legacy jore4e2e database.
export const jore4MainDatabaseConfig: DatabaseConnectionInfo = {
  host: getTestDbHost(),
  port: getTestDbPort(),
  user: process.env.POSTGRES_USER ?? 'dbadmin',
  password: process.env.POSTGRES_PASSWORD ?? 'adminpassword',
  database: 'jore4main',
};
