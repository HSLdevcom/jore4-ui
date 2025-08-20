/* eslint-disable no-console */
import knex, { Knex } from 'knex';
import { DatabaseConnectionInfo } from './config';

export const getDbConnection = (knexConfig: DatabaseConnectionInfo): Knex => {
  return knex({ client: 'pg', connection: knexConfig });
};

/**
 * Resets routes and lines database by truncating the necessary tables.
 * We do not truncate those table which's values are set in initial seed.
 * e.g. infrastructure link related tables, vehicle modes, etc.
 */
export const resetRoutesAndLinesDb = async (db: Knex) => {
  console.log(`Resetting routes and lines db...`);

  // list of tables has to be manually updated if schema changes
  const tableNames = [
    '"journey_pattern"."journey_pattern"',
    '"journey_pattern"."scheduled_stop_point_in_journey_pattern"',
    '"service_pattern"."vehicle_mode_on_scheduled_stop_point"',
    '"route"."infrastructure_link_along_route"',
    '"route"."line"',
    '"route"."route"',
    '"service_pattern"."scheduled_stop_point"',
    '"service_pattern"."scheduled_stop_point_invariant"',
    '"timing_pattern"."timing_place"',
  ];

  try {
    const res = await db.raw(
      `TRUNCATE TABLE ${tableNames.join(',')} RESTART IDENTITY`,
    );
    console.log(`db truncated`);
    return res;
  } catch (err) {
    console.log('Error when truncating db, err');
    throw err;
  }
};
