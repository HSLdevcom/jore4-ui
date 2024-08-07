import {
  InfraLinkAlongRouteInsertInput,
  InfrastructureNetworkDirectionEnum,
  JourneyPatternInsertInput,
  LineInsertInput,
  RouteDirectionEnum,
  RouteInsertInput,
  RouteTypeOfLineEnum,
  StopInJourneyPatternInsertInput,
  buildLine,
  buildRoute,
  buildStop,
  buildStopInJourneyPattern,
  buildTimingPlace,
} from '@hsl/jore4-test-db-manager';
import cloneDeep from 'lodash/cloneDeep';
import { DateTime } from 'luxon';
import { UUID } from '../types';

export const testInfraLinkExternalIds = [
  '442321', // on Annankatu, between Bulevardi and Lönnrotinkatu and
  '442326', // on Annankatu, between Lönnrotinkatu and Kalevankatu
  '442317', // on Kalevankatu, between Annankatu and Fredrikinkatu
  '442027', // on Kalevankatu, between Fredrikinkatu and Albertinkatu
  '442438', // on Albertinkatu, between Kalevankatu and Lönnrotinkatu (one-way)
  '445113', // on Lönnrotinkatu, between Albertinkatu and Abrahaminkatu (one-way)
  '445118', // on Abrahaminkatu, between Lönnrotinkatu and Kalevankatu
  '442423', // on Kalevankatu, between Abrahaminkatu and Albertinkatu
];

const timingPlaces = [
  buildTimingPlace('f7fd2b8c-380b-48da-b87c-78bfa1690aa3', '1AACKT'),
  buildTimingPlace('3faa5ec1-aa5c-423e-9064-1523c460299e', '1AURLA'),
  buildTimingPlace('045168c1-6950-4083-85e4-7f226599c0ef', '1EIRA'),
  buildTimingPlace('763b275a-bd51-4310-93ff-0bd666c67849', '1ALKU'),
];

export const buildStopsOnInfraLinks = (testInfraLinkIds: UUID[]) => [
  // Stops along test route 901 Outbound
  {
    ...buildStop({
      label: 'E2E001',
      located_on_infrastructure_link_id: testInfraLinkIds[0],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    direction: InfrastructureNetworkDirectionEnum.Forward,
    scheduled_stop_point_id: '2dc9f032-24a7-423d-b034-ca07673d23c1',
    timing_place_id: timingPlaces[0].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: [24.9390091244705, 60.16551299383615, 0],
    },
  },
  {
    ...buildStop({
      label: 'E2E002',
      located_on_infrastructure_link_id: testInfraLinkIds[1],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    direction: InfrastructureNetworkDirectionEnum.Forward,
    scheduled_stop_point_id: 'a92c7c8f-352b-432d-a6f6-a91a894dbb83',
    measured_location: {
      type: 'Point',
      coordinates: [24.937610671343663, 60.16648629862467, 0],
    },
  },
  {
    ...buildStop({
      label: 'E2E003',
      located_on_infrastructure_link_id: testInfraLinkIds[3],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    direction: InfrastructureNetworkDirectionEnum.Backward,
    scheduled_stop_point_id: 'a00cdd88-0a65-43e6-862d-ec201ff09294',
    timing_place_id: timingPlaces[1].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: [24.93286261070354, 60.165644561954316, 0],
    },
  },
  {
    ...buildStop({
      label: 'E2E004',
      located_on_infrastructure_link_id: testInfraLinkIds[4],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    direction: InfrastructureNetworkDirectionEnum.Backward,
    scheduled_stop_point_id: '31d84532-43e4-47d2-b7fd-ba8184ae9e70',
    measured_location: {
      type: 'Point',
      coordinates: [24.932290135584754, 60.16486923767877, 0],
    },
  },
  {
    ...buildStop({
      label: 'E2E005',
      located_on_infrastructure_link_id: testInfraLinkIds[5],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    direction: InfrastructureNetworkDirectionEnum.Backward,
    scheduled_stop_point_id: 'a7fa228e-5090-4823-9134-cdd89fcbb35d',
    timing_place_id: timingPlaces[2].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: [24.9314028056389, 60.163980768982995, 0],
    },
  },
  // Stops along test route 901 Inbound
  {
    ...buildStop({
      label: 'E2E006',
      located_on_infrastructure_link_id: testInfraLinkIds[3],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    direction: InfrastructureNetworkDirectionEnum.Forward,
    scheduled_stop_point_id: 'a86abf00-e81c-4d76-a8ad-82ef6b6bcb06',
    timing_place_id: timingPlaces[1].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: [24.93296734706376, 60.16543343120806, 0],
    },
  },
  {
    ...buildStop({
      label: 'E2E007',
      located_on_infrastructure_link_id: testInfraLinkIds[2],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    direction: InfrastructureNetworkDirectionEnum.Forward,
    scheduled_stop_point_id: '43dc3fd1-2cfe-40fe-9431-dd8d85c124f2',
    measured_location: {
      type: 'Point',
      coordinates: [24.935714344053142, 60.16644692066976, 0],
    },
  },
  {
    ...buildStop({
      label: 'E2E008',
      located_on_infrastructure_link_id: testInfraLinkIds[1],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    direction: InfrastructureNetworkDirectionEnum.Backward,
    scheduled_stop_point_id: '8d60a644-fce6-460b-ad1c-30b5a39dee17',
    measured_location: {
      type: 'Point',
      coordinates: [24.937281651830318, 60.16645331474371, 0],
    },
  },
  {
    ...buildStop({
      label: 'E2E009',
      located_on_infrastructure_link_id: testInfraLinkIds[0],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    direction: InfrastructureNetworkDirectionEnum.Backward,
    scheduled_stop_point_id: 'a689ec3a-336a-4491-a0d5-8792e15a7b7e',
    timing_place_id: timingPlaces[0].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: [24.93877038021971, 60.1653765292378, 0],
    },
  },
];

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '901' }),
    line_id: '08d1fa6b-440c-421e-ad4d-0778d65afe60',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
  },
];

export const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '901' }),
    route_id: '994a7d79-4991-423b-9c1a-0ca621a6d9ed',
    direction: RouteDirectionEnum.Outbound,
    on_line_id: lines[0].line_id,
    validity_start: DateTime.fromISO('2022-08-11'),
    validity_end: DateTime.fromISO('2032-08-11'),
  },
  {
    ...buildRoute({ label: '901' }),
    route_id: '5f1fff1a-2449-4a8f-8107-15edc6f46fce',
    direction: RouteDirectionEnum.Inbound,
    on_line_id: lines[0].line_id,
    validity_start: DateTime.fromISO('2022-08-11'),
    validity_end: DateTime.fromISO('2032-08-11'),
  },
];

export const journeyPatterns: JourneyPatternInsertInput[] = [
  {
    journey_pattern_id: '6cae356b-20f4-4e04-a969-097999b351f0',
    on_route_id: routes[0].route_id,
  },
  {
    journey_pattern_id: '940eda2f-c9b3-42ce-879e-01e8ac4c5326',
    on_route_id: routes[1].route_id,
  },
];

export const stopsInJourneyPattern901Outbound = [
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: 'E2E001',
    scheduledStopPointSequence: 0,
    isUsedAsTimingPoint: true,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: 'E2E002',
    scheduledStopPointSequence: 1,
    isUsedAsTimingPoint: false,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: 'E2E003',
    scheduledStopPointSequence: 2,
    isUsedAsTimingPoint: true,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: 'E2E004',
    scheduledStopPointSequence: 3,
    isUsedAsTimingPoint: false,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: 'E2E005',
    scheduledStopPointSequence: 4,
    isUsedAsTimingPoint: true,
  }),
];

export const stopsInJourneyPattern901Inbound = [
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[1].journey_pattern_id,
    stopLabel: 'E2E005',
    scheduledStopPointSequence: 0,
    isUsedAsTimingPoint: true,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[1].journey_pattern_id,
    stopLabel: 'E2E006',
    scheduledStopPointSequence: 1,
    isUsedAsTimingPoint: true,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[1].journey_pattern_id,
    stopLabel: 'E2E007',
    scheduledStopPointSequence: 2,
    isUsedAsTimingPoint: false,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[1].journey_pattern_id,
    stopLabel: 'E2E008',
    scheduledStopPointSequence: 3,
    isUsedAsTimingPoint: false,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[1].journey_pattern_id,
    stopLabel: 'E2E009',
    scheduledStopPointSequence: 4,
    isUsedAsTimingPoint: true,
  }),
];
const stopsInJourneyPattern: StopInJourneyPatternInsertInput[] = [
  ...stopsInJourneyPattern901Outbound,
  ...stopsInJourneyPattern901Inbound,
];

export const buildInfraLinksAlongRoute = (
  infrastructureLinkIds: UUID[],
): InfraLinkAlongRouteInsertInput[] => [
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[0],
    infrastructure_link_sequence: 0,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[1],
    infrastructure_link_sequence: 1,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[2],
    infrastructure_link_sequence: 2,
    is_traversal_forwards: false,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[3],
    infrastructure_link_sequence: 3,
    is_traversal_forwards: false,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[4],
    infrastructure_link_sequence: 4,
    is_traversal_forwards: false,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[5],
    infrastructure_link_sequence: 5,
    is_traversal_forwards: false,
  },
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[5],
    infrastructure_link_sequence: 0,
    is_traversal_forwards: false,
  },
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[6],
    infrastructure_link_sequence: 1,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[7],
    infrastructure_link_sequence: 2,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[3],
    infrastructure_link_sequence: 3,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[2],
    infrastructure_link_sequence: 4,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[1],
    infrastructure_link_sequence: 5,
    is_traversal_forwards: false,
  },
  {
    route_id: routes[1].route_id,
    infrastructure_link_id: infrastructureLinkIds[0],
    infrastructure_link_sequence: 6,
    is_traversal_forwards: false,
  },
];

/** Do not export this, so that the cloned one is the only used */
const baseDbResources = {
  lines,
  routes,
  timingPlaces,
  journeyPatterns,
  stopsInJourneyPattern,
};

/**
 * Returns a clone of baseDbResources so that the caller can
 * modify the data freely without side effects
 */
export const getClonedBaseDbResources = () => cloneDeep(baseDbResources);
