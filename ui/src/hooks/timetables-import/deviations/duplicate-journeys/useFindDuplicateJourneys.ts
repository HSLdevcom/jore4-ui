import { useCallback } from 'react';
import { VehicleJourneyInfo } from './useCreateVehicleJourneyInfo';

export type VehicleJourneyDuplicate = {
  stagingJourney: VehicleJourneyInfo;
  targetJourney: VehicleJourneyInfo;
};

export const useFindDuplicateJourneys = () => {
  const journeysAreEqual = (
    journeyA: VehicleJourneyInfo,
    journeyB: VehicleJourneyInfo,
  ) =>
    // In addition, validity start and day type should be identical,
    // but we assume here that this method is only called for inputs where they are:
    // backend checks this when fetching the target frame.
    journeyA.routeId === journeyB.routeId && // Check that route and direction (due to being same route) are same.
    journeyA.startTime.equals(journeyB.startTime) &&
    journeyA.contractNumber === journeyB.contractNumber;

  const findDuplicateJourneys = useCallback(
    ({
      stagingFrameJourneys,
      targetFrameJourneys,
    }: {
      stagingFrameJourneys: ReadonlyArray<VehicleJourneyInfo>;
      targetFrameJourneys: ReadonlyArray<VehicleJourneyInfo>;
    }): VehicleJourneyDuplicate[] => {
      const allJourneyCombinations = stagingFrameJourneys.flatMap(
        (stagingJourney) => {
          return targetFrameJourneys.map((targetJourney) => {
            return { stagingJourney, targetJourney };
          });
        },
      );

      return allJourneyCombinations.filter(
        ({ stagingJourney, targetJourney }) =>
          journeysAreEqual(stagingJourney, targetJourney),
      );
    },
    [],
  );
  return { findDuplicateJourneys };
};
