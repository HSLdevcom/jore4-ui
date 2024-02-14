import { gql } from '@apollo/client';
import {
  GetStopDetailsByIdQuery,
  ScheduledStopPointDefaultFieldsFragment,
  StopPlaceDetailsFragment,
  StopRegistryEmbeddableMultilingualString,
  StopRegistryNameType,
  useGetStopDetailsByIdQuery,
} from '../../generated/graphql';
import { GqlQueryResult, hasTypeName } from '../../graphql';
import { useRequiredParams } from '../useRequiredParams';

const GQL_GET_STOP_DETAILS_BY_ID = gql`
  query GetStopDetailsById($scheduled_stop_point_id: uuid!) {
    service_pattern_scheduled_stop_point_by_pk(
      scheduled_stop_point_id: $scheduled_stop_point_id
    ) {
      ...scheduled_stop_point_default_fields
      stop_place_ref
      stop_place {
        ...stop_place_details
      }
    }
  }
`;

const GQL_STOP_PLACE_DETAILS = gql`
  fragment stop_place_details on stop_registry_StopPlace {
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

export type StopPlace = StopPlaceDetailsFragment;

// The items in stop place query result also contain some types that should not be there at all:
// possible null values and parent stop places.
// We want to omit those here since they're not possible.
const isStopPlace = (
  stopPlaceResult: unknown,
): stopPlaceResult is Pick<StopPlace, '__typename'> => {
  return !!(
    (
      hasTypeName(stopPlaceResult) && // Null obviously does not have type name at all.
      // eslint-disable-next-line no-underscore-dangle
      stopPlaceResult.__typename === 'stop_registry_StopPlace'
    ) // For parent type this would be stop_registry_ParentStopPlace
  );
};

const getStopPlaceFromQueryResult = (
  scheduledStopPoint: NonNullable<
    GqlQueryResult<GetStopDetailsByIdQuery>['data']
  >['service_pattern_scheduled_stop_point_by_pk'],
): StopPlace | null => {
  // Should be an object but for whatever reason always returns an array.
  const stopPlaces = scheduledStopPoint?.stop_place || [];

  if (stopPlaces.length > 1) {
    // We are querying by id, that is (should be) unique, so this shouldn't happen.
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
  stop_place: EnrichedStopPlace | null;
};

export const useGetStopDetails = (): {
  stopDetails: StopWithDetails | null | undefined;
} => {
  const { id } = useRequiredParams<{ id: string }>();
  // TODO: observation date?

  const result = useGetStopDetailsByIdQuery({
    variables: { scheduled_stop_point_id: id },
  });
  const stopDetails = result.data?.service_pattern_scheduled_stop_point_by_pk;
  const stopPlace = getStopPlaceFromQueryResult(stopDetails);

  return {
    stopDetails: stopDetails && {
      ...stopDetails,
      stop_place: stopPlace && enrichStopPlace(stopPlace),
    },
  };
};
