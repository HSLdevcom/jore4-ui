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

const concatArrays = <T extends ExplicitAny>(
  to: T[] | undefined,
  from: T[] | undefined,
) => (to || []).concat(from || []);

export const mergeTimetablesResources = (
  resources: TimetablesResources[],
): TimetablesResources =>
  resources.reduce<TimetablesResources>(
    (result, currentResources) => ({
      journeyPatternRefs: concatArrays(
        result.journeyPatternRefs,
        currentResources.journeyPatternRefs,
      ),
      stopsInJourneyPatternRefs: concatArrays(
        result.stopsInJourneyPatternRefs,
        currentResources.stopsInJourneyPatternRefs,
      ),
      vehicleScheduleFrames: concatArrays(
        result.vehicleScheduleFrames,
        currentResources.vehicleScheduleFrames,
      ),
      vehicleServices: concatArrays(
        result.vehicleServices,
        currentResources.vehicleServices,
      ),
      vehicleServiceBlocks: concatArrays(
        result.vehicleServiceBlocks,
        currentResources.vehicleServiceBlocks,
      ),
      vehicleJourneys: concatArrays(
        result.vehicleJourneys,
        currentResources.vehicleJourneys,
      ),
      timetabledPassingTimes: concatArrays(
        result.timetabledPassingTimes,
        currentResources.timetabledPassingTimes,
      ),
    }),
    {},
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleErrors = (message: string, res: any) => {
  if (res.errors) {
    throw new Error(`${message}: ${JSON.stringify(res.errors, null, 2)}`);
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
    handleErrors('Deleting vehicle journeys', res);
  }
  if (vehicleJourneys) {
    const res = await hasuraApi(
      mapToDeleteVehicleJourneysMutation(
        vehicleJourneys.map((item) => item.vehicle_journey_id),
      ),
    );
    handleErrors('Deleting vehicle journeys', res);
  }
  if (vehicleServiceBlocks) {
    const res = await hasuraApi(
      mapToDeleteVehicleServiceBlocksMutation(
        vehicleServiceBlocks.map((item) => item.block_id),
      ),
    );
    handleErrors('Deleting vehicle service blocks', res);
  }
  if (vehicleServices) {
    const res = await hasuraApi(
      mapToDeleteVehicleServicesMutation(
        vehicleServices.map((item) => item.vehicle_service_id),
      ),
    );
    handleErrors('Deleting vehicle services', res);
  }
  if (vehicleScheduleFrames) {
    const res = await hasuraApi(
      mapToDeleteVehicleScheduleFramesMutation(
        vehicleScheduleFrames.map((item) => item.vehicle_schedule_frame_id),
      ),
    );
    handleErrors('Deleting vehicle schedule frames', res);
  }
  if (stopsInJourneyPatternRefs) {
    const res = await hasuraApi(
      mapToDeleteStopInJourneyPatternRefMutation(
        stopsInJourneyPatternRefs.map(
          (item) => item.scheduled_stop_point_in_journey_pattern_ref_id,
        ),
      ),
    );
    handleErrors('Deleting stops in journey pattern refs', res);
  }

  if (journeyPatternRefs) {
    const res = await hasuraApi(
      mapToDeleteTimetablesJourneyPatternRefsMutation(
        journeyPatternRefs.map((item) => item.journey_pattern_ref_id),
      ),
    );
    handleErrors('Deleting journey pattern refs', res);
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
    handleErrors('Inserting journey pattern refs', res);
  }
  if (stopsInJourneyPatternRefs) {
    const res = await hasuraApi(
      mapToCreateStopInJourneyPatternRefMutation(stopsInJourneyPatternRefs),
    );
    handleErrors('Inserting stops in journey pattern refs', res);
  }
  if (vehicleScheduleFrames) {
    const res = await hasuraApi(
      mapToCreateVehicleScheduleFramesMutation(vehicleScheduleFrames),
    );
    handleErrors('Inserting vehicle schedule frames', res);
  }
  if (vehicleServices) {
    const res = await hasuraApi(mapToCreateVehicleServices(vehicleServices));
    handleErrors('Inserting vehicle services', res);
  }
  if (vehicleServiceBlocks) {
    const res = await hasuraApi(
      mapToCreateVehicleServiceBlocks(vehicleServiceBlocks),
    );
    handleErrors('Inserting vehicle service blocks', res);
  }
  if (vehicleJourneys) {
    const res = await hasuraApi(mapToCreateVehicleJourneys(vehicleJourneys));
    handleErrors('Inserting vehicle journeys', res);
  }
  if (timetabledPassingTimes) {
    const res = await hasuraApi(
      mapToCreateTimetabledPassingTimesMutation(timetabledPassingTimes),
    );
    handleErrors('Inserting timetabled passing times', res);
  }
};
