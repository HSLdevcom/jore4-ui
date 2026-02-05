import { gql, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import {
  DetailsForHistoricalStopVersionFragment,
  DetailsForHistoricalStopVersionFragmentDoc,
  GetVersionedStopPlaceAndQuaysDocument,
  GetVersionedStopPlaceAndQuaysQuery,
  GetVersionedStopPlaceAndQuaysQueryVariables,
} from '../../../../../generated/graphql';
import { FailedToFetchHistoricalStopPlaceError } from '../errors/FailedToFetchHistoricalStopPlaceError';
import { StopPlaceVersionSpecifier } from '../types';
import { identifyVersionedStopPlace } from '../utils';

const GQL_GET_VERSIONED_STOP_PLACE_AND_QUAYS = gql`
  query GetVersionedStopPlaceAndQuays(
    $stopPlaceNetexId: String!
    $stopPlaceVersion: Int!
  ) {
    stopRegistry: stop_registry {
      stopPlace(
        id: $stopPlaceNetexId
        version: $stopPlaceVersion
        onlyMonomodalStopPlaces: true
      ) {
        ...DetailsForHistoricalStopVersion
      }
    }
  }

  fragment DetailsForHistoricalStopVersion on stop_registry_StopPlace {
    ...stop_place_details
    quays {
      ...quay_details
    }
  }
`;
export function useGetHistoricalStopPlace() {
  const apolloClient = useApolloClient();
  return useCallback(
    async (
      version: StopPlaceVersionSpecifier,
    ): Promise<DetailsForHistoricalStopVersionFragment> => {
      // Check the cache for the requested StopPlace.
      // Usually we should have at least one StopPlace already cached-in,
      // as we likely arrived on the history site through a StopDetails page.
      const cachedData =
        apolloClient.readFragment<DetailsForHistoricalStopVersionFragment>({
          fragmentName: 'DetailsForHistoricalStopVersion',
          fragment: DetailsForHistoricalStopVersionFragmentDoc,
          id: apolloClient.cache.identify({
            __typename: 'stop_registry_StopPlace',
            id: version.stopPlaceNetexId,
            version: version.stopPlaceVersion,
          }),
        });

      if (cachedData) {
        return cachedData;
      }

      // If specified version was not already cached-in, request it from the
      // database.
      const result = await apolloClient.query<
        GetVersionedStopPlaceAndQuaysQuery,
        GetVersionedStopPlaceAndQuaysQueryVariables
      >({
        query: GetVersionedStopPlaceAndQuaysDocument,
        variables: {
          stopPlaceNetexId: version.stopPlaceNetexId,
          stopPlaceVersion: Number(version.stopPlaceVersion),
        },
      });

      if (result.error) {
        throw new FailedToFetchHistoricalStopPlaceError(
          `Failed to fetch historical StopPlace(${identifyVersionedStopPlace(version)})! Apollo query returned an error!`,
          { data: result.data, cause: result.error },
        );
      }

      const fetchedData = result.data.stopRegistry?.stopPlace
        ?.filter(
          (it): it is DetailsForHistoricalStopVersionFragment =>
            it !== null &&
            // eslint-disable-next-line no-underscore-dangle
            it.__typename === 'stop_registry_StopPlace' &&
            it.id === version.stopPlaceNetexId &&
            it.version === version.stopPlaceVersion,
        )
        .at(0);

      if (fetchedData) {
        return fetchedData;
      }

      throw new FailedToFetchHistoricalStopPlaceError(
        `Failed to fetch historical StopPlace(${identifyVersionedStopPlace(version)})! Requested StopPlace was not found from the response`,
        { data: result.data },
      );
    },
    [apolloClient],
  );
}
