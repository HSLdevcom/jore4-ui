import { CurrentExecutorIndex } from './db-helpers/enums';

const testDbPort: Record<CurrentExecutorIndex, number> = {
  [CurrentExecutorIndex.e2e1]: 6532,
  [CurrentExecutorIndex.e2e2]: 6533,
  [CurrentExecutorIndex.e2e3]: 6534,
  [CurrentExecutorIndex.default]: 6432,
};

const getTestDbPort = () => {
  const currentExecutorIndex =
    process.env.CYPRESS_THREAD || CurrentExecutorIndex.default;
  return testDbPort[currentExecutorIndex];
};

export const e2eDatabaseConfig = {
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: process.env.POSTGRES_PORT || getTestDbPort(),
  database: process.env.POSTGRES_DB || 'jore4e2e',
  user: process.env.POSTGRES_USER || 'dbadmin',
  password: process.env.POSTGRES_PASSWORD || 'adminpassword',
};
