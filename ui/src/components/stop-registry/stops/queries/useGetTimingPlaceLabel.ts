import { useGetSelectedTimingPlaceDetailsByIdQuery } from '../../../../generated/graphql';

export function useGetTimingPlaceLabel(
  timingPlaceId: string | null | undefined,
) {
  const { data, ...rest } = useGetSelectedTimingPlaceDetailsByIdQuery({
    variables: { timing_place_id: timingPlaceId ?? '' },
    skip: !timingPlaceId,
    fetchPolicy: 'cache-first',
  });

  return {
    ...rest,
    timingPlaceLabel: data?.timing_pattern_timing_place_by_pk?.label ?? null,
  };
}
