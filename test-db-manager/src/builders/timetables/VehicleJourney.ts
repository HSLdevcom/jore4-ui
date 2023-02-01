import { VehicleJourneyInsertInput } from '../../../dist';
import { TimetabledPassingTime } from './TimetabledPassingTime';
import { TimetableObject } from './TimetableObject';

export class VehicleJourney extends TimetableObject<
  TimetabledPassingTime,
  VehicleJourneyInsertInput
> {
  UUIDFieldName = 'vehicle_journey_id';

  parentUUIDFieldName = 'block_id';

  constructor(properties: VehicleJourneyInsertInput) {
    super(properties);
    // eslint-disable-next-line no-constructor-return
    return this;
  }

  addTimetabledPassingTime(timetabledPassingTimes: TimetabledPassingTime[]) {
    this.addChildren(timetabledPassingTimes);

    return this;
  }

  clone() {
    return new VehicleJourney(this.properties).cloneChildren(this);
  }
}
