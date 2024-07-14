import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useGetStopAreaByIdLazyQuery } from '../../../generated/graphql';

const GQL_GET_STOP_AREA_BY_ID = gql`
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
      id
      name {
        value
        lang
      }
      geometry {
        coordinates
        type
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

export const useGetStopAreaById = () => {
  const [getStopAreaByIdQuery] = useGetStopAreaByIdLazyQuery();

  const getStopAreaById = useCallback(
    async (stopAreaId: UUID) => {
      const stopAreaResult = await getStopAreaByIdQuery({
        variables: { stopAreaId },
      });
      return (
        stopAreaResult.data?.stop_registry?.groupOfStopPlaces?.[0] ?? undefined
      );
    },
    [getStopAreaByIdQuery],
  );

  return {
    getStopAreaById,
  };
};
