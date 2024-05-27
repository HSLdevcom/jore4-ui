/* eslint-disable no-console */
import { Knex } from 'knex';
import { DatabaseConnectionInfo } from './config';

export const getDbConnection = (knexConfig: DatabaseConnectionInfo) => {
  // TODO: not sure how to properly import knex without getting type errors
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const db = require('knex')({ client: 'pg', connection: knexConfig });
  return db;
};
