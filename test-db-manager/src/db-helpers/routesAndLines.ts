import { Knex } from 'knex';
import { VehicleSubmodeOnInfraLinkInsertInput } from '../builders';

// Vehicle submodes on infra links can't be handled with hasura api because
// hasura splits infrastructure_network_vehicle_submode_on_infrastructure_link__all_columns_alias
// and infrastructure_network_vehicle_submode_on_infrastructure_link__mutation_result_alias
// at 64 characters and that causes conflicts because both are the same for the first > 64 characters.
//
// That causes following error:
// "WITH query name \"infrastructure_network_vehicle_submode_on_infrastructure_link__\" specified more than once"
//
// Thus we have to use raw sql connection for handling those.
// (Other solution could be renaming the tables.)

export const insertVehicleSubmodeOnInfraLink = (
  db: Knex,
  infraLinks: VehicleSubmodeOnInfraLinkInsertInput[],
) => {
  return db('infrastructure_network.vehicle_submode_on_infrastructure_link')
    .returning(['infrastructure_link_id', 'vehicle_submode'])
    .insert(infraLinks);
};

export const removeVehicleSubmodeOnInfraLink = (
  db: Knex,
  infraLinks: VehicleSubmodeOnInfraLinkInsertInput[],
) => {
  return db('infrastructure_network.vehicle_submode_on_infrastructure_link')
    .whereIn(
      'infrastructure_link_id',
      infraLinks.map((item) => item.infrastructure_link_id),
    )
    .whereIn(
      'vehicle_submode',
      infraLinks.map((item) => item.vehicle_submode),
    )
    .returning(['infrastructure_link_id', 'vehicle_submode'])
    .del();
};
