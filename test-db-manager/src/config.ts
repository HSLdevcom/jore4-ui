import { CurrentExecutorIndex } from './db-helpers/enums';

export interface DatabaseConnectionInfo {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const testDbPort: Record<CurrentExecutorIndex, number> = {
  [CurrentExecutorIndex.e2e1]: 6532,
  [CurrentExecutorIndex.e2e2]: 6533,
  [CurrentExecutorIndex.e2e3]: 6534,
  [CurrentExecutorIndex.default]: 6432,
};

const ciTestDbHost: Record<CurrentExecutorIndex, string> = {
  [CurrentExecutorIndex.e2e1]: 'jore4-testdb-e2e1',
  [CurrentExecutorIndex.e2e2]: 'jore4-testdb-e2e2',
  [CurrentExecutorIndex.e2e3]: 'jore4-testdb-e2e3',
  [CurrentExecutorIndex.default]: 'jore4-testdb',
};

const getTestDbPort = () => {
  const currentExecutorIndex =
    process.env.CYPRESS_THREAD || CurrentExecutorIndex.default;

  if (process.env.CI) {
    return '5432';
  }
  return testDbPort[currentExecutorIndex];
};

const getTestDbHost = () => {
  const currentExecutorIndex =
    process.env.CYPRESS_THREAD || CurrentExecutorIndex.default;

  if (process.env.CI) {
    return ciTestDbHost[currentExecutorIndex];
  }
  return '127.0.0.1';
};

export const e2eDatabaseConfig: DatabaseConnectionInfo = {
  host: getTestDbHost(),
  port: getTestDbPort(),
  user: process.env.POSTGRES_USER || 'dbadmin',
  password: process.env.POSTGRES_PASSWORD || 'adminpassword',
  database: process.env.POSTGRES_DB || 'jore4e2e',
};

export const timetablesDatabaseConfig: DatabaseConnectionInfo = {
  host: getTestDbHost(),
  port: getTestDbPort(),
  user: process.env.POSTGRES_USER || 'dbadmin',
  password: process.env.POSTGRES_PASSWORD || 'adminpassword',
  database: 'timetablesdb',
};
