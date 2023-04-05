export interface GetVehicleTypesResult {
  data: {
    timetables: {
      timetables_vehicle_type_vehicle_type: { vehicle_type_id: string };
    };
  };
}

export interface GetInfrastructureLinksByExternalIdsResult {
  data: {
    infrastructure_network_infrastructure_link: {
      infrastructure_link_id: string;
    }[];
  };
}
