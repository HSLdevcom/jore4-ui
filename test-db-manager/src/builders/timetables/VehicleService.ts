import { VehicleServiceInsertInput } from '../../../dist';
import { Block } from './Block';
import { TimetableObject } from './TimetableObject';

export enum DayType {
  MonFri = '38853b0d-ec36-4110-b4bc-f53218c6cdcd',
  Sat = '61374d2b-5cce-4a7d-b63a-d487f3a05e0d',
  Sun = '0e1855f1-dfca-4900-a118-f608aa07e939',
}

export class VehicleService extends TimetableObject<
  Block,
  VehicleServiceInsertInput
> {
  UUIDFieldName = 'vehicle_service_id';

  parentUUIDFieldName = 'vehicle_schedule_frame_id';

  addBlock(block: Block) {
    this.addChild(block);

    return this;
  }

  clone() {
    return new VehicleService(this.properties).cloneChildren(this);
  }
}
