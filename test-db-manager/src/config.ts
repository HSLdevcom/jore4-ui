const envPort = process.env.POSTGRES_PORT;
const e2eDatabaseConfig = {
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: envPort || 6432,
  database: process.env.POSTGRES_DB || 'jore4e2e',
  user: process.env.POSTGRES_USER || 'dbadmin',
  password: process.env.POSTGRES_PASSWORD || 'adminpassword',
};

export const getDbConfig = () => {
  // default instance = thread4, e2e1 = thread1, etc
  const currentExecutorIndex = process.env.CYPRESS_THREAD || '4';
  let port = 0;
  switch (currentExecutorIndex) {
    // testdb-e2e1
    case '1':
      port = 6532;
      break;
    // testdb-e2e2
    case '2':
      port = 6533;
      break;
    // testdb-e2e3
    case '3':
      port = 6534;
      break;
    // testdb
    default:
      port = 6432;
      break;
  }

  if (envPort) {
    return { ...e2eDatabaseConfig, envPort };
  }
  return { ...e2eDatabaseConfig, port };
};
