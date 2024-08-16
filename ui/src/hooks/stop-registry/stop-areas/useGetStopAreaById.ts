import { gql } from '@apollo/client';
import { useCallback } from 'react';
import {
  StopAreaFormFieldsFragment,
  StopAreaMemberFieldsFragment,
  useGetStopAreaByIdLazyQuery,
} from '../../../generated/graphql';
import { getStopPlacesFromQueryResult } from '../../../utils';

const GQL_GET_STOP_AREA_BY_ID = gql`
  fragment stop_area_member_fields on stop_registry_StopPlace {
    id
    name {
      value
      lang
    }
    geometry {
      coordinates
      type
    }
    scheduled_stop_point {
      scheduled_stop_point_id
      label
    }
  }

  fragment stop_area_form_fields on stop_registry_GroupOfStopPlaces {
    id
    name {
      lang
      value
    }
    description {
      lang
      value
    }
    geometry {
      coordinates
      type
    }
    validBetween {
      fromDate
      toDate
    }
    members {
      ... on stop_registry_StopPlace {
        ...stop_area_member_fields
      }
    }
  }

  query GetStopAreaById($stopAreaId: String!) {
    stop_registry {
      groupOfStopPlaces(id: $stopAreaId) {
        ...stop_area_form_fields
      }
    }
  }
`;

export type StopAreaByIdResult = Omit<StopAreaFormFieldsFragment, 'members'> & {
  members: Array<StopAreaMemberFieldsFragment> | undefined;
};

export const useGetStopAreaById = () => {
  const [getStopAreaByIdQuery] = useGetStopAreaByIdLazyQuery();

  const getStopAreaById = useCallback(
    async (stopAreaId: UUID): Promise<StopAreaByIdResult | undefined> => {
      const stopAreaResult = await getStopAreaByIdQuery({
        variables: { stopAreaId },
      });
      const stopArea =
        stopAreaResult.data?.stop_registry?.groupOfStopPlaces?.[0] ?? undefined;
      if (!stopArea) {
        return stopArea;
      }

      const members = getStopPlacesFromQueryResult(stopArea.members);
      return {
        ...stopArea,
        members,
      };
    },
    [getStopAreaByIdQuery],
  );

  return {
    getStopAreaById,
  };
};
