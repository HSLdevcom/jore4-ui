import {
  TimetabledPassingTimeInsertInput,
  VehicleJourneyInsertInput,
  VehicleScheduleFrameInsertInput,
  VehicleServiceBlockInsertInput,
  VehicleServiceInsertInput,
} from '../../../dist';
import { TimetableObject } from './TimetableObject';
import { VehicleService } from './VehicleService';

export interface FlattedObjects {
  vehicleScheduleFrames: VehicleScheduleFrameInsertInput[];
  vehicleServices: VehicleServiceInsertInput[];
  vehicleServiceBlocks?: VehicleServiceBlockInsertInput[];
  vehicleJourneys?: VehicleJourneyInsertInput[];
  timetabledPassingTimes?: TimetabledPassingTimeInsertInput[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToObjects<T extends TimetableObject<any, any>>(
  tiletableObjects: T[],
) {
  return tiletableObjects.map((object) => object.generateObject());
}

export class VehicleScheduleFrame extends TimetableObject<
  VehicleService,
  VehicleScheduleFrameInsertInput
> {
  UUIDFieldName = 'vehicle_schedule_frame_id';

  parentUUIDFieldName = undefined;

  addVehicleService(vehicleService: VehicleService) {
    this.addChild(vehicleService);

    return this;
  }

  clone() {
    return new VehicleScheduleFrame(this.properties).cloneChildren(this);
  }

  getFlattedObjects(): FlattedObjects {
    const vehicleScheduleFrames = [this] as VehicleScheduleFrame[];
    const vehicleServices = vehicleScheduleFrames.flatMap(
      (object) => object.children,
    );
    const vehicleServiceBlocks = vehicleServices.flatMap(
      (object) => object.children,
    );
    const vehicleJourneys = vehicleServiceBlocks.flatMap(
      (object) => object.children,
    );
    const timetabledPassingTimes = vehicleJourneys.flatMap(
      (object) => object.children,
    );

    return {
      vehicleScheduleFrames: mapToObjects(vehicleScheduleFrames),
      vehicleServices: mapToObjects(vehicleServices),
      vehicleServiceBlocks: mapToObjects(vehicleServiceBlocks),
      vehicleJourneys: mapToObjects(vehicleJourneys),
      timetabledPassingTimes: mapToObjects(timetabledPassingTimes),
    };
  }
}
