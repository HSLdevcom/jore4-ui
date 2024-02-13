import omit from 'lodash/omit';
import {
  BlockInsertInputDeep,
  JourneyPatternRefInsertInputDeep,
  VehicleJourneyInsertInputDeep,
  VehicleScheduleFrameInsertInputDeep,
  VehicleServiceInsertInputDeep,
} from '../types/inputs';
import { TimetablesResources, mergeTimetablesResources } from './timetables';

const flattenVehicleJourney = (
  vehicleJourney: VehicleJourneyInsertInputDeep,
): TimetablesResources => ({
  vehicleJourneys: [
    // strip children references as they are inserted separately
    omit(vehicleJourney, 'timetabled_passing_times'),
  ],
  timetabledPassingTimes: vehicleJourney.timetabled_passing_times.data,
});

const flattenBlock = (block: BlockInsertInputDeep): TimetablesResources => {
  const vehicleJourneyResources: TimetablesResources[] =
    block.vehicle_journeys.data.map(flattenVehicleJourney);
  const blockResources: TimetablesResources = {
    vehicleServiceBlocks: [
      // strip children references as they are inserted separately
      omit(block, 'vehicle_journeys'),
    ],
  };
  return mergeTimetablesResources([blockResources, ...vehicleJourneyResources]);
};

const flattenVehicleService = (
  vehicleService: VehicleServiceInsertInputDeep,
): TimetablesResources => {
  const blockResources: TimetablesResources[] =
    vehicleService.blocks.data.map(flattenBlock);
  const vehicleServiceResources: TimetablesResources = {
    vehicleServices: [
      // strip children references as they are inserted separately
      omit(vehicleService, 'blocks'),
    ],
  };
  return mergeTimetablesResources([vehicleServiceResources, ...blockResources]);
};

export const flattenVehicleScheduleFrame = (
  vehicleScheduleFrame: VehicleScheduleFrameInsertInputDeep,
): TimetablesResources => {
  const vehicleScheduleFrameResources: TimetablesResources = {
    vehicleScheduleFrames: [
      // strip children references as they are inserted separately
      omit(vehicleScheduleFrame, 'vehicle_services'),
    ],
  };
  const vehicleServiceResources: TimetablesResources[] =
    vehicleScheduleFrame.vehicle_services.data.map(flattenVehicleService);
  return mergeTimetablesResources([
    vehicleScheduleFrameResources,
    ...vehicleServiceResources,
  ]);
};

export const flattenJourneyPatternRef = (
  journeyPatternRef: JourneyPatternRefInsertInputDeep,
): TimetablesResources => ({
  journeyPatternRefs: [
    // strip children references as they are inserted separately
    omit(journeyPatternRef, 'scheduled_stop_point_in_journey_pattern_refs'),
  ],
  stopsInJourneyPatternRefs:
    journeyPatternRef.scheduled_stop_point_in_journey_pattern_refs.data,
});
