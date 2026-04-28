import { gql, useFragment } from '@apollo/client';
import {
  HistoricalTerminalDetailsFragment,
  HistoricalTerminalDetailsFragmentDoc,
  StopPlaceChangeHistoryItem,
  useGetHistoricalTerminalDetailsQuery,
} from '../../../../../generated/graphql';

const GQL_GET_HISTORICAL_TERMINAL_DETAILS = gql`
  query GetHistoricalTerminalDetails($id: String!, $version: Int!) {
    stopsRegistry: stop_registry {
      stopPlace(id: $id, version: $version) {
        ...HistoricalTerminalDetails
      }
    }
  }

  fragment HistoricalTerminalDetails on stop_registry_ParentStopPlace {
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

    description {
      lang
      value
    }

    privateCode {
      value
      type
    }

    geometry {
      type
      coordinates
    }

    keyValues {
      key
      values
    }

    topographicPlace {
      id
      version
      name {
        value
      }
    }

    children {
      id
      version
      privateCode {
        value
      }
      name {
        value
      }
      quays {
        id
        version
        publicCode
      }
    }

    infoSpots {
      ...info_spot_details
    }

    organisations {
      organisationRef
      relationshipType
      organisation {
        ...stop_place_organisation_fields
      }
    }

    externalLinks {
      stopPlaceId
      orderNum
      name
      location
    }
  }
`;

export function useGetHistoricalTerminalDetails({
  netexId: id,
  version,
}: StopPlaceChangeHistoryItem) {
  // Grab data from cache, if it is there
  const { data, complete } = useFragment<HistoricalTerminalDetailsFragment>({
    fragment: HistoricalTerminalDetailsFragmentDoc,
    fragmentName: 'HistoricalTerminalDetails',
    from: { __typename: 'stop_registry_ParentStopPlace', id, version },
  });

  // If not in cache, run a query that will then populate it into the cache.
  const { loading, error, refetch } = useGetHistoricalTerminalDetailsQuery({
    variables: { id, version: Number(version) },
    skip: complete,
  });

  if (complete) {
    return {
      data: data as HistoricalTerminalDetailsFragment,
      error: null,
      loading: false,
      refetch,
    };
  }

  return { data: null, error, refetch, loading };
}
