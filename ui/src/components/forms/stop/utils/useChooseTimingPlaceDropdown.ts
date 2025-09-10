import { gql } from '@apollo/client';
import { useState } from 'react';
import {
  TimingPlaceForComboboxFragment,
  useGetSelectedTimingPlaceDetailsByIdQuery,
  useGetTimingPlacesForComboboxQuery,
} from '../../../../generated/graphql';
import { useDebouncedString } from '../../../../hooks';
import { mapToSqlLikeValue, mapToVariables } from '../../../../utils';

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

export const useChooseTimingPlaceDropdown = (
  query: string,
  timingPlaceId?: string,
): {
  timingPlaces: ReadonlyArray<TimingPlaceForComboboxFragment>;
  selectedTimingPlace?: TimingPlaceForComboboxFragment;
} => {
  const [debouncedQuery] = useDebouncedString(query, 300);

  const [timingPlaces, setTimingPlaces] =
    useState<ReadonlyArray<TimingPlaceForComboboxFragment>>(Array);
  const timingPlacesResult = useGetTimingPlacesForComboboxQuery(
    mapToVariables({
      labelPattern: `${mapToSqlLikeValue(debouncedQuery)}%`,
    }),
  );

  // It is possible that the selected timing place is not in the timing place search results,
  // fetch it separately by id here.
  const selectedTimingPlaceResults = useGetSelectedTimingPlaceDetailsByIdQuery({
    skip: !timingPlaceId,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { timing_place_id: timingPlaceId! },
  });

  if (
    !timingPlacesResult.loading &&
    timingPlacesResult.data &&
    timingPlacesResult.data.timing_pattern_timing_place !== timingPlaces
  ) {
    setTimingPlaces(timingPlacesResult.data?.timing_pattern_timing_place);
  }

  const selectedTimingPlace = selectedTimingPlaceResults.data
    ?.timing_pattern_timing_place_by_pk as
    | TimingPlaceForComboboxFragment
    | undefined;

  // While fetching the selected timingplace, we can use the data from timingPlaces
  const displayedSelectedTimingPlace = selectedTimingPlaceResults.loading
    ? timingPlaces.find((tp) => tp.timing_place_id === timingPlaceId)
    : selectedTimingPlace;

  return {
    timingPlaces,
    selectedTimingPlace: displayedSelectedTimingPlace,
  };
};
