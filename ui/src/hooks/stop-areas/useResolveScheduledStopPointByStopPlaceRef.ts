import { useCallback } from 'react';
import { useGetScheduledStopPointByStopPlaceRefLazyQuery } from '../../generated/graphql';
import { StopWithLocation } from '../../graphql';
import { Operation } from '../../redux';
import { useLoader } from '../ui';

type ResolveScheduledStopPointByStopPlaceRefFn = (
  stopPlaceRef: string,
) => Promise<StopWithLocation>;

export function useResolveScheduledStopPointByStopPlaceRef() {
  const [getScheduledStopPointByStopPlaceRef] =
    useGetScheduledStopPointByStopPlaceRefLazyQuery();
  const { setIsLoading } = useLoader(Operation.ResolveScheduledStopPoint);

  return useCallback<ResolveScheduledStopPointByStopPlaceRefFn>(
    async (stopPlaceRef) => {
      setIsLoading(true);

      try {
        const result = await getScheduledStopPointByStopPlaceRef({
          variables: {
            stopPlaceRef,
          },
        });
        const stop = result.data?.service_pattern_scheduled_stop_point.at(0);

        if (!stop) {
          throw new Error(
            `No scheduled stop found with stopPlaceRef(${stopPlaceRef})`,
          );
        }

        return stop as StopWithLocation;
      } finally {
        setIsLoading(false);
      }
    },
    [getScheduledStopPointByStopPlaceRef, setIsLoading],
  );
}
