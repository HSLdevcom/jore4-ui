/* eslint-disable no-console */
import { Knex, knex } from 'knex';
import { DatabaseConnectionInfo } from './config';

export function getDbConnection(knexConfig: DatabaseConnectionInfo): Knex {
  return knex({ client: 'pg', connection: knexConfig });
}

/**
 * Resets routes and lines database by truncating the necessary tables.
 * We do not truncate those table which's values are set in initial seed.
 * e.g. infrastructure link related tables, vehicle modes, etc.
 */
export async function resetRoutesAndLinesDb(db: Knex) {
  console.log('Resetting routes and lines db...');

  // list of tables has to be manually updated if schema changes
  const tableNames = [
    '"network"."journey_pattern"',
    '"network"."scheduled_stop_point_in_journey_pattern"',
    '"network"."vehicle_mode_on_scheduled_stop_point"',
    '"network"."infrastructure_link_along_route"',
    '"network"."line"',
    '"network"."line_change_history"',
    '"network"."route"',
    '"network"."scheduled_stop_point"',
    '"network"."scheduled_stop_point_invariant"',
    '"network"."timing_place"',
  ];

  try {
    const res = await db.raw(
      `TRUNCATE TABLE ${tableNames.join(',')} RESTART IDENTITY`,
    );
    console.log('db truncated');
    return res;
  } catch (err) {
    console.log('Error when truncating db, err');
    throw err;
  }
}
