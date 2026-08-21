import { renderHook } from '@testing-library/react';
import cloneDeep from 'lodash/cloneDeep';
import { DateTime, Duration } from 'luxon';
import { RouteDirectionEnum } from '../../../../../../generated/graphql';
import { VehicleScheduleVehicleScheduleFrameWithJourneys } from '../useVehicleScheduleFrameWithJourneys';
import { useDuplicateJourneyDeviations } from './useDuplicateJourneyDeviations';

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

const stagingFrameWithRoutes: VehicleScheduleVehicleScheduleFrameWithJourneys =
  {
    validity_start: DateTime.fromISO('2023-07-13'),
    validity_end: DateTime.fromISO('2023-12-24'),
    vehicle_schedule_frame_id: '58634201-f971-4765-bad7-5ffb34205d25',
    vehicle_services: [
      {
        blocks: [
          {
            block_id: '0f005f33-61e7-4b83-a3e5-c5b7fd7f2107',
            vehicle_journeys: [
              {
                // Only in staging.
                journey_pattern_ref: cloneDeep(route35JourneyPatternRef),
                start_time: Duration.fromISO('PT8H30M'),
                contract_number: 'DEFAULT_CONTRACT',
                vehicle_journey_id: '5bcdf78f-b855-4e0b-9886-2456ed473069',
              },
              {
                // Exists in target as well.
                journey_pattern_ref: route35JourneyPatternRef,
                start_time: Duration.fromISO('PT10H00M'),
                contract_number: 'DEFAULT_CONTRACT',
                vehicle_journey_id: 'fbceabaa-d14f-40f2-bfb7-ff0b56947642',
              },
            ],
          },
        ],
        day_type: cloneDeep(saturdayDayType),
        vehicle_service_id: '04173bdd-be46-4db1-9e11-6f20115dea52',
      },
    ],
  };

const targetFrameWithRoutes: VehicleScheduleVehicleScheduleFrameWithJourneys = {
  validity_start: DateTime.fromISO('2023-07-13'),
  validity_end: DateTime.fromISO('2023-12-24'),
  vehicle_schedule_frame_id: '65252ff7-a699-4e6f-ad56-b086d9878bb4',
  vehicle_services: [
    {
      blocks: [
        {
          block_id: 'aa99dded-cce5-4f99-8749-eaa0b50ebff0',
          vehicle_journeys: [
            {
              // Exists in staging as well.
              journey_pattern_ref: cloneDeep(route35JourneyPatternRef),
              start_time: Duration.fromISO('PT10H00M'),
              contract_number: 'DEFAULT_CONTRACT',
              vehicle_journey_id: '267a34c5-7475-446e-b055-3f80ded19490',
            },
            {
              // Only in target.
              journey_pattern_ref: route35JourneyPatternRef,
              start_time: Duration.fromISO('PT15H30M'),
              contract_number: 'DEFAULT_CONTRACT',
              vehicle_journey_id: 'ca57b921-ce13-4715-9546-3077887dbd4d',
            },
          ],
        },
      ],
      day_type: cloneDeep(saturdayDayType),
      vehicle_service_id: '04173bdd-be46-4db1-9e11-6f20115dea52',
    },
  ],
};

describe('useDuplicateJourneyDeviations hook', () => {
  it('should return no duplicate journeys when there are no staging frames with target', async () => {
    const { result } = renderHook(() => useDuplicateJourneyDeviations([]));

    expect(result.current.duplicateJourneys).toEqual([]);
  });

  it('should return duplicate journeys between the staging and target frame', async () => {
    const { result } = renderHook(() =>
      useDuplicateJourneyDeviations([
        {
          stagingFrame: stagingFrameWithRoutes,
          targetFrame: targetFrameWithRoutes,
        },
      ]),
    );

    expect(result.current.duplicateJourneys).toEqual([
      {
        stagingJourney: {
          vehicleJourneyId: 'fbceabaa-d14f-40f2-bfb7-ff0b56947642',
          startTime: Duration.fromISO('PT10H00M'),
          contractNumber: 'DEFAULT_CONTRACT',
          validityStart: DateTime.fromISO('2023-07-13'),
          validityEnd: DateTime.fromISO('2023-12-24'),
          dayTypeLabel: 'LA',
          dayTypeName: saturdayDayType.name_i18n,
          uniqueLabel: '35',
          lineId: '9ef2a847-b026-43a6-a3a0-96055483f260',
          direction: 'inbound',
          routeName: {
            fi_FI: 'Niemenmäki-Munkkivuori-Rakuunantie',
          },
          routeId: '5522fcb4-eb98-4d82-b3ea-31f768cb4906',
        },
        targetJourney: {
          vehicleJourneyId: '267a34c5-7475-446e-b055-3f80ded19490',
          startTime: Duration.fromISO('PT10H00M'),
          contractNumber: 'DEFAULT_CONTRACT',
          validityStart: DateTime.fromISO('2023-07-13'),
          validityEnd: DateTime.fromISO('2023-12-24'),
          dayTypeLabel: 'LA',
          dayTypeName: saturdayDayType.name_i18n,
          uniqueLabel: '35',
          lineId: '9ef2a847-b026-43a6-a3a0-96055483f260',
          direction: 'inbound',
          routeName: {
            fi_FI: 'Niemenmäki-Munkkivuori-Rakuunantie',
          },
          routeId: '5522fcb4-eb98-4d82-b3ea-31f768cb4906',
        },
      },
    ]);
  });
});
