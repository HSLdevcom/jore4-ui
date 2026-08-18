import { useCallback } from 'react';
import { VehicleScheduleFrameInfo } from '../useCreateVehicleScheduleFrameInfo';

export function useFindOrphanRoutes() {
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
    }) =>
      toReplaceRoutes.filter(
        (toBeReplacedRoute) =>
          !stagingRoutes.some((stagingRoute) =>
            routesAreEqual(stagingRoute, toBeReplacedRoute),
          ),
      ),
    [],
  );
  return { findOrphanRoutes };
}
