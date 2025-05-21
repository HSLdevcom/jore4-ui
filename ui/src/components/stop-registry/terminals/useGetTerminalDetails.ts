import { gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import {
  GetParentStopPlaceDetailsQuery,
  ParentStopPlaceDetailsFragment,
  useGetParentStopPlaceDetailsLazyQuery,
  useGetParentStopPlaceDetailsQuery,
} from '../../../generated/graphql';
import { useRequiredParams } from '../../../hooks';
import {
  getParentStopPlaceDetailsForEnrichment,
  getParentStopPlacesFromQueryResult,
} from '../../../utils';
import { EnrichedParentStopPlace } from '../../../types';

const GQL_GET_PARENT_STOP_PLACE_DETAILS = gql`
  query getParentStopPlaceDetails($id: String!) {
    stop_registry {
      stopPlace(id: $id, onlyMonomodalStopPlaces: false) {
        ...parent_stop_place_details
      }
    }
  }

  fragment parent_stop_place_details on stop_registry_ParentStopPlace {
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

    geometry {
      type
      coordinates
    }

    keyValues {
      key
      values
    }

    accessibilityAssessment {
      ...accessibility_assessment_details
    }

    children {
      id
      name {
        value
      }
    }
  }
`;

function getEnrichedParentStopPlace(
  parentStopPlace: ParentStopPlaceDetailsFragment | null | undefined,
): EnrichedParentStopPlace | null {
  if (!parentStopPlace) {
    return null;
  }

  return {
    ...parentStopPlace,
    ...getParentStopPlaceDetailsForEnrichment(parentStopPlace),
  };
}

function getEnrichedParentStopPlaceDetailsFromQueryResult(
  data: GetParentStopPlaceDetailsQuery | undefined,
): EnrichedParentStopPlace | null {
  const parentStopPlaces =
    getParentStopPlacesFromQueryResult<ParentStopPlaceDetailsFragment>(
      data?.stop_registry?.stopPlace as
        | ReadonlyArray<ParentStopPlaceDetailsFragment | null>
        | undefined,
    );
  return getEnrichedParentStopPlace(parentStopPlaces.at(0));
}

export function useGetParentStopPlaceDetails() {
  const { id } = useRequiredParams<{ id: string }>();

  const { data, ...rest } = useGetParentStopPlaceDetailsQuery({
    variables: { id },
  });

  const parentStopPlaceDetails = useMemo(
    () => getEnrichedParentStopPlaceDetailsFromQueryResult(data),
    [data],
  );

  return { ...rest, parentStopPlaceDetails };
}

export function useGetParentStopPlaceDetailsLazy() {
  const [getParentStopPlaceDetails] = useGetParentStopPlaceDetailsLazyQuery();

  return useCallback(
    async (id: string) => {
      const { data } = await getParentStopPlaceDetails({ variables: { id } });
      return getEnrichedParentStopPlaceDetailsFromQueryResult(data);
    },
    [getParentStopPlaceDetails],
  );
}
