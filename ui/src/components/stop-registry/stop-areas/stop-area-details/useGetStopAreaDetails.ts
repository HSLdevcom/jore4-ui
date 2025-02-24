import { gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import {
  GetStopPlaceDetailsQuery,
  StopPlaceDetailsFragment,
  useGetStopPlaceDetailsLazyQuery,
  useGetStopPlaceDetailsQuery,
} from '../../../../generated/graphql';
import { useRequiredParams } from '../../../../hooks';
import { EnrichedStopPlace } from '../../../../types';
import {
  getStopPlaceDetailsForEnrichment,
  getStopPlacesFromQueryResult,
} from '../../../../utils';

const GQL_GET_STOP_AREA_DETAILS = gql`
  query getStopPlaceDetails($id: String!) {
    stop_registry {
      stopPlace(id: $id, onlyMonomodalStopPlaces: true) {
        ...stop_place_details
      }
    }
  }

  fragment stop_place_details on stop_registry_StopPlace {
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

    quays {
      ...quay_details
    }

    transportMode
    topographicPlace {
      ...topographic_place_details
    }
    fareZones {
      ...fare_zone_details
    }
  }
`;

function getEnrichedStopPlace(
  stopPlace: StopPlaceDetailsFragment | null | undefined,
): EnrichedStopPlace | null {
  if (!stopPlace) {
    return null;
  }

  return {
    ...stopPlace,
    ...getStopPlaceDetailsForEnrichment(stopPlace),
  };
}

function getEnrichedStopPlaceDetailsFromQueryResult(
  data: GetStopPlaceDetailsQuery | undefined,
): EnrichedStopPlace | null {
  const stopPlaces = getStopPlacesFromQueryResult<StopPlaceDetailsFragment>(
    data?.stop_registry?.stopPlace,
  );
  return getEnrichedStopPlace(stopPlaces.at(0));
}

export function useGetStopPlaceDetails() {
  const { id } = useRequiredParams<{ id: string }>();

  const { data, ...rest } = useGetStopPlaceDetailsQuery({
    variables: { id },
  });

  const stopPlaceDetails = useMemo(
    () => getEnrichedStopPlaceDetailsFromQueryResult(data),
    [data],
  );

  return { ...rest, stopPlaceDetails };
}

export function useGetStopPlaceDetailsLazy() {
  const [getStopPlaceDetails] = useGetStopPlaceDetailsLazyQuery();

  return useCallback(
    async (id: string) => {
      const { data } = await getStopPlaceDetails({ variables: { id } });
      return getEnrichedStopPlaceDetailsFromQueryResult(data);
    },
    [getStopPlaceDetails],
  );
}
