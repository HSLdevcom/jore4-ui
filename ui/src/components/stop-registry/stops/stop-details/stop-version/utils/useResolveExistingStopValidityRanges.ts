import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useResolveExistingStopValidityRangesQuery } from '../../../../../../generated/graphql';
import { ExistingStopValidityRange } from '../types';

const GQL_RESOLVE_EXISTING_VALIDITY_RANGES_QUERY = gql`
  query ResolveExistingStopValidityRanges($stopPlaceId: String!, $today: date) {
    stopPoints: service_pattern_scheduled_stop_point(
      where: {
        stop_place_ref: { _eq: $stopPlaceId }
        # List current and future ranges.
        # Inserts into past are not valid.
        _or: [
          { validity_end: { _is_null: true } }
          { validity_end: { _gte: $today } }
        ]
      }
      order_by: [{ validity_start: asc }]
    ) {
      scheduled_stop_point_id
      priority
      validity_start
      validity_end
    }
  }
`;

const emptyResult: ReadonlyArray<ExistingStopValidityRange> = [];

export function useResolveExistingStopValidityRanges({
  stopPlaceId,
  skip,
}: {
  readonly stopPlaceId: string | null | undefined;
  readonly skip: boolean;
}) {
  const today = useMemo(() => DateTime.now().startOf('day'), []);

  const { data, ...rest } = useResolveExistingStopValidityRangesQuery(
    stopPlaceId
      ? {
          variables: { stopPlaceId, today },
          fetchPolicy: 'network-only',
          skip,
        }
      : { skip: true },
  );

  const ranges: ReadonlyArray<ExistingStopValidityRange> =
    data?.stopPoints ?? emptyResult;

  return { ...rest, ranges };
}
