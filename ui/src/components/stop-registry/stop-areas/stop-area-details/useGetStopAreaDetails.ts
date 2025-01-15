import { gql } from '@apollo/client';
import {
  StopAreaDetailsFragment,
  useGetStopAreaDetailsQuery,
} from '../../../../generated/graphql';

/* Turha file? */ 

const GQL_GET_STOP_AREA_DETAILS = gql`
  query getStopAreaDetails($id: String!) {
    stop_registry {
      stopPlace(id: $id) {
        ...StopAreaDetails
      }
    }
  }

  fragment StopAreaDetails on stop_registry_StopPlace {
    id

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

    name {
      lang
      value
    }

    organisations {
      relationshipType
      organisationRef
      organisation {
        ...stop_place_organisation_fields
      }
    }

    geometry {
      type
      coordinates
    }

    keyValues {
      key
      values
    }

    weighting
    submode

    quays {
      ...quay_details
    }
  }
`;

export function useGetStopAreaDetails(id: string) {
  const { data, ...rest } = useGetStopAreaDetailsQuery({ variables: { id } });
  const area: StopAreaDetailsFragment | null =
    data?.stop_registry?.stopPlace?.at(0) ?? null;
  return { ...rest, area };
}
