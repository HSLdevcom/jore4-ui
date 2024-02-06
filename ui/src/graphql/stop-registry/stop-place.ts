import { gql } from '@apollo/client';
import { GetStopPlaceByLabelQuery } from '../../generated/graphql';
import { GqlQueryResult, hasTypeName } from '../types';

const GQL_STOP_PLACE_DEFAULT_FIELDS = gql`
  fragment stop_place_default_fields on stop_registry_StopPlace {
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

const GQL_STOP_PLACE_ALL_FIELDS = gql`
  fragment stop_place_all_fields on stop_registry_StopPlace {
    ...stop_place_default_fields
  }
`;

const GQL_GET_STOP_PLACE_BY_LABEL = gql`
  query GetStopPlaceByLabel($stop_place_label: [String]!) {
    stop_registry {
      stopPlace(key: "label", values: $stop_place_label) {
        ...stop_place_default_fields
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

export const isStopPlace = (
  stopPlaceResult: unknown,
): stopPlaceResult is Pick<StopPlace, '__typename'> => {
  return !!(
    hasTypeName(stopPlaceResult) &&
    // eslint-disable-next-line no-underscore-dangle
    stopPlaceResult.__typename === 'stop_registry_StopPlace'
  );
};

export const getStopDetailsByLabelResult = (
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
