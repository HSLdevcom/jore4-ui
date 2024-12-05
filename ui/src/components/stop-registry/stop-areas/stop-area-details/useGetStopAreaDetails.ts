import { gql } from '@apollo/client';
import {
  StopAreaDetailsFragment,
  StopAreaDetailsMembersFragment,
  StopAreaGroupMembersFragment,
  useGetStopAreaDetailsQuery,
} from '../../../../generated/graphql';

const GQL_GET_STOP_AREA_DETAILS = gql`
  query getStopAreaDetails($id: String!) {
    stop_registry {
      groupOfStopPlaces(id: $id) {
        ...StopAreaDetails
      }
      stopPlace(id: $id) {
        ...StopAreaGroupMembers
      }
    }
  }

  fragment StopAreaGroupMembers on stop_registry_StopPlace {
    groups {
      members {
        ... on stop_registry_StopPlace {
          id
          organisations {
            organisationRef
            relationshipType
          }
        }
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

    ... on stop_registry_StopPlace {
      id
      organisations {
        organisationRef
        relationshipType
      }
    }
  }
`;

export function useGetStopAreaDetails(id: string) {
  const { data, ...rest } = useGetStopAreaDetailsQuery({ variables: { id } });
  const area: StopAreaDetailsFragment | null =
    data?.stop_registry?.groupOfStopPlaces?.at(0) ?? null;
  return { ...rest, area };
}

export function useGetStopAreaMemberStops(id: string) {
  const { data, ...rest } = useGetStopAreaDetailsQuery({ variables: { id } });

  const stopAreaGroupMembers = (data?.stop_registry?.stopPlace ??
    []) as StopAreaGroupMembersFragment[];

  const members = (stopAreaGroupMembers?.[0]?.groups?.[0]?.members ??
    []) as StopAreaDetailsMembersFragment[];

  return { ...rest, members };
}
