import { TimetablesPassingTimesTimetabledPassingTimeInsertInput } from '../../../dist';
import { TimetableObject } from './TimetableObject';

export class TimetabledPassingTime extends TimetableObject<
  never,
  TimetablesPassingTimesTimetabledPassingTimeInsertInput
> {
  UUIDFieldName = 'timetabled_passing_time_id';

  parentUUIDFieldName = 'vehicle_journey_id';

  clone() {
    return new TimetabledPassingTime(this.properties);
  }
}
