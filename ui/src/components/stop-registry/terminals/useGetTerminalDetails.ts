import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useMemo } from 'react';
import {
  GetParentStopPlaceDetailsQuery,
  ParentStopPlaceDetailsFragment,
  useGetParentStopPlaceDetailsLazyQuery,
  useGetParentStopPlaceDetailsQuery,
} from '../../../generated/graphql';
import {
  useObservationDateQueryParam,
  useRequiredParams,
} from '../../../hooks';
import { EnrichedParentStopPlace } from '../../../types';
import {
  getParentStopPlaceDetailsForEnrichment,
  getParentStopPlacesFromQueryResult,
} from '../../../utils';

const GQL_GET_PARENT_STOP_PLACE_DETAILS = gql`
  query getParentStopPlaceDetails($privateCode: String!, $validOn: String!) {
    stops_database {
      stops_database_stop_place_newest_version(
        where: {
          private_code_value: { _eq: $privateCode }
          validity_start: { _lte: $validOn }
          _or: [
            { validity_end: { _is_null: true } }
            { validity_end: { _gte: $validOn } }
          ]
        }
      ) {
        id
        TiamatStopPlace {
          ...parent_stop_place_details
        }
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

    description {
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
      quays {
        id
        publicCode
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
  } as EnrichedParentStopPlace;
}

function getEnrichedParentStopPlaceDetailsFromQueryResult(
  data: GetParentStopPlaceDetailsQuery | undefined,
): EnrichedParentStopPlace | null {
  const tiamatStopPlaces =
    data?.stops_database?.stops_database_stop_place_newest_version?.flatMap(
      (item) => item.TiamatStopPlace,
    ) as ReadonlyArray<ParentStopPlaceDetailsFragment | null> | undefined;

  const parentStopPlaces =
    getParentStopPlacesFromQueryResult<ParentStopPlaceDetailsFragment>(
      tiamatStopPlaces,
    );

  return getEnrichedParentStopPlace(parentStopPlaces.at(0));
}

export function useGetParentStopPlaceDetails() {
  const { privateCode } = useRequiredParams<{ privateCode: string }>();
  const { observationDate } = useObservationDateQueryParam();
  const validOn = observationDate.toISODate() ?? DateTime.now().toISODate();

  const { data, ...rest } = useGetParentStopPlaceDetailsQuery({
    variables: { privateCode, validOn },
  });

  const parentStopPlaceDetails = useMemo(
    () => getEnrichedParentStopPlaceDetailsFromQueryResult(data),
    [data],
  );

  return { ...rest, parentStopPlaceDetails };
}

export function useGetParentStopPlaceDetailsLazy() {
  const { observationDate } = useObservationDateQueryParam();
  const [getParentStopPlaceDetails] = useGetParentStopPlaceDetailsLazyQuery();

  return useCallback(
    async (privateCode: string) => {
      const validOn = observationDate.toISODate() ?? DateTime.now().toISODate();
      const { data } = await getParentStopPlaceDetails({
        variables: { privateCode, validOn },
      });
      return getEnrichedParentStopPlaceDetailsFromQueryResult(data);
    },
    [getParentStopPlaceDetails, observationDate],
  );
}
