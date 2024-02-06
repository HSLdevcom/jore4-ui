import { gql } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import {
  ScheduledStopPointDefaultFieldsFragment,
  StopRegistryEmbeddableMultilingualString,
  StopRegistryNameType,
  useGetStopDetailsByIdQuery,
  useGetStopPlaceByLabelAsyncQuery,
} from '../../generated/graphql';
import { StopPlace, getStopDetailsByLabelResult } from '../../graphql';
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
export type EnrichedStopPlaceDetails = {
  finnishName: string | undefined;
  swedishName: string | undefined;
};
const enrichStopPlace = (
  stopPlace: StopPlace,
): StopPlace & EnrichedStopPlaceDetails => {
  return {
    ...stopPlace,
    finnishName: stopPlace.name?.value || undefined,
    swedishName: findAlternativeName(stopPlace, 'sv_FI')?.value || undefined,
  };
};

/** Gets the stop details, including the stop place, depending on query parameters. */
export type StopWithDetails = ScheduledStopPointDefaultFieldsFragment & {
  stopPlace: (StopPlace & EnrichedStopPlaceDetails) | null;
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
