import { gql } from '@apollo/client';
import {
  TimingPlaceForComboboxFragment,
  useGetSelectedTimingPlaceDetailsByIdQuery,
  useGetTimingPlacesForComboboxQuery,
} from '../../generated/graphql';
import { mapToSqlLikeValue, mapToVariables } from '../../utils';

const GQL_GET_TIMING_PLACES_FOR_COMBOBOX = gql`
  query GetTimingPlacesForCombobox($labelPattern: String!) {
    timing_pattern_timing_place(
      limit: 10
      where: { label: { _ilike: $labelPattern } }
      order_by: [{ label: asc }]
    ) {
      ...timing_place_for_combobox
    }
  }
`;

const GQL_GET_SELECTED_TIMING_PLACE_DETAILS_BY_ID = gql`
  query GetSelectedTimingPlaceDetailsById($timing_place_id: uuid!) {
    timing_pattern_timing_place_by_pk(timing_place_id: $timing_place_id) {
      ...timing_place_for_combobox
    }
  }
`;

const GQL_TIMING_PLACE_FOR_COMBOBOX = gql`
  fragment timing_place_for_combobox on timing_pattern_timing_place {
    timing_place_id
    label
    description
  }
`;

export const useChooseTimingPointDropdown = (
  query: string,
  timingPlaceId?: string,
): {
  timingPlaces: TimingPlaceForComboboxFragment[];
  selectedTimingPlace?: TimingPlaceForComboboxFragment;
} => {
  const timingPlacesResult = useGetTimingPlacesForComboboxQuery(
    mapToVariables({
      labelPattern: `${mapToSqlLikeValue(query)}%`,
    }),
  );

  // It is possible that the selected timing place is not in the timing place search results,
  // fetch it separately by id here.
  const selectedTimingPlaceResults = useGetSelectedTimingPlaceDetailsByIdQuery({
    skip: !timingPlaceId,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { timing_place_id: timingPlaceId! },
  });

  const selectedTimingPlace = selectedTimingPlaceResults.data
    ?.timing_pattern_timing_place_by_pk as
    | TimingPlaceForComboboxFragment
    | undefined;

  const timingPlaces = (timingPlacesResult.data?.timing_pattern_timing_place ||
    []) as TimingPlaceForComboboxFragment[];

  return {
    timingPlaces,
    selectedTimingPlace,
  };
};
