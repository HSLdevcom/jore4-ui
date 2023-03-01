import { getTestDbPort } from './db-helpers';

export const e2eDatabaseConfig = {
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: process.env.POSTGRES_PORT || getTestDbPort(),
  database: process.env.POSTGRES_DB || 'jore4e2e',
  user: process.env.POSTGRES_USER || 'dbadmin',
  password: process.env.POSTGRES_PASSWORD || 'adminpassword',
};
