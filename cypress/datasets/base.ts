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
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import cloneDeepWith from 'lodash/cloneDeepWith';
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

export const stopCoordinatesByLabel = {
  E2E001: [24.9390091244705, 60.16551299383615, 0],
  E2E002: [24.937610671343663, 60.16648629862467, 0],
  E2E003: [24.93286261070354, 60.165644561954316, 0],
  E2E004: [24.932290135584754, 60.16486923767877, 0],
  E2E005: [24.9314028056389, 60.163980768982995, 0],
  E2E006: [24.93296734706376, 60.16543343120806, 0],
  E2E007: [24.935714344053142, 60.16644692066976, 0],
  E2E008: [24.937281651830318, 60.16645331474371, 0],
  E2E009: [24.93877038021971, 60.1653765292378, 0],
  E2E010: [24.706945, 60.157696, 0],
};

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
      coordinates: stopCoordinatesByLabel.E2E001,
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
      coordinates: stopCoordinatesByLabel.E2E002,
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
      coordinates: stopCoordinatesByLabel.E2E003,
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
      coordinates: stopCoordinatesByLabel.E2E004,
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
      coordinates: stopCoordinatesByLabel.E2E005,
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
      coordinates: stopCoordinatesByLabel.E2E006,
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
      coordinates: stopCoordinatesByLabel.E2E007,
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
      coordinates: stopCoordinatesByLabel.E2E008,
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
      coordinates: stopCoordinatesByLabel.E2E009,
    },
  },
  {
    ...buildStop({
      label: 'E2E010',
      located_on_infrastructure_link_id: testInfraLinkIds[0],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    direction: InfrastructureNetworkDirectionEnum.Backward,
    scheduled_stop_point_id: '75afcec1-68a3-4411-bad2-f4f235c37215',
    timing_place_id: timingPlaces[0].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: stopCoordinatesByLabel.E2E010,
    },
  },
];

const lines: LineInsertInput[] = [
  // Proper line with stops
  {
    ...buildLine({ label: '901' }),
    line_id: '08d1fa6b-440c-421e-ad4d-0778d65afe60',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
    validity_start: DateTime.fromISO('2022-01-01'),
  },

  // Raw lines
  // Valid in 2022
  {
    ...buildLine({ label: '1666' }),
    line_id: '5dfa82f1-b3f7-4e26-b31d-0d7bd78da0be',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
    validity_start: DateTime.fromISO('2022-01-02'),
    validity_end: DateTime.fromISO('2022-12-24'),
  },
  // Valid in 2023
  {
    ...buildLine({ label: '2666' }),
    line_id: '61e4d95e-34e5-11ed-a261-0242ac120002',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
    validity_start: DateTime.fromISO('2023-01-02'),
    validity_end: DateTime.fromISO('2023-12-24'),
  },
  // Valid in 2024
  {
    ...buildLine({ label: '1777' }),
    line_id: '47c5fe92-e630-430b-a2da-2c6739acbb2b',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
    validity_start: DateTime.fromISO('2024-01-02'),
    validity_end: DateTime.fromISO('2024-12-24'),
  },
  // Valid between 2000 and 2054
  {
    ...buildLine({ label: '9999' }),
    line_id: '7f5aa870-891a-433e-bd9b-f864162a2adf',
    validity_start: DateTime.fromISO('2000-01-02'),
    validity_end: DateTime.fromISO('2054-12-24'),
  },
  {
    ...buildLine({ label: '9888' }),
    line_id: 'a627dfbf-8db6-4519-b968-56b4a4988d91',
    validity_start: DateTime.fromISO('2000-01-02'),
    validity_end: DateTime.fromISO('2054-12-24'),
  },
  {
    ...buildLine({ label: '8888' }),
    line_id: '69141b10-98cb-4319-9fe9-95cddbd46987',
    validity_start: DateTime.fromISO('2000-01-02'),
    validity_end: DateTime.fromISO('2054-12-24'),
  },
  // Always valid.
  {
    ...buildLine({ label: '8889' }),
    line_id: '429413b0-a3b7-4b12-a3a1-5c26268066c1',
    validity_start: null,
    validity_end: null,
  },
];

export const routes: RouteInsertInput[] = [
  // Proper routes with stops
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

  // Raw routes
  // Valid in 2022
  {
    ...buildRoute({ label: '1111' }),
    route_id: '48490721-3346-493a-80c8-3edd07c2d5d6',
    on_line_id: lines[1].line_id,
    validity_start: lines[1].validity_start,
    validity_end: lines[1].validity_end,
  },
  // Valid in 2023
  {
    ...buildRoute({ label: '1222' }),
    route_id: 'd82ebf21-5adb-419c-b057-c6e3b0f7480c',
    on_line_id: lines[2].line_id,
    validity_start: lines[2].validity_start,
    validity_end: lines[2].validity_end,
  },
  // Valid in 2024
  {
    ...buildRoute({ label: '2333' }),
    route_id: 'fa6196fa-ce61-4808-84bf-f4fc60bf1162',
    on_line_id: lines[3].line_id,
    validity_start: lines[3].validity_start,
    validity_end: lines[3].validity_end,
  },
  // The rest are valid between 2000 and 2054
  {
    ...buildRoute({ label: '1999' }),
    route_id: 'eec15aaf-3cf3-4fc8-86a1-7849ea4d88e0',
    on_line_id: lines[4].line_id,
    validity_start: lines[4].validity_start,
    validity_end: lines[4].validity_end,
  },
  {
    ...buildRoute({ label: '1888' }),
    route_id: '88f2bb05-8438-41ab-ba26-27983250a78e',
    on_line_id: lines[4].line_id,
    validity_start: lines[4].validity_start,
    validity_end: lines[4].validity_end,
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
export const getClonedBaseDbResources = (): typeof baseDbResources =>
  cloneDeepWith(baseDbResources, (value) => {
    if (value instanceof DateTime) {
      return value;
    }

    return undefined;
  });
