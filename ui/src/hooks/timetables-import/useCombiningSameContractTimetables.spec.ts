import { renderHook } from '@testing-library/react';
import cloneDeep from 'lodash/cloneDeep';
import { DateTime, Duration } from 'luxon';
import {
  RouteDirectionEnum,
  VehicleJourneyWithPatternAndRouteFragmentFragment,
} from '../../generated/graphql';
import { VehicleScheduleVehicleScheduleFrameWithJourneys } from './deviations';
import { useCombiningSameContractTimetables } from './useCombiningSameContractTimetables';

const route35JourneyPatternRef = {
  journey_pattern_instance: {
    journey_pattern_id: '109f2f65-ff74-4a72-a16b-998420913747',
    journey_pattern_route: {
      direction: RouteDirectionEnum.Inbound,
      name_i18n: {
        fi_FI: 'Niemenmäki-Munkkivuori-Rakuunantie',
      },
      route_id: '5522fcb4-eb98-4d82-b3ea-31f768cb4906',
      route_line: {
        line_id: '9ef2a847-b026-43a6-a3a0-96055483f260',
      },
      unique_label: '35',
      variant: null,
    },
  },
  journey_pattern_ref_id: '3686117b-81e9-4f53-97c4-1c40db8b05f4',
};

const saturdayDayType = {
  day_type_id: '61374d2b-5cce-4a7d-b63a-d487f3a05e0d',
  label: 'LA',
  name_i18n: {
    en_US: 'Saturday',
    fi_FI: 'Lauantai',
    sv_FI: 'Lördag',
  },
};

const buildVehicleJourney = (
  input: Partial<VehicleJourneyWithPatternAndRouteFragmentFragment>,
): VehicleJourneyWithPatternAndRouteFragmentFragment => {
  return {
    journey_pattern_ref: route35JourneyPatternRef,
    start_time: Duration.fromISO('PT12H00M'),
    contract_number: 'DEFAULT_CONTRACT',
    vehicle_journey_id: 'ca57b921-ce13-4715-9546-3077887dbd4d',
    ...input,
  };
};

const buildSingleBlockFrameWithJourneys = (
  journeys: ReadonlyArray<VehicleJourneyWithPatternAndRouteFragmentFragment>,
): VehicleScheduleVehicleScheduleFrameWithJourneys => {
  return {
    validity_start: DateTime.fromISO('2023-07-13'),
    validity_end: DateTime.fromISO('2023-12-24'),
    vehicle_schedule_frame_id: '58634201-f971-4765-bad7-5ffb34205d25',
    vehicle_services: [
      {
        blocks: [
          {
            block_id: '0f005f33-61e7-4b83-a3e5-c5b7fd7f2107',
            vehicle_journeys: journeys,
          },
        ],
        day_type: cloneDeep(saturdayDayType),
        vehicle_service_id: '04173bdd-be46-4db1-9e11-6f20115dea52',
      },
    ],
  };
};

describe('useCombiningSameContractTimetables hook', () => {
  it('should return false when called with an empty array', async () => {
    const { result } = renderHook(() => useCombiningSameContractTimetables([]));

    expect(result.current.combiningSameContractTimetables).toEqual(false);
  });

  it('should return false when there are no same contract numbers between staging and target frames in given input', () => {
    const { result } = renderHook(() =>
      useCombiningSameContractTimetables([
        {
          stagingFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '111' }),
          ]),
          targetFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '222' }),
          ]),
        },
      ]),
    );

    expect(result.current.combiningSameContractTimetables).toEqual(false);
  });

  it('should return false when there is same contract number in given input, bot not for any staging and target pair', () => {
    const { result } = renderHook(() =>
      useCombiningSameContractTimetables([
        {
          stagingFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '111' }),
          ]),
          targetFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '222' }),
          ]),
        },

        {
          stagingFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '222' }),
          ]),
          targetFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '111' }),
          ]),
        },
      ]),
    );

    expect(result.current.combiningSameContractTimetables).toEqual(false);
  });

  it('should return true when there is same contract number in all journeys of staging and target frame pair', () => {
    const { result } = renderHook(() =>
      useCombiningSameContractTimetables([
        {
          stagingFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '111' }),
          ]),
          targetFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '111' }),
          ]),
        },
      ]),
    );

    expect(result.current.combiningSameContractTimetables).toEqual(true);
  });

  it('should return true when there is same contract number in only some journeys of staging and target frame pair', () => {
    const { result } = renderHook(() =>
      useCombiningSameContractTimetables([
        {
          stagingFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '11' }),
            buildVehicleJourney({ contract_number: '2222' }),
            buildVehicleJourney({ contract_number: '33' }),
          ]),
          targetFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '2222' }),
            buildVehicleJourney({ contract_number: '44' }),
            buildVehicleJourney({ contract_number: '66' }),
          ]),
        },
      ]),
    );

    expect(result.current.combiningSameContractTimetables).toEqual(true);
  });

  it('should return true when there are some staging and target pairs with same contract number and some without', () => {
    const { result } = renderHook(() =>
      useCombiningSameContractTimetables([
        {
          stagingFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '111' }),
          ]),
          targetFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '222' }),
          ]),
        },

        {
          stagingFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '333' }),
          ]),
          targetFrame: buildSingleBlockFrameWithJourneys([
            buildVehicleJourney({ contract_number: '333' }),
          ]),
        },
      ]),
    );

    expect(result.current.combiningSameContractTimetables).toEqual(true);
  });
});
