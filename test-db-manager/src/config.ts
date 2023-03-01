import { CurrentExecutorIndex } from './db-helpers/enums/currentExecutorIndex';

const getTestDbPort = () => {
  // default instance = thread4, e2e1 = thread1, etc
  const currentExecutorIndex = process.env.CYPRESS_THREAD || '4';

  switch (currentExecutorIndex) {
    // testdb-e2e1
    case CurrentExecutorIndex.e2e1:
      return 6532;
    // testdb-e2e2
    case CurrentExecutorIndex.e2e2:
      return 6533;
    // testdb-e2e3
    case CurrentExecutorIndex.e2e3:
      return 6534;
    // testdb
    case CurrentExecutorIndex.e2e:
      return 6432;
    // testdb
    default:
      return 6432;
  }
};

export const e2eDatabaseConfig = {
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: process.env.POSTGRES_PORT || getTestDbPort(),
  database: process.env.POSTGRES_DB || 'jore4e2e',
  user: process.env.POSTGRES_USER || 'dbadmin',
  password: process.env.POSTGRES_PASSWORD || 'adminpassword',
};
