import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  ParentStopPlaceDetailsFragment,
  useGetTerminalDetailsByNetexIdQuery,
} from '../../../generated/graphql';
import { getParentStopPlacesFromQueryResult } from '../../../utils';
import { getEnrichedParentStopPlace } from '../../stop-registry/Terminals/Common/useGetTerminalDetails';

const GQL_GET_TERMINAL_DETAILS_BY_NETEX_ID = gql`
  query GetTerminalDetailsByNetexId($netexId: String!) {
    stop_registry {
      stopPlace(id: $netexId) {
        ...ParentStopPlaceDetails
      }
    }
  }
`;

export function useGetTerminalDetails(netexId: string | null | undefined) {
  const { data, ...rest } = useGetTerminalDetailsByNetexIdQuery(
    netexId ? { variables: { netexId } } : { skip: true },
  );
  const rawTerminals = data?.stop_registry?.stopPlace;
  const terminal = useMemo(
    () =>
      getEnrichedParentStopPlace(
        getParentStopPlacesFromQueryResult<ParentStopPlaceDetailsFragment>(
          rawTerminals,
        ).at(0),
      ),
    [rawTerminals],
  );

  return { ...rest, terminal };
}
