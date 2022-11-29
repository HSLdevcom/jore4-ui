import {
  mapToCreateStopInJourneyPatternRefMutation,
  mapToCreateTimetabledPassingTimesMutation,
  mapToCreateTimetablesJourneyPatternRefsMutation,
  mapToCreateVehicleJourneys,
  mapToCreateVehicleScheduleFramesMutation,
  mapToCreateVehicleServiceBlocks,
  mapToCreateVehicleServices,
  mapToDeleteStopInJourneyPatternRefMutation,
  mapToDeleteTimetabledPassingTimesMutation,
  mapToDeleteTimetablesJourneyPatternRefsMutation,
  mapToDeleteVehicleJourneysMutation,
  mapToDeleteVehicleScheduleFramesMutation,
  mapToDeleteVehicleServiceBlocksMutation,
  mapToDeleteVehicleServicesMutation,
} from '../builders';
import { hasuraApi } from '../hasuraApi';
import {
  JourneyPatternRefInsertInput,
  StopInJourneyPatternRefInsertInput,
  TimetabledPassingTimeInsertInput,
  VehicleJourneyInsertInput,
  VehicleScheduleFrameInsertInput,
  VehicleServiceBlockInsertInput,
  VehicleServiceInsertInput,
} from '../types';

export interface TimetablesResources {
  journeyPatternRefs?: JourneyPatternRefInsertInput[];
  stopsInJourneyPatternRefs?: StopInJourneyPatternRefInsertInput[];
  vehicleScheduleFrames?: VehicleScheduleFrameInsertInput[];
  vehicleServices?: VehicleServiceInsertInput[];
  vehicleServiceBlocks?: VehicleServiceBlockInsertInput[];
  vehicleJourneys?: VehicleJourneyInsertInput[];
  timetabledPassingTimes?: TimetabledPassingTimeInsertInput[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const responseLogger = (message: string, res: any) => {
  if (res.errors) {
    // eslint-disable-next-line no-console
    console.log(`${message}:`, res);
  }
};

export const clearTimetablesDb = async ({
  journeyPatternRefs,
  stopsInJourneyPatternRefs,
  vehicleScheduleFrames,
  vehicleServices,
  vehicleServiceBlocks,
  vehicleJourneys,
  timetabledPassingTimes,
}: TimetablesResources) => {
  if (timetabledPassingTimes) {
    const res = await hasuraApi(
      mapToDeleteTimetabledPassingTimesMutation(
        timetabledPassingTimes.map((item) => item.timetabled_passing_time_id),
      ),
    );
    responseLogger('Deleting vehicle journeys', res);
  }
  if (vehicleJourneys) {
    const res = await hasuraApi(
      mapToDeleteVehicleJourneysMutation(
        vehicleJourneys.map((item) => item.vehicle_journey_id),
      ),
    );
    responseLogger('Deleting vehicle journeys', res);
  }
  if (vehicleServiceBlocks) {
    const res = await hasuraApi(
      mapToDeleteVehicleServiceBlocksMutation(
        vehicleServiceBlocks.map((item) => item.block_id),
      ),
    );
    responseLogger('Deleting vehicle service blocks', res);
  }
  if (vehicleServices) {
    const res = await hasuraApi(
      mapToDeleteVehicleServicesMutation(
        vehicleServices.map((item) => item.vehicle_service_id),
      ),
    );
    responseLogger('Deleting vehicle services', res);
  }
  if (vehicleScheduleFrames) {
    const res = await hasuraApi(
      mapToDeleteVehicleScheduleFramesMutation(
        vehicleScheduleFrames.map((item) => item.vehicle_schedule_frame_id),
      ),
    );
    responseLogger('Deleting vehicle schedule frames', res);
  }
  if (stopsInJourneyPatternRefs) {
    const res = await hasuraApi(
      mapToDeleteStopInJourneyPatternRefMutation(
        stopsInJourneyPatternRefs.map(
          (item) => item.scheduled_stop_point_in_journey_pattern_ref_id,
        ),
      ),
    );
    responseLogger('Deleting stops in journey pattern refs', res);
  }

  if (journeyPatternRefs) {
    const res = await hasuraApi(
      mapToDeleteTimetablesJourneyPatternRefsMutation(
        journeyPatternRefs.map((item) => item.journey_pattern_ref_id),
      ),
    );
    responseLogger('Deleting journey pattern refs', res);
  }
};

export const populateTimetablesDb = async ({
  journeyPatternRefs,
  stopsInJourneyPatternRefs,
  vehicleScheduleFrames,
  vehicleServices,
  vehicleServiceBlocks,
  vehicleJourneys,
  timetabledPassingTimes,
}: TimetablesResources) => {
  if (journeyPatternRefs) {
    const res = await hasuraApi(
      mapToCreateTimetablesJourneyPatternRefsMutation(journeyPatternRefs),
    );
    responseLogger('Inserting journey pattern refs', res);
  }
  if (stopsInJourneyPatternRefs) {
    const res = await hasuraApi(
      mapToCreateStopInJourneyPatternRefMutation(stopsInJourneyPatternRefs),
    );
    responseLogger('Inserting stops in journey pattern refs', res);
  }
  if (vehicleScheduleFrames) {
    const res = await hasuraApi(
      mapToCreateVehicleScheduleFramesMutation(vehicleScheduleFrames),
    );
    responseLogger('Inserting vehicle schedule frames', res);
  }
  if (vehicleServices) {
    const res = await hasuraApi(mapToCreateVehicleServices(vehicleServices));
    responseLogger('Inserting vehicle services', res);
  }
  if (vehicleServiceBlocks) {
    const res = await hasuraApi(
      mapToCreateVehicleServiceBlocks(vehicleServiceBlocks),
    );
    responseLogger('Inserting vehicle service blocks', res);
  }
  if (vehicleJourneys) {
    const res = await hasuraApi(mapToCreateVehicleJourneys(vehicleJourneys));
    responseLogger('Inserting vehicle journeys', res);
  }
  if (timetabledPassingTimes) {
    const res = await hasuraApi(
      mapToCreateTimetabledPassingTimesMutation(timetabledPassingTimes),
    );
    responseLogger('Inserting timetabled passing times', res);
  }
};
