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
  ) => {
    return (
      // In addition, validity start and day type should be identical,
      // but we assume here that this method is only called for inputs where they are:
      // backend checks this when fetching the target frame.
      journeyA.routeId === journeyB.routeId && // Check that route and direction are same.
      journeyA.startTime.equals(journeyB.startTime)
    );
  };

  const findDuplicateJourneys = useCallback(
    (
      stagingAndTargetFrames: Array<{
        stagingFrameJourneys: VehicleJourneyInfo[];
        targetFrameJourneys: VehicleJourneyInfo[];
      }>,
    ): VehicleJourneyDuplicate[] => {
      const allJourneyCombinations = stagingAndTargetFrames
        .map(({ stagingFrameJourneys, targetFrameJourneys }) => {
          return stagingFrameJourneys.map((stagingJourney) => {
            return targetFrameJourneys.map((targetJourney) => {
              return { stagingJourney, targetJourney };
            });
          });
        })
        .flat()
        .flat();

      return allJourneyCombinations.filter(
        ({ stagingJourney, targetJourney }) =>
          journeysAreEqual(stagingJourney, targetJourney),
      );
    },
    [],
  );
  return { findDuplicateJourneys };
};
