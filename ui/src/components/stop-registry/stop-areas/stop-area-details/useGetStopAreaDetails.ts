import { gql } from '@apollo/client';
import {
  StopAreaDetailsFragment,
  useGetStopAreaDetailsQuery,
} from '../../../../generated/graphql';

const GQL_GET_STOP_AREA_DETAILS = gql`
  query getStopAreaDetails($id: String!) {
    stop_registry {
      groupOfStopPlaces(id: $id) {
        ...StopAreaDetails
      }
    }
  }

  fragment StopAreaDetails on stop_registry_GroupOfStopPlaces {
    id

    geometry {
      type
      coordinates
    }

    description {
      lang
      value
    }

    name {
      lang
      value
    }

    validBetween {
      fromDate
      toDate
    }

    members {
      ...StopAreaDetailsMembers
    }
  }

  fragment StopAreaDetailsMembers on stop_registry_StopPlace {
    id

    name {
      lang
      value
    }

    scheduled_stop_point {
      ...stop_table_row
    }
  }
`;

export function useGetStopAreaDetails(id: string) {
  const { data, ...rest } = useGetStopAreaDetailsQuery({ variables: { id } });
  const area: StopAreaDetailsFragment | null =
    data?.stop_registry?.groupOfStopPlaces?.at(0) ?? null;
  return { ...rest, area };
}
