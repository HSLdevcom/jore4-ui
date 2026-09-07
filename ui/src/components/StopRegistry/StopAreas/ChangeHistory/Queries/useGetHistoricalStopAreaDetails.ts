import { gql, useFragment } from '@apollo/client';
import {
  HistoricalStopAreaDetailsFragment,
  HistoricalStopAreaDetailsFragmentDoc,
  StopPlaceChangeHistoryItem,
  useGetHistoricalStopAreaDetailsQuery,
} from '../../../../../generated/graphql';

const GQL_GET_HISTORICAL_STOP_AREA_DETAILS = gql`
  query GetHistoricalStopAreaDetails($id: String!, $version: Int!) {
    stopsRegistry: stop_registry {
      stopPlace(id: $id, version: $version, onlyMonomodalStopPlaces: true) {
        ...HistoricalStopAreaDetails
      }
    }
  }

  fragment HistoricalStopAreaDetails on stop_registry_StopPlace {
    id
    version

    name {
      lang
      value
    }
    alternativeNames {
      name {
        lang
        value
      }
      nameType
    }

    privateCode {
      value
      type
    }

    geometry {
      type
      coordinates
    }

    transportMode

    keyValues {
      key
      values
    }

    quays {
      ...HistoricalStopAreaQuayDetails
    }

    parentStopPlace {
      ...HistoricalStopAreaTerminalDetails
    }
  }

  fragment HistoricalStopAreaQuayDetails on stop_registry_Quay {
    id
    version
    publicCode
  }

  fragment HistoricalStopAreaTerminalDetails on stop_registry_ParentStopPlace {
    id
    version

    name {
      lang
      value
    }

    privateCode {
      value
      type
    }
  }
`;

export function useGetHistoricalStopAreaDetails({
  netexId: id,
  version,
}: StopPlaceChangeHistoryItem) {
  // Grab data from cache, if it is there
  const { data, complete } = useFragment<HistoricalStopAreaDetailsFragment>({
    fragment: HistoricalStopAreaDetailsFragmentDoc,
    fragmentName: 'HistoricalStopAreaDetails',
    from: { __typename: 'stop_registry_StopPlace', id, version },
  });

  // If not in cache, run a query that will then populate it into the cache.
  const { loading, error, refetch } = useGetHistoricalStopAreaDetailsQuery({
    variables: { id, version: Number(version) },
    skip: complete,
  });

  if (complete) {
    return {
      data: data as HistoricalStopAreaDetailsFragment,
      error: null,
      loading: false,
      refetch,
    };
  }

  return { data: null, error, refetch, loading };
}
