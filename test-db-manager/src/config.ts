import { Settings } from 'luxon';

Settings.throwOnInvalid = true;

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

const getTestDbPort = () => {
  if (process.env.CI === '1') {
    return testDbPort.ci;
  }
  if (process.env.CI === undefined && process.env.CYPRESS === 'true') {
    return testDbPort.local_e2e;
  }
  return testDbPort.local_dev;
};

const getTestDbHost = () => {
  if (process.env.CI === '1') {
    return testDbHost.ci;
  }
  return testDbHost.local;
};

export const e2eDatabaseConfig: DatabaseConnectionInfo = {
  host: getTestDbHost(),
  port: getTestDbPort(),
  user: process.env.POSTGRES_USER ?? 'dbadmin',
  password: process.env.POSTGRES_PASSWORD ?? 'adminpassword',
  database: process.env.POSTGRES_DB ?? 'jore4e2e',
};

export const timetablesDatabaseConfig: DatabaseConnectionInfo = {
  host: getTestDbHost(),
  port: getTestDbPort(),
  user: process.env.POSTGRES_USER ?? 'dbadmin',
  password: process.env.POSTGRES_PASSWORD ?? 'adminpassword',
  database: 'timetablesdb',
};
