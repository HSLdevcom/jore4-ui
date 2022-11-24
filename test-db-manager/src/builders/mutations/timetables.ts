import { gql } from 'graphql-tag';
import {
  TimetablesJourneyPatternJourneyPatternRefInsertInput,
  TimetablesPassingTimesTimetabledPassingTimeInsertInput,
  TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput,
  TimetablesVehicleJourneyVehicleJourneyInsertInput,
  TimetablesVehicleScheduleVehicleScheduleFrameInsertInput,
  TimetablesVehicleServiceVehicleServiceInsertInput,
} from '../../generated/graphql';
import { getGqlString } from './utils';

const GQL_INSERT_TIMETABLES_JOURNEY_PATTERN = gql`
  mutation InsertTimetablesJourneyPatternRef(
    $objects: [timetables_journey_pattern_journey_pattern_ref_insert_input!]!
  ) {
    timetables {
      timetables_insert_journey_pattern_journey_pattern_ref(objects: $objects) {
        returning {
          journey_pattern_id
          journey_pattern_ref_id
        }
      }
    }
  }
`;

export const mapToCreateTimetablesJourneyPatternMutation = (
  objects: TimetablesJourneyPatternJourneyPatternRefInsertInput[],
) => {
  return {
    operationName: 'InsertTimetablesJourneyPatternRef',
    query: getGqlString(GQL_INSERT_TIMETABLES_JOURNEY_PATTERN),
    variables: { objects },
  };
};

const GQL_DELETE_TIMETABLES_JOURNEY_PATTERN = gql`
  mutation RemoveTimetablesJourneyPatternRefs(
    $journey_pattern_ref_ids: [uuid!]!
  ) {
    timetables {
      timetables_delete_journey_pattern_journey_pattern_ref(
        where: { journey_pattern_ref_id: { _in: $journey_pattern_ref_ids } }
      ) {
        returning {
          journey_pattern_id
        }
      }
    }
  }
`;

export const mapToDeleteTimetablesJourneyPatternMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_TIMETABLES_JOURNEY_PATTERN),
    variables: { journey_pattern_ref_ids: uuids },
  };
};

const GQL_INSERT_STOP_IN_JOURNEY_PATTERN_REF = gql`
  mutation InsertStopInJourneyPatternRef(
    $objects: [timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_insert_input!]!
  ) {
    timetables {
      timetables_insert_service_pattern_scheduled_stop_point_in_journey_pattern_ref(
        objects: $objects
      ) {
        returning {
          journey_pattern_ref_id
          scheduled_stop_point_in_journey_pattern_ref_id
        }
      }
    }
  }
`;

export const mapToCreateStopInJourneyPatternRefMutation = (
  objects: TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput[],
) => {
  return {
    operationName: 'InsertStopInJourneyPatternRef',
    query: getGqlString(GQL_INSERT_STOP_IN_JOURNEY_PATTERN_REF),
    variables: { objects },
  };
};

const GQL_DELETE_STOP_IN_JOURNEY_PATTERN_REF = gql`
  mutation RemoveStopInJourneyPatternRefs($stop_ref_ids: [uuid!]!) {
    timetables {
      timetables_delete_service_pattern_scheduled_stop_point_in_journey_pattern_ref(
        where: {
          scheduled_stop_point_in_journey_pattern_ref_id: { _in: $stop_ref_ids }
        }
      ) {
        returning {
          scheduled_stop_point_in_journey_pattern_ref_id
        }
      }
    }
  }
`;

export const mapToDeleteStopInJourneyPatternRefMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_STOP_IN_JOURNEY_PATTERN_REF),
    variables: { stop_ref_ids: uuids },
  };
};

const GQL_INSERT_VEHICLE_SCHEDULE_FRAMES = gql`
  mutation InsertVehicleScheduleFrames(
    $objects: [timetables_vehicle_schedule_vehicle_schedule_frame_insert_input!]!
  ) {
    timetables {
      timetables_insert_vehicle_schedule_vehicle_schedule_frame(
        objects: $objects
      ) {
        returning {
          vehicle_schedule_frame_id
        }
      }
    }
  }
`;

export const mapToCreateVehicleScheduleFramesMutation = (
  objects: TimetablesVehicleScheduleVehicleScheduleFrameInsertInput[],
) => {
  return {
    operationName: 'InsertVehicleScheduleFrames',
    query: getGqlString(GQL_INSERT_VEHICLE_SCHEDULE_FRAMES),
    variables: { objects },
  };
};

const GQL_DELETE_VEHICLE_SCHEDULE_FRAMES = gql`
  mutation RemoveVehicleScheduleFrames($vehicle_schedule_frame_ids: [uuid!]!) {
    timetables {
      timetables_delete_vehicle_schedule_vehicle_schedule_frame(
        where: {
          vehicle_schedule_frame_id: { _in: $vehicle_schedule_frame_ids }
        }
      ) {
        returning {
          vehicle_schedule_frame_id
        }
      }
    }
  }
`;

export const mapToDeleteVehicleScheduleFramesMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_VEHICLE_SCHEDULE_FRAMES),
    variables: { vehicle_schedule_frame_ids: uuids },
  };
};

const GQL_INSERT_VEHICLE_SERVICES = gql`
  mutation InsertVehicleServices(
    $objects: [timetables_vehicle_service_vehicle_service_insert_input!]!
  ) {
    timetables {
      timetables_insert_vehicle_service_vehicle_service(objects: $objects) {
        returning {
          vehicle_service_id
        }
      }
    }
  }
`;

export const mapToCreateVehicleServices = (
  objects: TimetablesVehicleServiceVehicleServiceInsertInput[],
) => {
  return {
    operationName: 'InsertVehicleServices',
    query: getGqlString(GQL_INSERT_VEHICLE_SERVICES),
    variables: { objects },
  };
};

const GQL_DELETE_VEHICLE_SERVICES = gql`
  mutation RemoveVehicleServices($vehicle_service_ids: [uuid!]!) {
    timetables {
      timetables_delete_vehicle_service_vehicle_service(
        where: { vehicle_service_id: { _in: $vehicle_service_ids } }
      ) {
        returning {
          vehicle_service_id
        }
      }
    }
  }
`;

export const mapToDeleteVehicleServicesMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_VEHICLE_SERVICES),
    variables: { vehicle_service_ids: uuids },
  };
};

const GQL_INSERT_VEHICLE_SERVICE_BLOCKS = gql`
  mutation InsertVehicleServiceBlocks(
    $objects: [timetables_vehicle_service_block_insert_input!]!
  ) {
    timetables {
      timetables_insert_vehicle_service_block(objects: $objects) {
        returning {
          block_id
        }
      }
    }
  }
`;

export const mapToCreateVehicleServiceBlocks = (
  objects: TimetablesVehicleServiceVehicleServiceInsertInput[],
) => {
  return {
    operationName: 'InsertVehicleServiceBlocks',
    query: getGqlString(GQL_INSERT_VEHICLE_SERVICE_BLOCKS),
    variables: { objects },
  };
};

const GQL_DELETE_VEHICLE_SERVICE_BLOCKS = gql`
  mutation RemoveVehicleServiceBlocks($block_ids: [uuid!]!) {
    timetables {
      timetables_delete_vehicle_service_block(
        where: { block_id: { _in: $block_ids } }
      ) {
        returning {
          block_id
        }
      }
    }
  }
`;

export const mapToDeleteVehicleServiceBlocksMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_VEHICLE_SERVICE_BLOCKS),
    variables: { block_ids: uuids },
  };
};

const GQL_INSERT_VEHICLE_JOURNEYS = gql`
  mutation InsertVehicleJourneys(
    $objects: [timetables_vehicle_journey_vehicle_journey_insert_input!]!
  ) {
    timetables {
      timetables_insert_vehicle_journey_vehicle_journey(objects: $objects) {
        returning {
          vehicle_journey_id
        }
      }
    }
  }
`;

export const mapToCreateVehicleJourneys = (
  objects: TimetablesVehicleJourneyVehicleJourneyInsertInput[],
) => {
  return {
    operationName: 'InsertVehicleJourneys',
    query: getGqlString(GQL_INSERT_VEHICLE_JOURNEYS),
    variables: { objects },
  };
};

const GQL_DELETE_VEHICLE_JOURNEYS = gql`
  mutation DeleteVehicleJourneys($vehicle_journey_ids: [uuid!]!) {
    timetables {
      timetables_delete_vehicle_journey_vehicle_journey(
        where: { vehicle_journey_id: { _in: $vehicle_journey_ids } }
      ) {
        returning {
          vehicle_journey_id
        }
      }
    }
  }
`;

export const mapToDeleteVehicleJourneysMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_VEHICLE_JOURNEYS),
    variables: { vehicle_journey_ids: uuids },
  };
};

const GQL_INSERT_TIMETABLED_PASSING_TIMES = gql`
  mutation InsertTimetabledPassingTimes(
    $objects: [timetables_passing_times_timetabled_passing_time_insert_input!]!
  ) {
    timetables {
      timetables_insert_passing_times_timetabled_passing_time(
        objects: $objects
      ) {
        returning {
          timetabled_passing_time_id
        }
      }
    }
  }
`;

export const mapToCreateTimetabledPassingTimesMutation = (
  objects: TimetablesPassingTimesTimetabledPassingTimeInsertInput[],
) => {
  return {
    operationName: 'InsertTimetabledPassingTimes',
    query: getGqlString(GQL_INSERT_TIMETABLED_PASSING_TIMES),
    variables: { objects },
  };
};

const GQL_DELETE_TIMETABLED_PASSING_TIMES = gql`
  mutation DeleteTimetabledPassingTimes(
    $timetabled_passing_time_ids: [uuid!]!
  ) {
    timetables {
      timetables_delete_passing_times_timetabled_passing_time(
        where: {
          timetabled_passing_time_id: { _in: $timetabled_passing_time_ids }
        }
      ) {
        returning {
          timetabled_passing_time_id
        }
      }
    }
  }
`;

export const mapToDeleteTimetabledPassingTimesMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_TIMETABLED_PASSING_TIMES),
    variables: { timetabled_passing_time_ids: uuids },
  };
};
