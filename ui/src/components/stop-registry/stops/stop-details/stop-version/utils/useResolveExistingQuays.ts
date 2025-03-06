import { gql } from '@apollo/client';
import { useCallback } from 'react';
import {
  StopRegistryQuayInput,
  useResolveExistingQuaysLazyQuery,
} from '../../../../../../generated/graphql';

const GQL_RESOLVE_EXISTING_QUAYS = gql`
  query ResolveExistingQuays($stopPlaceId: String!) {
    stops_database {
      quays: stops_database_quay_newest_version(
        where: { stop_place: { netex_id: { _eq: $stopPlaceId } } }
      ) {
        id
        netex_id
      }
    }
  }
`;

export type ExistingQuayInput = Pick<StopRegistryQuayInput, 'id'>;

export function useResolveExistingQuays() {
  const [resolveExistingQuaysLazyQuery] = useResolveExistingQuaysLazyQuery();

  return useCallback(
    async (stopPlaceId: string): Promise<ReadonlyArray<ExistingQuayInput>> => {
      const { data } = await resolveExistingQuaysLazyQuery({
        variables: { stopPlaceId },
      });
      const rawQuays = data?.stops_database?.quays ?? [];
      return rawQuays.map((rawQuay) => {
        if (!rawQuay.netex_id) {
          throw new Error(
            `Quay (${rawQuay.id}) assoaciated with StopPlace ${stopPlaceId} is missing a Netex ID!`,
          );
        }

        return { id: rawQuay.netex_id };
      });
    },
    [resolveExistingQuaysLazyQuery],
  );
}
