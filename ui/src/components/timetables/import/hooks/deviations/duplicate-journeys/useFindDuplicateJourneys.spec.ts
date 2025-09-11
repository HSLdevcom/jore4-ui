import { renderHook } from '@testing-library/react';
import cloneDeep from 'lodash/cloneDeep';
import { DateTime, Duration } from 'luxon';
import { RouteDirectionEnum } from '../../../../../../generated/graphql';
import { VehicleJourneyInfo } from './useCreateVehicleJourneyInfo';
import { useFindDuplicateJourneys } from './useFindDuplicateJourneys';

const baseVehicleJourneyInfo: VehicleJourneyInfo = {
  vehicleJourneyId: 'c9107f53-5199-43b0-96c4-e05738fdc7a2',
  startTime: Duration.fromISO('PT8H30M'),
  contractNumber: 'DEFAULT_CONTRACT',
  validityStart: DateTime.fromISO('2023-01-01'),
  validityEnd: DateTime.fromISO('2023-12-31'),
  dayTypeLabel: 'LA',
  dayTypeName: {
    fi_FI: 'Lauantai',
    sv_FI: 'Lördag',
  },
  uniqueLabel: '123',
  lineId: 'cf298c9f-f67d-4890-9c33-6b576eb0af47',
  direction: RouteDirectionEnum.Outbound,
  routeName: {
    fi_FI: 'Hervanta - Keskustori',
  },
  routeId: '1da483b6-52a3-4900-87c2-3889004b8dba',
};

describe('useFindDuplicateJourneys hook', () => {
  it('should return a duplicate journey', () => {
    const { result } = renderHook(() => useFindDuplicateJourneys());
    const stagingJourney1 = cloneDeep(baseVehicleJourneyInfo);
    const targetJourney1 = cloneDeep(baseVehicleJourneyInfo);

    const duplicateJourneys = result.current.findDuplicateJourneys({
      stagingFrameJourneys: [stagingJourney1],
      targetFrameJourneys: [targetJourney1],
    });

    expect(duplicateJourneys).toEqual([
      {
        stagingJourney: stagingJourney1,
        targetJourney: targetJourney1,
      },
    ]);
  });

  it('should not return a journey with different route', () => {
    const { result } = renderHook(() => useFindDuplicateJourneys());
    const stagingJourney1 = cloneDeep(baseVehicleJourneyInfo);
    const targetJourney1 = {
      ...cloneDeep(baseVehicleJourneyInfo),
      routeId: '80edbf66-9fb6-43d7-bc4a-2223c0959f3c',
    };

    const duplicateJourneys = result.current.findDuplicateJourneys({
      stagingFrameJourneys: [stagingJourney1],
      targetFrameJourneys: [targetJourney1],
    });

    expect(duplicateJourneys).toEqual([]);
  });

  it('should not return a journey with different start time', () => {
    const { result } = renderHook(() => useFindDuplicateJourneys());
    const stagingJourney1 = cloneDeep(baseVehicleJourneyInfo);
    const targetJourney1 = {
      ...cloneDeep(baseVehicleJourneyInfo),
      startTime: Duration.fromISO('PT9H15M'),
    };

    const duplicateJourneys = result.current.findDuplicateJourneys({
      stagingFrameJourneys: [stagingJourney1],
      targetFrameJourneys: [targetJourney1],
    });

    expect(duplicateJourneys).toEqual([]);
  });

  it('should not return a journey with different contract number', () => {
    const { result } = renderHook(() => useFindDuplicateJourneys());
    const stagingJourney1 = cloneDeep(baseVehicleJourneyInfo);
    const targetJourney1 = {
      ...cloneDeep(baseVehicleJourneyInfo),
      contractNumber: 'SOME OTHER CONTRACT',
    };

    const duplicateJourneys = result.current.findDuplicateJourneys({
      stagingFrameJourneys: [stagingJourney1],
      targetFrameJourneys: [targetJourney1],
    });

    expect(duplicateJourneys).toEqual([]);
  });

  it('should return multiple duplicates correctly', () => {
    const { result } = renderHook(() => useFindDuplicateJourneys());
    const stagingJourney1 = {
      ...cloneDeep(baseVehicleJourneyInfo),
      routeId: 'aaaaaaaa-9a3d-4b63-b856-c62ad3df1d92',
    };
    const stagingJourney2 = {
      ...cloneDeep(baseVehicleJourneyInfo),
      routeId: 'bbbbbbbb-4e45-4112-989b-52e683acc03b',
    };
    const stagingJourney3 = {
      ...cloneDeep(baseVehicleJourneyInfo),
      routeId: 'cccccccc-507d-4594-846a-57a71e14eaf3',
    };
    const targetJourney1 = {
      // Has no duplicate staging journey.
      ...cloneDeep(baseVehicleJourneyInfo),
      routeId: 'dddddddd-28eb-44a2-b9b0-627204a50d36',
    };
    const targetJourney2 = cloneDeep(stagingJourney1);
    const targetJourney3 = cloneDeep(stagingJourney2);

    const duplicateJourneys = result.current.findDuplicateJourneys({
      stagingFrameJourneys: [stagingJourney1, stagingJourney2, stagingJourney3],
      targetFrameJourneys: [targetJourney1, targetJourney2, targetJourney3],
    });

    expect(duplicateJourneys).toEqual([
      { stagingJourney: stagingJourney1, targetJourney: targetJourney2 },
      { stagingJourney: stagingJourney2, targetJourney: targetJourney3 },
    ]);
  });
});
