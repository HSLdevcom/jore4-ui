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
      external_link_id: string;
    }[];
  };
}

export interface InsertStopPlaceResult {
  data: {
    stop_registry: {
      mutateStopPlace: {
        id: UUID;
      }[];
    };
  };
}

export interface GetStopPointByLabelResult {
  data: {
    service_pattern_scheduled_stop_point: Array<{
      scheduled_stop_point_id: UUID;
      label: string;
      stop_place_ref: string | null;
    }>;
  };
}

export interface UpdateScheduledStopPointStopPlaceRefResult {
  data: {
    update_service_pattern_scheduled_stop_point_by_pk: {
      scheduled_stop_point_id: UUID;
      stop_place_ref: string;
    };
  };
}

export interface InsertStopAreaResult {
  data: {
    stop_registry: {
      mutateGroupOfStopPlaces: {
        id: string;
      };
    };
  };
}

export interface GetAllStopPlaceIdsResult {
  data: {
    stops_database: {
      stops_database_stop_place: {
        netex_id: string;
      }[];
    };
  };
}

export interface InsertOrganisationResult {
  data: {
    stop_registry: {
      mutateOrganisation: {
        id: string;
        name: string;
      }[];
    };
  };
}
