import { VehicleServiceBlockInsertInput } from '../../../dist';
import { TimetableObject } from './TimetableObject';
import { VehicleJourney } from './VehicleJourney';

export class Block extends TimetableObject<
  VehicleJourney,
  VehicleServiceBlockInsertInput
> {
  UUIDFieldName = 'block_id';

  parentUUIDFieldName = 'vehicle_service_id';

  constructor(properties?: VehicleServiceBlockInsertInput) {
    super(properties || {});
    // eslint-disable-next-line no-constructor-return
    return this;
  }

  addVehicleJourney(vehicleJourney: VehicleJourney) {
    this.addChild(vehicleJourney);

    return this;
  }

  clone() {
    return new Block(this.properties).cloneChildren(this);
  }
}
