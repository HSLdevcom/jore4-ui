import { useCallback } from 'react';
import { VehicleScheduleFrameInfo } from './useVehicleScheduleFramesToVehicleScheduleFrameInfo';

export const useFindOrpanRoutes = () => {
  const routesAreEqual = (
    routeA: VehicleScheduleFrameInfo,
    routeB: VehicleScheduleFrameInfo,
  ) => {
    return routeA.label === routeB.label && routeA.routeId === routeB.routeId;
  };

  const findOrphanRoutes = useCallback(
    (
      toReplaceRoutes: VehicleScheduleFrameInfo[],
      stagingRoutes: VehicleScheduleFrameInfo[],
    ) => {
      const orphans = toReplaceRoutes.filter((toBeReplacedRoute) => {
        return !stagingRoutes.some((stagingRoute) =>
          routesAreEqual(stagingRoute, toBeReplacedRoute),
        );
      });

      return orphans;
    },
    [],
  );
  return { findOrphanRoutes };
};
