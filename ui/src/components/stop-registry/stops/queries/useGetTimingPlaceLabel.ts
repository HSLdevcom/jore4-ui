import { useMemo } from 'react';
import { useGetSelectedTimingPlaceDetailsByIdQuery } from '../../../../generated/graphql';

export function useGetTimingPlaceLabel(
  timingPlaceId: string | null | undefined,
) {
  const { data, ...rest } = useGetSelectedTimingPlaceDetailsByIdQuery({
    variables: { timing_place_id: timingPlaceId ?? '' },
    skip: !timingPlaceId,
    fetchPolicy: 'cache-first',
  });

  const timingPlaceLabel = useMemo(
    () => data?.timing_pattern_timing_place_by_pk?.label ?? null,
    [data],
  );

  return { timingPlaceLabel, ...rest };
}
