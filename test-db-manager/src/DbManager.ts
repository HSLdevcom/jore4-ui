/* eslint-disable no-console */
import { Knex } from 'knex';
import { databaseConfig } from './config';

// TODO: not sure how to properly import this without getting type errors
// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
export const db = require('knex')({
  client: 'pg',
  connection: databaseConfig,
});

export const truncateDb = async (knex: Knex) => {
  console.log(`Truncating db...`);

  // list of tables has to be manually updated if schema changes
  const tableNames = [
    '"infrastructure_network"."infrastructure_link"',
    '"infrastructure_network"."vehicle_submode_on_infrastructure_link"',
    '"infrastructure_network"."direction"',
    '"internal_service_pattern"."scheduled_stop_point"',
    '"journey_pattern"."journey_pattern"',
    '"journey_pattern"."scheduled_stop_point_in_journey_pattern"',
    '"service_pattern"."vehicle_mode_on_scheduled_stop_point"',
    '"route"."infrastructure_link_along_route"',
    '"route"."direction"',
    '"route"."line"',
    '"route"."route"',
    '"route"."type_of_line"',
  ];

  try {
    const res = await knex.raw(`TRUNCATE TABLE ${tableNames.join(',')} RESTART IDENTITY`);
    console.log(`db truncated`);
    return res;
  }catch (err) {
    console.log('Error when truncating db, err')
    throw err;
  }
};
