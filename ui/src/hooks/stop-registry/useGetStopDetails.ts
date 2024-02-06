import { gql } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import {
  GetStopPlaceByLabelQuery,
  ScheduledStopPointDefaultFieldsFragment,
  StopRegistryEmbeddableMultilingualString,
  StopRegistryNameType,
  useGetStopDetailsByIdQuery,
  useGetStopPlaceByLabelAsyncQuery,
} from '../../generated/graphql';
import { GqlQueryResult, hasTypeName } from '../../graphql';
import { useRequiredParams } from '../useRequiredParams';

const GQL_GET_STOP_DETAILS_BY_ID = gql`
  query GetStopDetailsById($scheduled_stop_point_id: uuid!) {
    service_pattern_scheduled_stop_point_by_pk(
      scheduled_stop_point_id: $scheduled_stop_point_id
    ) {
      ...scheduled_stop_point_default_fields
    }
  }
`;

const GQL_GET_STOP_PLACE_BY_LABEL = gql`
  query GetStopPlaceByLabel($stop_place_label: [String]!) {
    stop_registry {
      stopPlace(key: "label", values: $stop_place_label) {
        id
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
        keyValues {
          key
          values
        }
      }
    }
  }
`;

// The items in stop place query result also contain some types that should be be there at all:
// possible null values and parent stop places.
// We want to omit those here since they're not possible.
type ParentStopPlace = {
  __typename?: 'stop_registry_ParentStopPlace' | undefined;
};
type StopPlaceResultRaw = NonNullable<
  NonNullable<GetStopPlaceByLabelQuery['stop_registry']>['stopPlace']
>[number];
export type StopPlace = Exclude<StopPlaceResultRaw, ParentStopPlace | null>;

const isStopPlace = (
  stopPlaceResult: unknown,
): stopPlaceResult is Pick<StopPlace, '__typename'> => {
  return !!(
    hasTypeName(stopPlaceResult) &&
    // eslint-disable-next-line no-underscore-dangle
    stopPlaceResult.__typename === 'stop_registry_StopPlace'
  );
};

const getStopDetailsByLabelResult = (
  result: GqlQueryResult<GetStopPlaceByLabelQuery>,
): StopPlace | null => {
  const stopPlaces = result.data?.stop_registry?.stopPlace || [];

  if (stopPlaces.length > 1) {
    // We are querying by label, that is (should be) unique, so this shouldn't happen.
    console.warn('Multiple stop places found.', stopPlaces); // eslint-disable-line no-console
  }

  const [stopPlace] = stopPlaces;
  return isStopPlace(stopPlace) ? stopPlace : null;
};

type ExtraStopPlaceDetails = {
  finnishName: string | undefined;
  swedishName: string | undefined;
};

export type EnrichedStopPlace = StopPlace & ExtraStopPlaceDetails;

const findAlternativeName = (
  stopPlace: StopPlace,
  lang: string,
  nameType: StopRegistryNameType = StopRegistryNameType.Translation,
): StopRegistryEmbeddableMultilingualString | null => {
  const matchingName = stopPlace.alternativeNames?.find(
    (an) => an?.name.lang === lang && an.nameType === nameType,
  );
  return matchingName?.name || null;
};

const enrichStopPlace = (stopPlace: StopPlace): EnrichedStopPlace => {
  const extraDetails = {
    finnishName: stopPlace.name?.value || undefined,
    swedishName: findAlternativeName(stopPlace, 'sv_FI')?.value || undefined,
  };

  return {
    ...stopPlace,
    ...extraDetails,
  };
};

/** Gets the stop details, including the stop place, depending on query parameters. */
export type StopWithDetails = ScheduledStopPointDefaultFieldsFragment & {
  stopPlace: EnrichedStopPlace | null;
};

export const useGetStopDetails = (): {
  stopDetails: StopWithDetails | null | undefined;
} => {
  const { id } = useRequiredParams<{ id: string }>();
  const [stopPlace, setStopPlace] = useState<StopPlace | null>(null);
  const [getStopPlaceByLabelQuery] = useGetStopPlaceByLabelAsyncQuery();
  // TODO: observation date?

  const result = useGetStopDetailsByIdQuery({
    variables: { scheduled_stop_point_id: id },
  });
  const stopDetails = result.data?.service_pattern_scheduled_stop_point_by_pk;

  const fetchStopPlace = useCallback(async () => {
    if (stopDetails) {
      const stopPlaceResult = await getStopPlaceByLabelQuery({
        stop_place_label: stopDetails.label,
      });

      const mappedStopPlace = getStopDetailsByLabelResult(stopPlaceResult);

      if (mappedStopPlace) {
        setStopPlace(mappedStopPlace);
      }
    }
  }, [stopDetails, getStopPlaceByLabelQuery]);

  useEffect(() => {
    fetchStopPlace();
  }, [stopDetails, fetchStopPlace]);

  return {
    stopDetails: stopDetails && {
      ...stopDetails,
      stopPlace: stopPlace && enrichStopPlace(stopPlace),
    },
  };
};
