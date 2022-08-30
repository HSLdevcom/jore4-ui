const e2eDatabaseConfig = {
  host: '127.0.0.1',
  port: 6432,
  database: process.env.POSTGRES_DB || 'jore4e2e',
  user: process.env.POSTGRES_USER || 'dbadmin',
  password: process.env.POSTGRES_PASSWORD || 'adminpassword',
};

export const getDbConfig = () => {
  return e2eDatabaseConfig;
};
