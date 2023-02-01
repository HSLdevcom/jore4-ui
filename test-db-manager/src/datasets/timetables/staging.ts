import { Duration } from 'luxon';
import { StopInJourneyPatternRefInsertInput } from '../../../dist';
import {
  Block,
  DayType,
  FlattedObjects,
  TimetabledPassingTime,
  VehicleJourney,
  VehicleScheduleFrame,
  VehicleService,
} from '../../builders/timetables';
import { TimetablePriority } from '../../types';
import { findStopIdByLabel } from './index';

export const buildStagingSeed = (
  knownStops: StopInJourneyPatternRefInsertInput[],
): FlattedObjects => {
  const vehicleJourney = new VehicleJourney({
    journey_pattern_ref_id: 'a6f626c8-e743-4c38-b9c1-c537ffb2863f',
  }).addTimetabledPassingTime([
    new TimetabledPassingTime({
      scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel(
        'H2206',
        knownStops,
      ),
      arrival_time: Duration.fromISO('PT5M'),
      departure_time: Duration.fromISO('PT5M'),
    }),
    new TimetabledPassingTime({
      scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel(
        'H2207',
        knownStops,
      ),
      arrival_time: Duration.fromISO('PT5M'),
      departure_time: Duration.fromISO('PT5M'),
    }),
    new TimetabledPassingTime({
      scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel(
        'H2208',
        knownStops,
      ),
      arrival_time: Duration.fromISO('PT5M'),
      departure_time: Duration.fromISO('PT5M'),
    }),
  ]);

  // Demonstrate cloning vehicle journeys
  const block = new Block()
    .addVehicleJourney(vehicleJourney)
    .addVehicleJourney(vehicleJourney.clone())
    .addVehicleJourney(vehicleJourney.clone())
    .addVehicleJourney(vehicleJourney.clone());

  const vehicleScheduleFrame = new VehicleScheduleFrame({
    priority: TimetablePriority.Staging,
    name_i18n: {
      fi_FI: '2022 Syksy - 2022 Kevät',
      sv_FI: '2022 Höst - 2022 Vår',
    },
  })
    .addChild(
      new VehicleService({
        day_type_id: DayType.MonFri,
      })
        .addBlock(block)
        .addBlock(block.clone())
        .addBlock(block.clone())
        .addBlock(block.clone()),
    )
    .build();

  return vehicleScheduleFrame.getFlattedObjects();
};
