import { useCallback } from 'react';
import { VehicleScheduleFrameInfo } from '../useCreateVehicleScheduleFrameInfo';

export const useFindOrphanRoutes = () => {
  const routesAreEqual = (
    routeA: VehicleScheduleFrameInfo,
    routeB: VehicleScheduleFrameInfo,
  ) => {
    return (
      routeA.uniqueLabel === routeB.uniqueLabel &&
      routeA.routeId === routeB.routeId
    );
  };

  const findOrphanRoutes = useCallback(
    ({
      toReplaceRoutes,
      stagingRoutes,
    }: {
      toReplaceRoutes: ReadonlyArray<VehicleScheduleFrameInfo>;
      stagingRoutes: ReadonlyArray<VehicleScheduleFrameInfo>;
    }) => {
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
