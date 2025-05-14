import cloneDeep from 'lodash/cloneDeep';
import { DateTime, Duration } from 'luxon';
import { journeyPatterns } from './base';

// Copied from timetables-data-inserter to avoid pulling it into the
// spec file bundle.
const defaultDayTypeIds = {
  MONDAY_THURSDAY: '6781bd06-08cf-489e-a2bb-be9a07b15752',
  MONDAY_FRIDAY: '38853b0d-ec36-4110-b4bc-f53218c6cdcd',
  MONDAY: 'd3dfb71f-8ee1-41fd-ad49-c4968c043290',
  TUESDAY: 'c1d27421-dd3b-43b6-a0b9-7387aae488c9',
  WEDNESDAY: '5ec086a3-343c-42f0-a050-3464fc3d63de',
  THURSDAY: '9c708e58-fb49-440e-b4bd-736b9275f53f',
  FRIDAY: '7176e238-d46e-4583-a567-b836b1ae2589',
  SATURDAY: '61374d2b-5cce-4a7d-b63a-d487f3a05e0d',
  SUNDAY: '0e1855f1-dfca-4900-a118-f608aa07e939',
};

export const monFriVehicleScheduleFrame = {
  validity_start: DateTime.fromISO('2023-01-01'),
  validity_end: DateTime.fromISO('2023-12-31'),
  name: '2023 mon fri',
  booking_label: '2023 booking label mon fri',
  _vehicle_services: {
    monFriFirstVehicle: {
      day_type_id: defaultDayTypeIds.MONDAY_FRIDAY,
      _blocks: {
        block: {
          _vehicle_journeys: {
            route901Outbound1: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT6H05M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT6H12M'),
                  departure_time: Duration.fromISO('PT6H12M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT6H19M'),
                  departure_time: Duration.fromISO('PT6H20M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT6H24M'),
                  departure_time: Duration.fromISO('PT6H25M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT6H29M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound1: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT6H30M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT6H37M'),
                  departure_time: Duration.fromISO('PT6H37M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT6H40M'),
                  departure_time: Duration.fromISO('PT6H41M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT6H44M'),
                  departure_time: Duration.fromISO('PT6H44M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT6H48M'),
                  departure_time: null,
                },
              ],
            },
            route901Outbound2: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT6H50M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT6H57M'),
                  departure_time: Duration.fromISO('PT6H57M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT7H00M'),
                  departure_time: Duration.fromISO('PT7H01M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT7H05M'),
                  departure_time: Duration.fromISO('PT7H06M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT7H09M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound2: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT7H10M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT7H17M'),
                  departure_time: Duration.fromISO('PT7H17M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT7H21M'),
                  departure_time: Duration.fromISO('PT7H22M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT7H29M'),
                  departure_time: Duration.fromISO('PT7H29M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT7H34M'),
                  departure_time: null,
                },
              ],
            },
            route901Outbound3: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT8H30M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT8H35M'),
                  departure_time: Duration.fromISO('PT8H35M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT8H42M'),
                  departure_time: Duration.fromISO('PT8H46M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT8H50M'),
                  departure_time: Duration.fromISO('PT8H51M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT8H53M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound3: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT8H55M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT9H00M'),
                  departure_time: Duration.fromISO('PT9H00M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT9H04M'),
                  departure_time: Duration.fromISO('PT9H05M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT9H12M'),
                  departure_time: Duration.fromISO('PT9H12M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT9H17M'),
                  departure_time: null,
                },
              ],
            },
          },
        },
      },
    },
    monFriSecondVehicle: {
      day_type_id: defaultDayTypeIds.MONDAY_FRIDAY,
      _blocks: {
        block: {
          _vehicle_journeys: {
            route901Outbound1: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT6H15M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT6H22M'),
                  departure_time: Duration.fromISO('PT6H22M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT6H29M'),
                  departure_time: Duration.fromISO('PT6H30M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT6H34M'),
                  departure_time: Duration.fromISO('PT6H35M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT6H39M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound1: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT6H40M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT6H47M'),
                  departure_time: Duration.fromISO('PT6H47M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT6H50M'),
                  departure_time: Duration.fromISO('PT6H51M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT6H54M'),
                  departure_time: Duration.fromISO('PT6H54M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT6H58M'),
                  departure_time: null,
                },
              ],
            },
            route901Outbound2: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT7H00M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT7H07M'),
                  departure_time: Duration.fromISO('PT7H07M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT7H10M'),
                  departure_time: Duration.fromISO('PT7H11M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT7H15M'),
                  departure_time: Duration.fromISO('PT7H16M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT7H19M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound2: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT7H20M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT7H27M'),
                  departure_time: Duration.fromISO('PT7H27M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT7H31M'),
                  departure_time: Duration.fromISO('PT7H32M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT7H39M'),
                  departure_time: Duration.fromISO('PT7H39M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT7H44M'),
                  departure_time: null,
                },
              ],
            },
            route901Outbound3: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT8H40M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT8H45M'),
                  departure_time: Duration.fromISO('PT8H45M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT8H52M'),
                  departure_time: Duration.fromISO('PT8H56M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT9H00M'),
                  departure_time: Duration.fromISO('PT9H01M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT9H03M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound3: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT9H05M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT9H10M'),
                  departure_time: Duration.fromISO('PT9H10M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT9H14M'),
                  departure_time: Duration.fromISO('PT9H15M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT9H22M'),
                  departure_time: Duration.fromISO('PT9H22M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT9H27M'),
                  departure_time: null,
                },
              ],
            },
          },
        },
      },
    },
  },
};

export const satVehicleScheduleFrame = {
  validity_start: DateTime.fromISO('2023-01-01'),
  validity_end: DateTime.fromISO('2023-12-31'),
  name: '2023 sat',
  booking_label: '2023 booking label sat',
  _vehicle_services: {
    saturdayFirstVehicle: {
      day_type_id: defaultDayTypeIds.SATURDAY,
      _blocks: {
        block: {
          _vehicle_journeys: {
            route901Outbound1: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT7H05M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT7H12M'),
                  departure_time: Duration.fromISO('PT7H12M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT7H19M'),
                  departure_time: Duration.fromISO('PT7H20M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT7H24M'),
                  departure_time: Duration.fromISO('PT7H25M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT7H29M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound1: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT7H30M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT7H37M'),
                  departure_time: Duration.fromISO('PT7H37M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT7H40M'),
                  departure_time: Duration.fromISO('PT7H41M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT7H44M'),
                  departure_time: Duration.fromISO('PT7H44M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT7H48M'),
                  departure_time: null,
                },
              ],
            },
            route901Outbound2: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT7H50M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT7H57M'),
                  departure_time: Duration.fromISO('PT7H57M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT8H00M'),
                  departure_time: Duration.fromISO('PT8H01M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT8H05M'),
                  departure_time: Duration.fromISO('PT8H06M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT8H09M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound2: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT8H10M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT8H17M'),
                  departure_time: Duration.fromISO('PT8H17M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT8H21M'),
                  departure_time: Duration.fromISO('PT8H22M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT8H29M'),
                  departure_time: Duration.fromISO('PT8H29M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT8H34M'),
                  departure_time: null,
                },
              ],
            },
            route901Outbound3: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT9H30M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT9H35M'),
                  departure_time: Duration.fromISO('PT9H35M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT9H42M'),
                  departure_time: Duration.fromISO('PT9H46M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT9H50M'),
                  departure_time: Duration.fromISO('PT9H51M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT9H53M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound3: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT9H55M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT10H00M'),
                  departure_time: Duration.fromISO('PT10H00M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT10H04M'),
                  departure_time: Duration.fromISO('PT10H05M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT10H12M'),
                  departure_time: Duration.fromISO('PT10H12M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT10H17M'),
                  departure_time: null,
                },
              ],
            },
          },
        },
      },
    },
    saturdaySecondVehicle: {
      day_type_id: defaultDayTypeIds.SATURDAY,
      _blocks: {
        block: {
          _vehicle_journeys: {
            route901Outbound1: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT7H15M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT7H22M'),
                  departure_time: Duration.fromISO('PT7H22M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT7H29M'),
                  departure_time: Duration.fromISO('PT7H30M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT7H34M'),
                  departure_time: Duration.fromISO('PT7H35M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT7H39M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound1: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT7H40M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT7H47M'),
                  departure_time: Duration.fromISO('PT7H47M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT7H50M'),
                  departure_time: Duration.fromISO('PT7H51M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT7H54M'),
                  departure_time: Duration.fromISO('PT7H54M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT7H58M'),
                  departure_time: null,
                },
              ],
            },
            route901Outbound2: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT8H00M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT8H07M'),
                  departure_time: Duration.fromISO('PT8H07M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT8H10M'),
                  departure_time: Duration.fromISO('PT8H11M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT8H15M'),
                  departure_time: Duration.fromISO('PT8H16M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT8H19M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound2: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT8H20M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT8H27M'),
                  departure_time: Duration.fromISO('PT8H27M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT8H31M'),
                  departure_time: Duration.fromISO('PT8H32M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT8H39M'),
                  departure_time: Duration.fromISO('PT8H39M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT8H44M'),
                  departure_time: null,
                },
              ],
            },
            route901Outbound3: {
              _journey_pattern_ref_name: 'route901outbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E001',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT9H40M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E002',
                  arrival_time: Duration.fromISO('PT9H45M'),
                  departure_time: Duration.fromISO('PT9H45M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E003',
                  arrival_time: Duration.fromISO('PT9H52M'),
                  departure_time: Duration.fromISO('PT9H56M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E004',
                  arrival_time: Duration.fromISO('PT10H00M'),
                  departure_time: Duration.fromISO('PT10H01M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: Duration.fromISO('PT10H03M'),
                  departure_time: null,
                },
              ],
            },
            route901Inbound3: {
              _journey_pattern_ref_name: 'route901inbound',
              _passing_times: [
                {
                  _scheduled_stop_point_label: 'E2E005',
                  arrival_time: null,
                  departure_time: Duration.fromISO('PT10H05M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E006',
                  arrival_time: Duration.fromISO('PT10H10M'),
                  departure_time: Duration.fromISO('PT10H10M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E007',
                  arrival_time: Duration.fromISO('PT10H14M'),
                  departure_time: Duration.fromISO('PT10H15M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E008',
                  arrival_time: Duration.fromISO('PT10H22M'),
                  departure_time: Duration.fromISO('PT10H22M'),
                },
                {
                  _scheduled_stop_point_label: 'E2E009',
                  arrival_time: Duration.fromISO('PT10H27M'),
                  departure_time: null,
                },
              ],
            },
          },
        },
      },
    },
  },
};

/**
 * This timetable base timetable data input is based on the routes and lines
 * baseDbResources introduced in ./base.ts
 *
 * This data currently (27.5.24) consists of two vehicle services with each having
 * 3 back and forth trips
 */
const baseTimetableDataInput = {
  _journey_pattern_refs: {
    route901outbound: {
      route_label: '901',
      route_direction: 'outbound',
      route_validity_start: DateTime.fromISO('2023-01-01'),
      journey_pattern_id: journeyPatterns[0].journey_pattern_id,
      _stop_points: [
        {
          scheduled_stop_point_sequence: 1,
          scheduled_stop_point_label: 'E2E001',
          timing_place_label: '1AACKT',
        },
        {
          scheduled_stop_point_sequence: 2,
          scheduled_stop_point_label: 'E2E002',
        },
        {
          scheduled_stop_point_sequence: 3,
          scheduled_stop_point_label: 'E2E003',
          timing_place_label: '1AURLA',
        },
        {
          scheduled_stop_point_sequence: 4,
          scheduled_stop_point_label: 'E2E004',
        },
        {
          scheduled_stop_point_sequence: 5,
          scheduled_stop_point_label: 'E2E005',
          timing_place_label: '1EIRA',
        },
      ],
    },
    route901inbound: {
      route_label: '901',
      route_direction: 'inbound',
      route_validity_start: DateTime.fromISO('2023-01-01'),
      journey_pattern_id: journeyPatterns[1].journey_pattern_id,
      _stop_points: [
        {
          scheduled_stop_point_sequence: 0,
          scheduled_stop_point_label: 'E2E005',
          timing_place_label: '1EIRA',
        },
        {
          scheduled_stop_point_sequence: 1,
          scheduled_stop_point_label: 'E2E006',
          timing_place_label: '1AURLA',
        },
        {
          scheduled_stop_point_sequence: 2,
          scheduled_stop_point_label: 'E2E007',
        },
        {
          scheduled_stop_point_sequence: 3,
          scheduled_stop_point_label: 'E2E008',
        },
        {
          scheduled_stop_point_sequence: 4,
          scheduled_stop_point_label: 'E2E009',
          timing_place_label: '1AACKT',
        },
      ],
    },
  },
  _vehicle_schedule_frames: {
    year2023MonFri: monFriVehicleScheduleFrame,
    year2023Sat: satVehicleScheduleFrame,
  },
};

/**
 * Returns a clone of baseTimetableDatainput for timetables datainserter
 *  so that the caller can modify the data freely without side effects
 */
export const getClonedBaseTimetableDataInput = () =>
  cloneDeep(baseTimetableDataInput);
